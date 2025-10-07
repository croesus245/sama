const express = require('express');
const router = express.Router();

// @desc    Admin endpoints
// @route   GET /api/admin
// @access  Private/Admin
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Admin endpoint - Coming soon',
        data: []
    });
});

module.exports = router;