// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  console.error('Request path:', req.path);
  console.error('Request method:', req.method);
  console.error('Request body:', req.body);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
}); 