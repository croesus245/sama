const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, expiresIn = process.env.JWT_EXPIRE || '7d') => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn
    });
};

// Generate refresh token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
    });
};

// Verify JWT token
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// Verify refresh token
const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
};

// Extract user ID from token without verification (for logging purposes)
const extractUserId = (token) => {
    try {
        const decoded = jwt.decode(token);
        return decoded ? decoded.id : null;
    } catch (error) {
        return null;
    }
};

// Check if token is expired
const isTokenExpired = (token) => {
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) return true;
        
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

// Get token expiration time
const getTokenExpiration = (token) => {
    try {
        const decoded = jwt.decode(token);
        return decoded ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken,
    extractUserId,
    isTokenExpired,
    getTokenExpiration
};