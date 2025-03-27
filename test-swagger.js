const http = require('http');

// Function to make a simple HTTP request
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        console.log(`Status code: ${res.statusCode}`);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      console.error(`Error with request to ${options.path}:`, error);
      reject(error);
    });

    req.end();
  });
}

// Test Swagger documentation endpoint
async function testSwaggerDocumentation() {
  console.log('Testing Swagger documentation endpoint...');
  const options = {
    hostname: 'localhost',
    port: 5002,
    path: '/api-docs/',
    method: 'GET'
  };

  try {
    const response = await makeRequest(options);
    console.log(`Swagger docs endpoint responded with status: ${response.statusCode}`);
    console.log(`Content-Type: ${response.headers['content-type']}`);
    
    if (response.statusCode === 200) {
      console.log('Swagger documentation is working correctly!');
      return true;
    } else {
      console.log('Swagger documentation is not available.');
      return false;
    }
  } catch (error) {
    console.error('Swagger documentation test failed:', error);
    return false;
  }
}

// Test health check endpoint
async function testHealthCheck() {
  console.log('\nTesting health check endpoint...');
  const options = {
    hostname: 'localhost',
    port: 5002,
    path: '/api/health-check',
    method: 'GET'
  };

  try {
    const response = await makeRequest(options);
    if (response.statusCode === 200) {
      console.log('Health check endpoint is working correctly!');
      return true;
    } else {
      console.log('Health check endpoint returned non-200 status code.');
      return false;
    }
  } catch (error) {
    console.error('Health check test failed:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  const swaggerResult = await testSwaggerDocumentation();
  const healthCheckResult = await testHealthCheck();
  
  console.log('\n--- Test Summary ---');
  console.log(`Swagger Documentation: ${swaggerResult ? 'PASS' : 'FAIL'}`);
  console.log(`Health Check: ${healthCheckResult ? 'PASS' : 'FAIL'}`);
  
  if (swaggerResult && healthCheckResult) {
    console.log('\nAPI is running and configured correctly!');
  } else {
    console.log('\nSome tests failed. Check logs for details.');
  }
}

// Run the tests
runTests(); 