const express = require('express');
const router = express.Router();

// @desc    Find roommates
// @route   GET /api/roommates
// @access  Private
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Roommates endpoint - Coming soon',
        data: []
    });
});

module.exports = router;