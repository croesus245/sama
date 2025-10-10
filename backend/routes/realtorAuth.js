const express = require('express');
const router = express.Router();
const Realtor = require('../models/Realtor');
const Admin = require('../models/Admin');
const { generateToken } = require('../utils/token');
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

/**
 * @route   POST /api/realtor-auth/register
 * @desc    Register new realtor
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      phoneNumber,
      whatsapp,
      businessName,
      businessAddress
    } = req.body;

    // Validate required fields
    if (!email || !password || !fullName || !phoneNumber || !whatsapp) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: email, password, fullName, phoneNumber, whatsapp'
      });
    }

    // Check if email already exists
    const existingRealtor = await Realtor.findOne({ email: email.toLowerCase() });
    if (existingRealtor) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered. Please use a different email or login.'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long'
      });
    }

    // Create new realtor
    const realtor = new Realtor({
      email: email.toLowerCase(),
      password,
      fullName,
      phoneNumber,
      whatsapp,
      businessName: businessName || '',
      businessAddress: businessAddress || '',
      status: 'pending' // New realtors start as pending
    });

    await realtor.save();

    // Return success (don't auto-login, wait for admin approval)
    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Your account is pending admin approval. You will be notified once approved.',
      data: {
        realtor: realtor.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed. Please try again.',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/realtor-auth/login
 * @desc    Login realtor
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Find realtor by email (include password for comparison)
    const realtor = await Realtor.findOne({ email: email.toLowerCase() }).select('+password');

    if (!realtor) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Compare passwords
    const isMatch = await realtor.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check account status
    if (realtor.status === 'suspended') {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been suspended. Please contact admin for assistance.'
      });
    }

    // Update last login
    await realtor.updateLastLogin();

    // Generate token
    const token = generateToken(realtor, 'realtor');

    // Return success with token
    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        realtor: realtor.getPublicProfile(),
        needsApproval: realtor.status === 'pending'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed. Please try again.',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/realtor-auth/admin-login
 * @desc    Login admin
 * @access  Public
 */
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Find admin by email (include password for comparison)
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid admin credentials'
      });
    }

    // Compare passwords
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid admin credentials'
      });
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate token
    const token = generateToken(admin, 'admin');

    // Return success with token
    res.json({
      status: 'success',
      message: 'Admin login successful',
      data: {
        token,
        admin: admin.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Admin login failed. Please try again.',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/realtor-auth/profile
 * @desc    Get logged-in realtor profile
 * @access  Private (Realtor)
 */
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: {
        realtor: req.realtor.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get profile',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/realtor-auth/verify
 * @desc    Verify token validity
 * @access  Private
 */
router.get('/verify', auth, async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: 'Token is valid',
      data: {
        realtor: req.realtor.getPublicProfile()
      }
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
});

/**
 * @route   GET /api/realtor-auth/admin-verify
 * @desc    Verify admin token validity
 * @access  Private (Admin)
 */
router.get('/admin-verify', adminAuth, async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: 'Admin token is valid',
      data: {
        admin: req.admin.getPublicProfile()
      }
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid admin token'
    });
  }
});

module.exports = router;
