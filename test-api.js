// Test login
async function testLogin() {
  console.log('\nTesting login...');
  
  // Use credentials from successful registration, or fallback to default
  const credentials = global.testCredentials || {
    email: 'faculty@test.com',
    password: 'password123'
  };
  
  console.log('Using credentials:', credentials);
  
  const options = {
    hostname: 'localhost',
    port: 5002,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options, credentials);
    if (response.message) {
      console.log('Login response message:', response.message);
      console.log('Login test failed');
      return null;
    }
    console.log('Login test passed:', !!response.token);
    return response.token;
  } catch (error) {
    console.error('Login test failed:', error);
    return null;
  }
}

// Test faculty registration
async function testFacultyRegistration() {
  // Create a unique email using timestamp
  const uniqueEmail = `faculty_${Date.now()}@test.com`;
  const uniqueEmployeeId = `EMP${Date.now()}`;
  
  console.log('\nTesting faculty registration...');
  console.log('Using credentials:', { 
    email: uniqueEmail, 
    employeeId: uniqueEmployeeId 
  });
  
  const options = {
    hostname: 'localhost',
    port: 5002,
    path: '/api/auth/register/faculty',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const data = {
    firstName: 'Test',
    lastName: 'Faculty',
    email: uniqueEmail,
    password: 'password123',
    employeeId: uniqueEmployeeId,
    department: 'Computer Science'
  };

  try {
    const response = await makeRequest(options, data);
    if (response.message) {
      console.log('Registration response message:', response.message);
      console.log('Faculty registration test failed');
      return null;
    }
    console.log('Faculty registration test passed:', !!response.token);
    // Save the credentials for later login test
    global.testCredentials = {
      email: uniqueEmail,
      password: 'password123'
    };
    return response.token;
  } catch (error) {
    console.error('Faculty registration test failed:', error);
    return null;
  }
}

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    console.log(`Making ${method} request to: ${url}`);
    const parsedUrl = new URL(url);
    // ... existing code ...
  });
}

// Test the health check endpoint
async function testHealthCheck() {
  console.log('\n--- Testing Health Check Endpoint ---');
  try {
    console.log(`Connecting to: ${API_BASE_URL}/api/health-check`);
    const response = await makeRequest(`${API_BASE_URL}/api/health-check`);
    console.log(`Status code: ${response.statusCode}`);
    console.log('Response:', response.data);
    return response.statusCode === 200;
  } catch (error) {
    console.error('Health check failed:', error.toString());
    console.error('Error details:', error.code || 'No error code');
    return false;
  }
} 