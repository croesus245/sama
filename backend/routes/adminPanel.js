const express = require('express');
const router = express.Router();
const Realtor = require('../models/Realtor');
const Hostel = require('../models/Hostel');
const { adminAuth } = require('../middleware/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

/**
 * @route   GET /api/admin-panel/stats
 * @desc    Get platform statistics
 * @access  Private (Admin)
 */
router.get('/stats', async (req, res) => {
  try {
    const [
      totalRealtors,
      activeRealtors,
      pendingRealtors,
      suspendedRealtors,
      totalHostels,
      availableHostels
    ] = await Promise.all([
      Realtor.countDocuments(),
      Realtor.countDocuments({ status: 'active' }),
      Realtor.countDocuments({ status: 'pending' }),
      Realtor.countDocuments({ status: 'suspended' }),
      Hostel.countDocuments(),
      Hostel.countDocuments({ available: true })
    ]);

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await Realtor.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      status: 'success',
      data: {
        stats: {
          realtors: {
            total: totalRealtors,
            active: activeRealtors,
            pending: pendingRealtors,
            suspended: suspendedRealtors,
            recentRegistrations
          },
          hostels: {
            total: totalHostels,
            available: availableHostels,
            unavailable: totalHostels - availableHostels
          }
        }
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get statistics',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin-panel/realtors
 * @desc    Get all realtors
 * @access  Private (Admin)
 */
router.get('/realtors', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [realtors, total] = await Promise.all([
      Realtor.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Realtor.countDocuments(query)
    ]);

    res.json({
      status: 'success',
      data: {
        realtors: realtors.map(r => r.getPublicProfile()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get realtors error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get realtors',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin-panel/realtors/pending
 * @desc    Get pending realtors
 * @access  Private (Admin)
 */
router.get('/realtors/pending', async (req, res) => {
  try {
    const pendingRealtors = await Realtor.findPending();

    res.json({
      status: 'success',
      data: {
        realtors: pendingRealtors.map(r => r.getPublicProfile()),
        count: pendingRealtors.length
      }
    });

  } catch (error) {
    console.error('Get pending realtors error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get pending realtors',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin-panel/realtors/:id
 * @desc    Get single realtor details
 * @access  Private (Admin)
 */
router.get('/realtors/:id', async (req, res) => {
  try {
    const realtor = await Realtor.findById(req.params.id);

    if (!realtor) {
      return res.status(404).json({
        status: 'error',
        message: 'Realtor not found'
      });
    }

    // Get realtor's hostels
    const hostels = await Hostel.find({ realtorId: realtor._id });

    res.json({
      status: 'success',
      data: {
        realtor: realtor.getPublicProfile(),
        hostels: hostels.map(h => ({
          id: h._id,
          name: h.name,
          location: h.location,
          price: h.price,
          available: h.available,
          applications: h.applications,
          views: h.views,
          createdAt: h.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Get realtor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get realtor',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin-panel/realtors/:id/approve
 * @desc    Approve realtor
 * @access  Private (Admin)
 */
router.put('/realtors/:id/approve', async (req, res) => {
  try {
    const realtor = await Realtor.findById(req.params.id);

    if (!realtor) {
      return res.status(404).json({
        status: 'error',
        message: 'Realtor not found'
      });
    }

    if (realtor.status === 'active') {
      return res.status(400).json({
        status: 'error',
        message: 'Realtor is already approved'
      });
    }

    // Approve realtor
    realtor.status = 'active';
    realtor.approvedAt = new Date();
    realtor.approvedBy = req.admin._id;

    await realtor.save();

    res.json({
      status: 'success',
      message: `Realtor "${realtor.fullName}" has been approved successfully`,
      data: {
        realtor: realtor.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Approve realtor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to approve realtor',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin-panel/realtors/:id/suspend
 * @desc    Suspend/Unsuspend realtor
 * @access  Private (Admin)
 */
router.put('/realtors/:id/suspend', async (req, res) => {
  try {
    const realtor = await Realtor.findById(req.params.id);

    if (!realtor) {
      return res.status(404).json({
        status: 'error',
        message: 'Realtor not found'
      });
    }

    // Toggle suspend status
    let message;
    if (realtor.status === 'suspended') {
      realtor.status = 'active';
      message = `Realtor "${realtor.fullName}" has been reactivated`;
    } else {
      realtor.status = 'suspended';
      message = `Realtor "${realtor.fullName}" has been suspended`;
    }

    await realtor.save();

    res.json({
      status: 'success',
      message,
      data: {
        realtor: realtor.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Suspend realtor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to suspend realtor',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/admin-panel/realtors/:id/reject
 * @desc    Reject pending realtor application
 * @access  Private (Admin)
 */
router.delete('/realtors/:id/reject', async (req, res) => {
  try {
    const realtor = await Realtor.findById(req.params.id);

    if (!realtor) {
      return res.status(404).json({
        status: 'error',
        message: 'Realtor not found'
      });
    }

    if (realtor.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Only pending realtors can be rejected'
      });
    }

    // Delete the realtor
    await Realtor.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: `Realtor application from "${realtor.fullName}" has been rejected and deleted`
    });

  } catch (error) {
    console.error('Reject realtor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reject realtor',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin-panel/hostels
 * @desc    Get all hostels (from all realtors)
 * @access  Private (Admin)
 */
router.get('/hostels', async (req, res) => {
  try {
    const { realtorId, available, page = 1, limit = 20 } = req.query;

    // Build query
    let query = {};
    if (realtorId) {
      query.realtorId = realtorId;
    }
    if (available !== undefined) {
      query.available = available === 'true';
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [hostels, total] = await Promise.all([
      Hostel.find(query)
        .populate('realtorId', 'fullName email whatsapp businessName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Hostel.countDocuments(query)
    ]);

    res.json({
      status: 'success',
      data: {
        hostels,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get hostels error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get hostels',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/admin-panel/hostels/:id
 * @desc    Delete hostel (admin override)
 * @access  Private (Admin)
 */
router.delete('/hostels/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hostel not found'
      });
    }

    await Hostel.findByIdAndDelete(req.params.id);

    // Update realtor's hostel count
    const realtor = await Realtor.findById(hostel.realtorId);
    if (realtor) {
      realtor.totalHostels = Math.max(0, realtor.totalHostels - 1);
      await realtor.save();
    }

    res.json({
      status: 'success',
      message: 'Hostel deleted successfully'
    });

  } catch (error) {
    console.error('Delete hostel error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete hostel',
      error: error.message
    });
  }
});

module.exports = router;
