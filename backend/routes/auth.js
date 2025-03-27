const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const auth = require('../middleware/auth');
const { loginValidation, registerValidation } = require('../middleware/validation');

/**
 * @swagger
 * /api/auth/register/faculty:
 *   post:
 *     summary: Register a new faculty member
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
 *               - firstName
 *               - lastName
 *               - employeeId
 *               - department
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               employeeId:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Faculty registered successfully
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
 *         description: Email or Employee ID already in use
 *       500:
 *         description: Server error
 */
router.post('/register/faculty', registerValidation, async (req, res) => {
  try {
    const { email, password, firstName, lastName, employeeId, department } = req.body;

    // Check if faculty exists with this email or employeeId
    const existingFaculty = await Faculty.findOne({ 
      where: {
        [Op.or]: [
          { email: email },
          { employeeId: employeeId }
        ]
      }
    });
    
    if (existingFaculty) {
      if (existingFaculty.email === email) {
        return res.status(400).json({ message: 'Email already in use' });
      } else {
        return res.status(400).json({ message: 'Employee ID already in use' });
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new faculty
    const faculty = await Faculty.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      employeeId,
      department,
      ...req.body // Include any other fields from request body
    });

    // Create JWT token
    const token = jwt.sign(
      { id: faculty.id, role: 'faculty' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response with token
    res.status(201).json({
      success: true,
      token,
      user: {
        id: faculty.id,
        role: 'faculty',
        firstName: faculty.firstName,
        lastName: faculty.lastName,
        email: faculty.email
      }
    });
  } catch (err) {
    console.error('Faculty registration error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @swagger
 * /api/auth/register/student:
 *   post:
 *     summary: Register a new student
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
 *               - firstName
 *               - lastName
 *               - rollNumber
 *               - classId
 *               - section
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               rollNumber:
 *                 type: string
 *               classId:
 *                 type: string
 *               section:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student registered successfully
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
 *         description: Email or Roll number already in use
 *       500:
 *         description: Server error
 */
router.post('/register/student', registerValidation, async (req, res) => {
  try {
    const { email, password, firstName, lastName, rollNumber, classId, section } = req.body;

    // Check if student exists with this email or rollNumber
    const existingStudent = await Student.findOne({ 
      where: {
        [Op.or]: [
          { email: email },
          { rollNumber: rollNumber }
        ]
      }
    });
    
    if (existingStudent) {
      if (existingStudent.email === email) {
        return res.status(400).json({ message: 'Email already in use' });
      } else {
        return res.status(400).json({ message: 'Roll number already in use' });
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new student
    const student = await Student.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      rollNumber,
      classId,
      section,
      ...req.body // Include any other fields from request body
    });

    // Create JWT token
    const token = jwt.sign(
      { id: student.id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response with token
    res.status(201).json({
      success: true,
      token,
      user: {
        id: student.id,
        role: 'student',
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email
      }
    });
  } catch (err) {
    console.error('Student registration error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: err.message
    });
  }
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
 *       401:
 *         description: Account deactivated
 *       500:
 *         description: Server error
 */
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if password is provided
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Check if user is a faculty member
    let user = await Faculty.findOne({ where: { email } });
    let role = 'faculty';
    
    // If not faculty, check if user is a student
    if (!user) {
      user = await Student.findOne({ where: { email } });
      role = 'student';
    }
    
    // If no user found with this email
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // If user is not active
    if (user.isActive === false) {
      return res.status(401).json({ message: 'Your account has been deactivated. Please contact the administrator.' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response with token
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: err.message
    });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/me', auth, async (req, res) => {
  try {
    let user;
    
    // Get user based on role
    if (req.user.role === 'faculty') {
      user = await Faculty.findByPk(req.user.id);
    } else if (req.user.role === 'student') {
      user = await Student.findByPk(req.user.id);
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        role: req.user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        // Include other user details as needed
        ...(req.user.role === 'faculty' ? { 
          department: user.department,
          position: user.position,
          employeeId: user.employeeId
        } : {}),
        ...(req.user.role === 'student' ? {
          rollNumber: user.rollNumber,
          classId: user.classId,
          section: user.section
        } : {})
      }
    });
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: err.message
    });
  }
});

module.exports = router; 