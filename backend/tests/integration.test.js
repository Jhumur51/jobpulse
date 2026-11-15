const http = require('http');
const app = require('../src/app');

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      const options = {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          server.close();
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      });

      req.on('error', (err) => {
        server.close();
        reject(err);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  });
}

async function runIntegration() {
  console.log('🔄 Verifying Express REST API with ML Service Adapter...\n');

  // 1. Model performance
  console.log('Testing GET /api/models/performance:');
  const perfRes = await makeRequest('/api/models/performance');
  console.log('Status:', perfRes.status);
  console.log('Body success:', perfRes.body.success);

  // 2. Skill trends
  console.log('\nTesting GET /api/skills/trends:');
  const skillRes = await makeRequest('/api/skills/trends');
  console.log('Status:', skillRes.status);
  console.log('Skill items count:', skillRes.body.data?.length);

  // 3. Predictions
  console.log('\nTesting POST /api/predictions:');
  const predRes = await makeRequest('/api/predictions', 'POST', {
    jobRole: 'Machine Learning Engineer',
    location: 'San Francisco, CA',
    horizon: 6,
    modelName: 'Gradient Boosting Regressor',
  });
  console.log('Status:', predRes.status);
  if (predRes.status === 201) {
    console.log('✅ Prediction succeeded!');
    console.log('Model Name:', predRes.body.data?.model_name);
    console.log('Forecasted Volume:', predRes.body.data?.predicted_posting_volume);
    console.log('Growth %:', predRes.body.data?.growth_percentage);
    console.log('Confidence Bounds:', predRes.body.data?.confidence_interval);
    console.log('Monthly Forecast Points:', predRes.body.data?.monthly_forecast?.length);
  } else {
    console.log('Status Note:', predRes.status, predRes.body.message);
  }

  console.log('\nIntegration test completed.');
}

runIntegration().catch((e) => {
  console.error('Integration test failed:', e);
  process.exit(1);
});

