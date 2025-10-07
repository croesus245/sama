const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const User = require('../models/User');
const Realtor = require('../models/Realtor');
const { sendEmail } = require('../utils/email');
const { generateToken, generateRefreshToken } = require('../utils/auth');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later',
        retryAfter: '15 minutes'
    },
    skipSuccessfulRequests: true
});

const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 registration attempts per hour
    message: {
        error: 'Too many registration attempts, please try again later',
        retryAfter: '1 hour'
    }
});

// Input validation rules
const registerValidation = [
    body('firstName').notEmpty().withMessage('First name is required').trim().escape(),
    body('lastName').notEmpty().withMessage('Last name is required').trim().escape(),
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('phone').isMobilePhone('any').withMessage('Please enter a valid phone number'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('studentId').notEmpty().withMessage('Student ID is required').trim().toUpperCase(),
    body('faculty').notEmpty().withMessage('Faculty is required').trim().escape(),
    body('department').notEmpty().withMessage('Department is required').trim().escape(),
    body('yearOfStudy').isInt({ min: 1, max: 7 }).withMessage('Year of study must be between 1 and 7'),
    body('graduationYear').isInt({ min: new Date().getFullYear(), max: new Date().getFullYear() + 10 })
        .withMessage('Graduation year must be valid'),
    body('dateOfBirth').isISO8601().withMessage('Please enter a valid date of birth'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Please select a valid gender')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
];

const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail()
];

const resetPasswordValidation = [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', registrationLimiter, registerValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const {
            firstName, lastName, email, phone, password, studentId,
            faculty, department, yearOfStudy, graduationYear,
            dateOfBirth, gender, bio
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email },
                { studentId },
                { phone }
            ]
        });

        if (existingUser) {
            let field = 'email';
            if (existingUser.studentId === studentId) field = 'student ID';
            else if (existingUser.phone === phone) field = 'phone number';
            
            return res.status(400).json({
                success: false,
                message: `User with this ${field} already exists`
            });
        }

        // Validate age (must be at least 16)
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 16) {
            return res.status(400).json({
                success: false,
                message: 'You must be at least 16 years old to register'
            });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            studentId,
            faculty,
            department,
            yearOfStudy,
            graduationYear,
            dateOfBirth: birthDate,
            gender,
            bio: bio || '',
            verificationToken,
            university: 'Federal University of Technology, Akure (FUTA)'
        });

        // Send verification email
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
        
        try {
            await sendEmail({
                to: user.email,
                subject: 'Verify Your Email - MWG Hostels',
                template: 'verification',
                context: {
                    firstName: user.firstName,
                    verificationUrl,
                    studentId: user.studentId
                }
            });
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // Don't fail registration if email fails
        }

        // Generate JWT token
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    studentId: user.studentId,
                    isVerified: user.isVerified,
                    emailVerified: user.emailVerified
                },
                token,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authLimiter, loginValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password, rememberMe } = req.body;

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is locked
        if (user.isLocked) {
            return res.status(423).json({
                success: false,
                message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.',
                lockUntil: user.lockUntil
            });
        }

        // Check if account is suspended or banned
        if (user.status === 'suspended' || user.status === 'banned') {
            return res.status(403).json({
                success: false,
                message: `Account is ${user.status}. Please contact support for assistance.`
            });
        }

        // Check password
        const isPasswordValid = await user.matchPassword(password);
        
        if (!isPasswordValid) {
            // Increment login attempts
            await user.incLoginAttempts();
            
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Reset login attempts on successful login
        if (user.loginAttempts > 0) {
            await user.resetLoginAttempts();
        }

        // Update last login
        user.lastLogin = Date.now();
        user.lastActive = Date.now();
        await user.save();

        // Generate tokens
        const tokenExpiry = rememberMe ? '30d' : '7d';
        const token = generateToken(user._id, tokenExpiry);
        const refreshToken = generateRefreshToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    studentId: user.studentId,
                    isVerified: user.isVerified,
                    emailVerified: user.emailVerified,
                    avatar: user.avatar,
                    status: user.status
                },
                token,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
router.get('/verify-email/:token', async (req, res) => {
    try {
        const { token } = req.params;

        // Find user with verification token
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        // Mark email as verified
        user.emailVerified = true;
        user.verificationToken = undefined;
        
        // If this is the first verification, mark as verified
        if (!user.isVerified && user.emailVerified) {
            user.isVerified = true;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully! You can now access all platform features.'
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during email verification',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
router.post('/resend-verification', require('../middleware/auth').auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        await user.save();

        // Send verification email
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
        
        await sendEmail({
            to: user.email,
            subject: 'Verify Your Email - MWG Hostels',
            template: 'verification',
            context: {
                firstName: user.firstName,
                verificationUrl,
                studentId: user.studentId
            }
        });

        res.status(200).json({
            success: true,
            message: 'Verification email sent successfully'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error sending verification email',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', authLimiter, forgotPasswordValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if email exists or not
            return res.status(200).json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // Send reset email
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
        
        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request - MWG Hostels',
                template: 'passwordReset',
                context: {
                    firstName: user.firstName,
                    resetUrl,
                    expiryTime: '10 minutes'
                }
            });

            res.status(200).json({
                success: true,
                message: 'Password reset email sent successfully'
            });

        } catch (emailError) {
            // Reset the token fields if email fails
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            return res.status(500).json({
                success: false,
                message: 'Failed to send password reset email. Please try again.'
            });
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error processing password reset request',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
router.post('/reset-password/:token', resetPasswordValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { token } = req.params;
        const { password } = req.body;

        // Hash token and find user
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired password reset token'
            });
        }

        // Set new password
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.passwordChangedAt = Date.now();

        await user.save();

        // Generate new token
        const jwtToken = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            data: {
                token: jwtToken
            }
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error resetting password',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new tokens
        const newToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                token: newToken,
                refreshToken: newRefreshToken
            }
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', require('../middleware/auth').auth, async (req, res) => {
    try {
        // Update last active time
        await User.findByIdAndUpdate(req.user.id, {
            lastActive: Date.now()
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', require('../middleware/auth').auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('savedProperties.property', 'title location pricing images')
            .populate('friends.user', 'firstName lastName avatar');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user
            }
        });

    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving user data',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;