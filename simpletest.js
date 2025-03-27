const http = require('http');

// Make a simple HTTP request to the health check endpoint
function checkServerHealth() {
  console.log('Testing server health at: http://localhost:5000/api/health-check');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/health-check',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        console.log('RESPONSE:', parsedData);
        console.log('Server is healthy:', res.statusCode === 200);
      } catch (e) {
        console.log('Raw response:', data);
        console.log('Error parsing JSON:', e.message);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`ERROR: ${e.message}`);
    console.error('Server may not be running or accessible');
  });

  req.end();
}

// Run the health check
checkServerHealth(); 