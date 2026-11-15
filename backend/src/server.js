const app = require('./app');
const env = require('./config/env');
const mlService = require('./services/ml.service');

const server = app.listen(env.port, async () => {
  console.log(`=======================================================`);
  console.log(`  🚀 JobPulse Backend REST API running on port ${env.port}`);
  console.log(`  🌐 Environment: ${env.nodeEnv}`);
  console.log(`  🔗 Client URL: ${env.clientUrl}`);
  console.log(`  🤖 Python ML Service: ${env.mlService.url}`);
  console.log(`=======================================================`);

  // Probe ML Service connection
  const mlHealth = await mlService.checkHealth();
  if (mlHealth.status === 'healthy') {
    console.log(`  ✅ ML Service Connected successfully!`);
    console.log(`     Loaded models: ${mlHealth.models_loaded?.join(', ')}`);
  } else {
    console.log(`  ⚠️  ML Service currently offline at ${env.mlService.url} (Start it with: python main.py)`);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = server;

