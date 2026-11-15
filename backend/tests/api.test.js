const http = require('http');
const app = require('../src/app');

function makeRequest(path, method = 'GET', body = null, headers = {}) {
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
          ...headers,
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

async function runTests() {
  console.log('🧪 Running JobPulse Backend API Test Suite...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ❌ FAIL: ${name} ->`, e.message);
    }
  }

  // 1. Health check
  await test('GET /health returns healthy status', async () => {
    const res = await makeRequest('/health');
    if (res.status !== 200 || res.body.status !== 'healthy') {
      throw new Error(`Expected 200 healthy, got ${res.status}`);
    }
  });

  // 2. Auth: Register
  let authToken = '';
  await test('POST /api/auth/register creates user and returns JWT', async () => {
    const email = `tester_${Date.now()}@jobpulse.ai`;
    const res = await makeRequest('/api/auth/register', 'POST', {
      name: 'Integration Tester',
      email,
      password: 'testPassword123',
    });
    if (res.status !== 201 || !res.body.data.accessToken) {
      throw new Error(`Failed to register: ${JSON.stringify(res.body)}`);
    }
    authToken = res.body.data.accessToken;
  });

  // 3. Auth: Login
  await test('POST /api/auth/login authenticates with valid credentials', async () => {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: 'admin@jobpulse.ai',
      password: 'admin123',
    });
    if (res.status !== 200 || !res.body.data.accessToken) {
      throw new Error(`Failed login: ${JSON.stringify(res.body)}`);
    }
  });

  // 4. Dashboard: Summary
  await test('GET /api/dashboard/summary returns KPIs', async () => {
    const res = await makeRequest('/api/dashboard/summary');
    if (res.status !== 200 || !res.body.data.totalJobPostings) {
      throw new Error(`Failed to get summary: ${JSON.stringify(res.body)}`);
    }
  });

  // 5. Dashboard: Top Roles
  await test('GET /api/dashboard/top-roles returns roles', async () => {
    const res = await makeRequest('/api/dashboard/top-roles');
    if (res.status !== 200 || !Array.isArray(res.body.data)) {
      throw new Error(`Failed top-roles: ${JSON.stringify(res.body)}`);
    }
  });

  // 6. Jobs: List
  await test('GET /api/jobs returns paginated jobs', async () => {
    const res = await makeRequest('/api/jobs?limit=5');
    if (res.status !== 200 || res.body.data.length === 0) {
      throw new Error(`Failed jobs list: ${JSON.stringify(res.body)}`);
    }
  });

  // 7. Jobs: Filters
  await test('GET /api/jobs/filters returns filter lists', async () => {
    const res = await makeRequest('/api/jobs/filters');
    if (res.status !== 200 || !res.body.data.locations) {
      throw new Error(`Failed filters: ${JSON.stringify(res.body)}`);
    }
  });

  // 8. Datasets: List
  await test('GET /api/datasets returns datasets', async () => {
    const res = await makeRequest('/api/datasets');
    if (res.status !== 200 || !Array.isArray(res.body.data)) {
      throw new Error(`Failed datasets: ${JSON.stringify(res.body)}`);
    }
  });

  // 9. Protected route without auth should return 401
  await test('GET /api/users/profile returns 401 Unauthorized without token', async () => {
    const res = await makeRequest('/api/users/profile');
    if (res.status !== 401) {
      throw new Error(`Expected 401, got ${res.status}`);
    }
  });

  // 10. Protected route with auth returns 200
  await test('GET /api/users/profile returns 200 with valid Bearer token', async () => {
    const res = await makeRequest('/api/users/profile', 'GET', null, {
      Authorization: `Bearer ${authToken}`,
    });
    if (res.status !== 200 || !res.body.data.email) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    }
  });

  // 11. Career: Skill Gap Analysis
  await test('POST /api/career/skill-gap returns match percentage and missing skills', async () => {
    const res = await makeRequest('/api/career/skill-gap', 'POST', {
      targetRole: 'Machine Learning Engineer',
      userSkills: ['Python', 'SQL', 'Docker'],
    });
    if (res.status !== 200 || typeof res.body.data.matchPercentage !== 'number') {
      throw new Error(`Skill gap failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 12. Career: Salary Estimation
  await test('POST /api/career/salary-estimate calculates salary range and progression', async () => {
    const res = await makeRequest('/api/career/salary-estimate', 'POST', {
      role: 'Data Scientist',
      experienceLevel: 'Mid-Level (3-5 yrs)',
      location: 'Remote',
    });
    if (res.status !== 200 || !res.body.data.estimatedMedian) {
      throw new Error(`Salary estimate failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 13. Career: Learning Roadmap
  await test('GET /api/career/roadmap/:role returns 3-phase curriculum', async () => {
    const res = await makeRequest('/api/career/roadmap/Machine%20Learning%20Engineer');
    if (res.status !== 200 || !Array.isArray(res.body.data.phases)) {
      throw new Error(`Roadmap failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 14. Career: Role Comparison
  await test('GET /api/career/compare compares two roles head-to-head', async () => {
    const res = await makeRequest('/api/career/compare?roleA=Data%20Scientist&roleB=Machine%20Learning%20Engineer');
    if (res.status !== 200 || !res.body.data.commonSkills) {
      throw new Error(`Role comparison failed: ${JSON.stringify(res.body)}`);
    }
  });

  console.log(`\n📊 Test Results: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)`);
  if (passed === total) {
    console.log('🎉 All Backend API tests passed with flying colors!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});

