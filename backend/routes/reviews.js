const express = require('express');
const router = express.Router();

// @desc    Get reviews
// @route   GET /api/reviews
// @access  Public
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Reviews endpoint - Coming soon',
        data: []
    });
});

module.exports = router;