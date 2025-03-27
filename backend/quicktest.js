const http = require('http');

console.log('Testing connection to localhost:5000...');

// Simple HTTP GET request
http.get('http://localhost:5000/api/health-check', (res) => {
  const { statusCode } = res;
  console.log(`Status Code: ${statusCode}`);

  res.setEncoding('utf8');
  let rawData = '';
  
  res.on('data', (chunk) => { rawData += chunk; });
  
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log('Response data:', parsedData);
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
      console.log('Raw response:', rawData);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
}); 