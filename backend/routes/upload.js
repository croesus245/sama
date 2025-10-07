const express = require('express');
const router = express.Router();

// @desc    File upload endpoints
// @route   POST /api/upload
// @access  Private
router.post('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Upload endpoint - Coming soon',
        data: {}
    });
});

module.exports = router;