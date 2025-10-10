const { verifyToken, extractToken } = require('../utils/token');
const Admin = require('../models/Admin');

/**
 * Middleware to verify JWT token and authenticate admin
 */
const adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if token is for admin
    if (decoded.userType !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Get admin from database
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found.'
      });
    }

    // Attach admin to request object
    req.admin = admin;
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token.',
      error: error.message
    });
  }
};

/**
 * Middleware to check if admin is super-admin
 */
const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'super-admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Super admin privileges required.'
    });
  }
  next();
};

module.exports = {
  adminAuth,
  requireSuperAdmin
};
