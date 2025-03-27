const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Teacher Assistant API',
      version: '1.0.0',
      description: 'API documentation for the Teacher Assistant Application',
      contact: {
        name: 'API Support',
        email: 'support@teachassistant.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./simple-server.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
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
app.get('/api/health-check', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid email or password
 */
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simplified login logic (no database)
  if (email === 'test@example.com' && password === 'password') {
    res.json({
      success: true,
      token: 'sample-jwt-token',
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'faculty'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 fileUrl:
 *                   type: string
 *       400:
 *         description: No file uploaded
 */
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      message: 'No file uploaded' 
    });
  }
  
  res.json({
    success: true,
    message: 'File uploaded successfully',
    fileUrl: `/uploads/${req.file.filename}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server
}); 