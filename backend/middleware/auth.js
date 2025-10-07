const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        let token;

        // Check for token in header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find user and check if still exists
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Token is no longer valid. User not found.'
                });
            }

            // Check if user account is active
            if (user.status !== 'active') {
                return res.status(403).json({
                    success: false,
                    message: `Account is ${user.status}. Please contact support.`
                });
            }

            // Check if password was changed after token was issued
            if (user.changedPasswordAfter(decoded.iat)) {
                return res.status(401).json({
                    success: false,
                    message: 'User recently changed password. Please log in again.'
                });
            }

            // Grant access to protected route
            req.user = user;
            next();

        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            } else if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired. Please log in again.'
                });
            }
            
            throw error;
        }

    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during authentication',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Middleware to check if user is verified
const requireVerified = (req, res, next) => {
    if (!req.user.isVerified) {
        return res.status(403).json({
            success: false,
            message: 'Account verification required. Please verify your email and student ID.'
        });
    }
    next();
};

// Middleware to check if email is verified
const requireEmailVerified = (req, res, next) => {
    if (!req.user.emailVerified) {
        return res.status(403).json({
            success: false,
            message: 'Email verification required. Please check your email and click the verification link.'
        });
    }
    next();
};

// Middleware to restrict access to specific roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role || 'user')) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }
        next();
    };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        // Check for token in header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // If no token, continue without authentication
        if (!token) {
            return next();
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find user
            const user = await User.findById(decoded.id).select('-password');
            
            if (user && user.status === 'active' && !user.changedPasswordAfter(decoded.iat)) {
                req.user = user;
            }

        } catch (error) {
            // Ignore token errors in optional auth
            console.log('Optional auth token error:', error.message);
        }

        next();

    } catch (error) {
        console.error('Optional auth middleware error:', error);
        // Don't fail the request, just continue without auth
        next();
    }
};

module.exports = {
    auth,
    requireVerified,
    requireEmailVerified,
    restrictTo,
    optionalAuth
};