const http = require('http');
const https = require('https');

const API_BASE_URL = 'http://localhost:5002';

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const client = parsedUrl.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        let parsedData;
        try {
          parsedData = responseData ? JSON.parse(responseData) : null;
        } catch (e) {
          parsedData = responseData;
        }
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsedData
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test the health check endpoint
async function testHealthCheck() {
  console.log('\n--- Testing Health Check Endpoint ---');
  try {
    const response = await makeRequest(`${API_BASE_URL}/api/health-check`);
    console.log(`Status code: ${response.statusCode}`);
    console.log('Response:', response.data);
    return response.statusCode === 200;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

// Test the Swagger documentation endpoint
async function testSwaggerDocs() {
  console.log('\n--- Testing Swagger Documentation ---');
  try {
    const response = await makeRequest(`${API_BASE_URL}/api-docs/`);
    console.log(`Status code: ${response.statusCode}`);
    console.log(`Content-Type: ${response.headers['content-type']}`);
    return response.statusCode === 200;
  } catch (error) {
    console.error('Swagger docs test failed:', error.message);
    return false;
  }
}

// Test user registration
async function testUserRegistration() {
  console.log('\n--- Testing User Registration ---');
  try {
    const testUser = {
      username: `test_user_${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'Test1234!',
      role: 'student'
    };
    
    const response = await makeRequest(`${API_BASE_URL}/api/users/register`, 'POST', testUser);
    console.log(`Status code: ${response.statusCode}`);
    console.log('Response:', response.data);
    return response.statusCode === 201;
  } catch (error) {
    console.error('User registration test failed:', error.message);
    return false;
  }
}

// Test login
async function testLogin() {
  console.log('\n--- Testing Login ---');
  try {
    const loginData = {
      email: 'admin@example.com',
      password: 'Admin1234!'
    };
    
    const response = await makeRequest(`${API_BASE_URL}/api/users/login`, 'POST', loginData);
    console.log(`Status code: ${response.statusCode}`);
    console.log('Response:', typeof response.data === 'object' ? 'Token received' : 'No token');
    
    if (response.statusCode === 200 && response.data && response.data.token) {
      global.authToken = response.data.token;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting API Tests...');
  
  const results = {};
  
  results.healthCheck = await testHealthCheck();
  results.swaggerDocs = await testSwaggerDocs();
  results.registration = await testUserRegistration();
  results.login = await testLogin();
  
  console.log('\n--- Test Results Summary ---');
  for (const [test, passed] of Object.entries(results)) {
    console.log(`${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  }
  
  const allPassed = Object.values(results).every(result => result === true);
  console.log(`\nOverall Result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
}

// Execute tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 