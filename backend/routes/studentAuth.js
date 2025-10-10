// Student Authentication Routes
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { generateToken } = require('../utils/token');

// ============================================
// REGISTER STUDENT
// ============================================
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, matric, phone, whatsapp, department, password } = req.body;
        
        // Validate required fields
        if (!fullName || !email || !matric || !phone || !whatsapp || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }
        
        // Check if student already exists
        const existingStudent = await Student.findOne({
            $or: [
                { email: email.toLowerCase() },
                { matric: matric.toUpperCase() }
            ]
        });
        
        if (existingStudent) {
            if (existingStudent.email === email.toLowerCase()) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }
            if (existingStudent.matric === matric.toUpperCase()) {
                return res.status(400).json({
                    success: false,
                    message: 'Matric number already registered'
                });
            }
        }
        
        // Create new student
        const student = new Student({
            fullName,
            email: email.toLowerCase(),
            matric: matric.toUpperCase(),
            phone,
            whatsapp,
            department,
            password
        });
        
        await student.save();
        
        // Generate token
        const token = generateToken(student, 'student');
        
        // Update last login
        await student.updateLastLogin();
        
        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            data: student.getPublicProfile(),
            token
        });
        
        console.log(`✅ New student registered: ${student.fullName} (${student.email})`);
    } catch (error) {
        console.error('Student registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering student',
            error: error.message
        });
    }
});

// ============================================
// LOGIN STUDENT
// ============================================
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or matric
        
        // Validate required fields
        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email/matric and password'
            });
        }
        
        // Find student by email or matric (include password for comparison)
        const student = await Student.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { matric: identifier.toUpperCase() }
            ]
        }).select('+password');
        
        if (!student) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Check password
        const isPasswordCorrect = await student.comparePassword(password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Generate token
        const token = generateToken(student, 'student');
        
        // Update last login
        await student.updateLastLogin();
        
        res.json({
            success: true,
            message: 'Login successful',
            data: student.getPublicProfile(),
            token
        });
        
        console.log(`✅ Student logged in: ${student.fullName} (${student.email})`);
    } catch (error) {
        console.error('Student login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
});

// ============================================
// GET STUDENT PROFILE (Protected)
// ============================================
router.get('/profile', async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
        
        // Verify token and get student
        const { verifyToken } = require('../utils/token');
        const decoded = verifyToken(token);
        
        if (decoded.userType !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const student = await Student.findById(decoded.userId);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        res.json({
            success: true,
            data: student.getPublicProfile()
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
});

// ============================================
// SAVE HOSTEL (Protected)
// ============================================
router.post('/save-hostel/:hostelId', async (req, res) => {
    try {
        const { hostelId } = req.params;
        
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
        
        // Verify token and get student
        const { verifyToken } = require('../utils/token');
        const decoded = verifyToken(token);
        
        const student = await Student.findById(decoded.userId);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        // Check if already saved
        if (student.savedHostels.includes(hostelId)) {
            return res.status(400).json({
                success: false,
                message: 'Hostel already saved'
            });
        }
        
        // Add to saved hostels
        student.savedHostels.push(hostelId);
        await student.save();
        
        res.json({
            success: true,
            message: 'Hostel saved successfully',
            data: { savedHostels: student.savedHostels }
        });
    } catch (error) {
        console.error('Save hostel error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving hostel',
            error: error.message
        });
    }
});

// ============================================
// GET SAVED HOSTELS (Protected)
// ============================================
router.get('/saved-hostels', async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
        
        // Verify token and get student
        const { verifyToken } = require('../utils/token');
        const decoded = verifyToken(token);
        
        const student = await Student.findById(decoded.userId).populate('savedHostels');
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        res.json({
            success: true,
            data: student.savedHostels
        });
    } catch (error) {
        console.error('Get saved hostels error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching saved hostels',
            error: error.message
        });
    }
});

module.exports = router;
