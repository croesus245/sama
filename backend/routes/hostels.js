// Hostel API Routes
const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const { auth, requireActive } = require('../middleware/auth');

// ============================================
// GET ALL HOSTELS (Public - for students)
// Note: Shows only hostels from ACTIVE realtors
// ============================================
router.get('/', async (req, res) => {
  try {
    console.log('📍 /api/hostels endpoint called');
    const { available, minPrice, maxPrice, location } = req.query;
    
    // Build filter
    let filter = {};
    
    if (available === 'true') {
      filter.available = true;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    console.log('🔍 Query filter:', filter);
    
    // Find all hostels, then populate realtor data to check status
    const hostels = await Hostel.find(filter)
      .sort({ createdAt: -1 })
      .populate('realtorId', 'status');
    
    console.log(`✅ Found ${hostels.length} total hostels`);
    
    // Filter to show hostels from ACTIVE and PENDING realtors
    // This allows new/pending realtors to have their hostels visible while awaiting approval
    const filteredHostels = hostels.filter(hostel => {
      // If realtorId is not populated (old data), show it
      if (!hostel.realtorId || typeof hostel.realtorId === 'string') {
        return true;
      }
      // Show hostels from both active and pending realtors
      // Don't show hostels from suspended realtors
      return hostel.realtorId.status === 'active' || hostel.realtorId.status === 'pending';
    });
    
    console.log(`✅ After status filter: ${filteredHostels.length} hostels`);
    
    res.json({
      success: true,
      count: filteredHostels.length,
      data: filteredHostels
    });
  } catch (error) {
    console.error('❌ Error fetching hostels:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hostels',
      error: error.message
    });
  }
});

// ============================================
// GET SINGLE HOSTEL BY ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    // Increment view count
    await hostel.incrementViews();
    
    res.json({
      success: true,
      data: hostel
    });
  } catch (error) {
    console.error('Error fetching hostel:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hostel',
      error: error.message
    });
  }
});

// ============================================
// GET HOSTELS BY REALTOR (Protected)
// ============================================
router.get('/realtor/:realtorId', async (req, res) => {
  try {
    const hostels = await Hostel.findByRealtor(req.params.realtorId);
    
    res.json({
      success: true,
      count: hostels.length,
      data: hostels
    });
  } catch (error) {
    console.error('Error fetching realtor hostels:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching realtor hostels',
      error: error.message
    });
  }
});

// ============================================
// CREATE NEW HOSTEL (Protected - Realtor only)
// ============================================
router.post('/', auth, async (req, res) => {
  try {
    const hostelData = req.body;
    
    // Validate required fields
    if (!hostelData.name || !hostelData.location || !hostelData.price || !hostelData.whatsapp) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, location, price, whatsapp'
      });
    }
    
    // Override realtorId with authenticated realtor's ID
    hostelData.realtorId = req.realtor._id;
    hostelData.realtorName = req.realtor.fullName;
    hostelData.realtorEmail = req.realtor.email;
    
    // Create new hostel
    const hostel = new Hostel(hostelData);
    await hostel.save();
    
    res.status(201).json({
      success: true,
      message: 'Hostel created successfully',
      data: hostel
    });
  } catch (error) {
    console.error('Error creating hostel:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating hostel',
      error: error.message
    });
  }
});

// ============================================
// UPDATE HOSTEL (Protected - Realtor only, own hostels)
// ============================================
router.put('/:id', auth, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    // Check if hostel belongs to the authenticated realtor
    if (hostel.realtorId.toString() !== req.realtor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own hostels'
      });
    }
    
    // Update hostel (but don't allow changing realtorId)
    const { realtorId, ...updateData } = req.body;
    Object.assign(hostel, updateData);
    await hostel.save();
    
    res.json({
      success: true,
      message: 'Hostel updated successfully',
      data: hostel
    });
  } catch (error) {
    console.error('Error updating hostel:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hostel',
      error: error.message
    });
  }
});

// ============================================
// DELETE HOSTEL (Protected - Realtor only, own hostels)
// ============================================
router.delete('/:id', auth, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    // Check if hostel belongs to the authenticated realtor
    if (hostel.realtorId.toString() !== req.realtor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own hostels'
      });
    }
    
    await Hostel.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Hostel deleted successfully',
      data: hostel
    });
  } catch (error) {
    console.error('Error deleting hostel:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting hostel',
      error: error.message
    });
  }
});

// ============================================
// INCREMENT APPLICATION COUNT
// ============================================
router.post('/:id/apply', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    await hostel.incrementApplications();
    
    res.json({
      success: true,
      message: 'Application count updated',
      data: hostel
    });
  } catch (error) {
    console.error('Error updating application count:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application count',
      error: error.message
    });
  }
});

// ============================================
// TOGGLE AVAILABILITY (Protected - Realtor only, own hostels)
// ============================================
router.patch('/:id/availability', auth, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    // Check if hostel belongs to the authenticated realtor
    if (hostel.realtorId.toString() !== req.realtor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own hostels'
      });
    }
    
    hostel.available = !hostel.available;
    await hostel.save();
    
    res.json({
      success: true,
      message: `Hostel marked as ${hostel.available ? 'available' : 'unavailable'}`,
      data: hostel
    });
  } catch (error) {
    console.error('Error toggling availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling availability',
      error: error.message
    });
  }
});

module.exports = router;
