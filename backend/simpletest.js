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
        try {
          console.log(`Status code: ${res.statusCode}`);
          if (responseData) {
            const jsonData = JSON.parse(responseData);
            console.log('Response:', jsonData);
          }
          resolve(true);
        } catch (e) {
          console.log('Non-JSON response or empty response');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Error with request to ${options.path}:`, error);
      reject(error);
    });

    req.end();
  });
}

// Test health check endpoint
async function testHealthCheck() {
  console.log('Testing health check endpoint...');
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/health-check',
    method: 'GET'
  };

  try {
    await makeRequest(options);
    return true;
  } catch (error) {
    console.error('Health check test failed');
    return false;
  }
}

// Test Swagger documentation endpoint
async function testSwaggerDocs() {
  console.log('\nTesting Swagger documentation endpoint...');
  const options = {
    hostname: 'localhost',
    port: 5002,
    path: '/api-docs/',
    method: 'GET'
  };

  try {
    const req = http.request(options, (res) => {
      console.log(`Status code: ${res.statusCode}`);
      console.log(`Content-Type: ${res.headers['content-type']}`);
      
      if (res.statusCode === 200) {
        console.log('Swagger documentation is working correctly!');
      } else {
        console.log('Swagger documentation is not available.');
      }
    });

    req.on('error', (error) => {
      console.error(`Error with request to ${options.path}:`, error);
    });

    req.end();
    
    return true;
  } catch (error) {
    console.error('Swagger documentation test failed');
    return false;
  }
}

// Run tests
async function runTests() {
  await testHealthCheck();
  await testSwaggerDocs();
}

runTests(); 