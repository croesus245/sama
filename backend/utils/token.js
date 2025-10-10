const jwt = require('jsonwebtoken');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'mwg-hostels-secret-key-2024';
const JWT_EXPIRE = '24h'; // Token expires in 24 hours

/**
 * Generate JWT token for user
 * @param {Object} user - User object (realtor or admin)
 * @param {String} userType - Type of user ('realtor' or 'admin')
 * @returns {String} JWT token
 */
const generateToken = (user, userType = 'realtor') => {
  const payload = {
    id: user._id,
    email: user.email,
    userType: userType,
    status: user.status || 'active' // For realtors, include status
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} Token or null
 */
const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken,
  JWT_SECRET,
  JWT_EXPIRE
};
