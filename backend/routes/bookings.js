const express = require('express');
const router = express.Router();

// @desc    Get bookings
// @route   GET /api/bookings
// @access  Private
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Bookings endpoint - Coming soon',
        data: []
    });
});

module.exports = router;