const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize, testConnection } = require('./config/database');
const { swaggerUi, swaggerDocs } = require('./swagger');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setup Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     description: Returns a welcome message for the API
 *     responses:
 *       200:
 *         description: Welcome message
 */
// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Teacher Assistant API');
});

/**
 * @swagger
 * /api/health-check:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: API is running
 */
// Health check route
app.get('/api/health-check', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Import models with associations
require('./models/index');

// Import routes
const authRoutes = require('./routes/auth');
const facultyRoutes = require('./routes/faculty');
const studentRoutes = require('./routes/student');
const courseRoutes = require('./routes/course');
const attendanceRoutes = require('./routes/attendance');
const marksRoutes = require('./routes/mark');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', marksRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// Sync database models
const syncDatabase = async () => {
  try {
    // In development, force true will drop tables and recreate them
    const syncOptions = process.env.NODE_ENV === 'production' 
      ? { alter: true } 
      : { force: true };
      
    await sequelize.sync(syncOptions);
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  // Test database connection first
  await testConnection();
  
  // Sync database models
  await syncDatabase();
  
  // Start listening
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server
});

module.exports = app; // For testing purposes 