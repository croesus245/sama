const express = require('express');
const router = express.Router();

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Properties endpoint - Coming soon',
        data: []
    });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
router.get('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        message: `Property ${req.params.id} endpoint - Coming soon`,
        data: {}
    });
});

module.exports = router;