const express = require('express');
const router = express.Router();

// @desc    Payment endpoints
// @route   POST /api/payments
// @access  Private
router.post('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Payments endpoint - Coming soon',
        data: {}
    });
});

module.exports = router;