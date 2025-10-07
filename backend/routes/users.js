const express = require('express');
const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Users endpoint - Coming soon',
        data: []
    });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', require('../middleware/auth').auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User profile endpoint - Coming soon',
        data: req.user
    });
});

module.exports = router;