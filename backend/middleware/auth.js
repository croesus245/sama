const { verifyToken, extractToken } = require('../utils/token');
const Realtor = require('../models/Realtor');

/**
 * Middleware to verify JWT token and authenticate user
 */
const auth = async (req, res, next) => {
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

    // Check if token is for realtor
    if (decoded.userType !== 'realtor') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Invalid user type.'
      });
    }

    // Get realtor from database
    const realtor = await Realtor.findById(decoded.id);

    if (!realtor) {
      return res.status(404).json({
        status: 'error',
        message: 'Realtor not found.'
      });
    }

    // Check if realtor is suspended
    if (realtor.status === 'suspended') {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been suspended. Please contact admin.'
      });
    }

    // Attach realtor to request object
    req.realtor = realtor;
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
 * Middleware to check if realtor is active (approved)
 */
const requireActive = (req, res, next) => {
  if (req.realtor.status !== 'active') {
    return res.status(403).json({
      status: 'error',
      message: 'Your account is pending approval. You cannot perform this action yet.',
      accountStatus: req.realtor.status
    });
  }
  next();
};

module.exports = {
  auth,
  requireActive
};
