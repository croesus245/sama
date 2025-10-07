const express = require('express');
const router = express.Router();

// @desc    Get realtors
// @route   GET /api/realtors
// @access  Public
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Realtors endpoint - Coming soon',
        data: []
    });
});

module.exports = router;