// Image Upload Routes for MWG Hostels
// Handles direct image uploads via Cloudinary

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage, deleteImage, generateUploadSignature } = require('../utils/cloudinary');

// Configure multer for memory storage (no disk write)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// POST /api/upload/image - Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Convert buffer to base64 for Cloudinary
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await uploadImage(dataURI, 'mwg-hostels/hostels');

        if (result.success) {
            res.json({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    url: result.url,
                    public_id: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to upload image',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during upload',
            error: error.message
        });
    }
});

// POST /api/upload/multiple - Upload multiple images
router.post('/multiple', upload.array('images', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No image files provided'
            });
        }

        const uploadPromises = req.files.map(async (file) => {
            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = `data:${file.mimetype};base64,${b64}`;
            return await uploadImage(dataURI, 'mwg-hostels/hostels');
        });

        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter(r => r.success);

        res.json({
            success: true,
            message: `${successfulUploads.length} images uploaded successfully`,
            data: successfulUploads.map(r => ({
                url: r.url,
                public_id: r.public_id
            }))
        });
    } catch (error) {
        console.error('Multiple upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during upload',
            error: error.message
        });
    }
});

// DELETE /api/upload/image/:publicId - Delete image
router.delete('/image/:publicId', async (req, res) => {
    try {
        const publicId = req.params.publicId.replace(/:/g, '/');
        const result = await deleteImage(publicId);

        if (result.success) {
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to delete image',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during deletion',
            error: error.message
        });
    }
});

// GET /api/upload/config - Get Cloudinary config for widget
router.get('/config', (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                cloudName: process.env.CLOUDINARY_CLOUD_NAME,
                uploadPreset: 'mwg_hostels_unsigned' // Create this in Cloudinary
            }
        });
    } catch (error) {
        console.error('Config error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get config',
            error: error.message
        });
    }
});

module.exports = router;