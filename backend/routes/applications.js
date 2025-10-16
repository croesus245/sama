// Student Applications API Routes
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Hostel = require('../models/Hostel');
const Realtor = require('../models/Realtor');

// @route   POST /api/applications/submit
// @desc    Submit a new hostel application
// @access  Public (can add auth later)
router.post('/submit', async (req, res) => {
  try {
    const { applicationData } = req.body;
    
    // Validate required fields
    if (!applicationData || !applicationData.hostelId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required application data'
      });
    }
    
    // Get hostel and realtor information
    const hostel = await Hostel.findById(applicationData.hostelId);
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    // Get realtor information - handle both realtor and realtorId fields
    const realtorId = hostel.realtor || hostel.realtorId;
    const realtor = realtorId ? await Realtor.findById(realtorId) : null;
    
    // Create application document
    const application = new Application({
      applicationId: applicationData.applicationId,
      hostel: {
        hostelId: hostel._id,
        hostelName: hostel.name,
        hostelPrice: hostel.price,
        hostelLocation: hostel.location
      },
      realtor: {
        realtorId: realtorId || hostel._id, // Fallback to hostel ID if no realtor
        realtorName: realtor ? `${realtor.firstName} ${realtor.lastName}` : (hostel.realtorName || 'Unknown'),
        realtorEmail: realtor?.email,
        realtorPhone: realtor?.phone || hostel.whatsapp
      },
      studentInfo: applicationData.studentInfo,
      accommodation: applicationData.accommodation,
      additional: applicationData.additional,
      status: 'pending',
      termsAccepted: true,
      dataConsentGiven: true,
      communicationConsentGiven: true,
      submittedAt: new Date()
    });
    
    // Add initial status history
    application.statusHistory.push({
      status: 'pending',
      timestamp: new Date(),
      note: 'Application submitted',
      updatedBy: 'student'
    });
    
    // Save application
    await application.save();
// Send success response
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: application.applicationId,
        status: application.status,
        submittedAt: application.submittedAt,
        hostelName: application.hostel.hostelName
      }
    });
    
  } catch (error) {
    console.error('❌ Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
});

// @route   GET /api/applications/student/:email
// @desc    Get all applications for a student
// @access  Public (should add auth)
router.get('/student/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const applications = await Application.find({
      'studentInfo.email': email.toLowerCase()
    })
    .sort({ submittedAt: -1 })
    .populate('hostel.hostelId', 'name location price images');
    
    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
    
  } catch (error) {
    console.error('❌ Error fetching student applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
});

// @route   GET /api/applications/realtor/:realtorId
// @desc    Get all applications for a realtor's hostels
// @access  Private (realtor auth required)
router.get('/realtor/:realtorId', async (req, res) => {
  try {
    const { realtorId } = req.params;
    
    const applications = await Application.find({
      'realtor.realtorId': realtorId
    })
    .sort({ submittedAt: -1 })
    .populate('hostel.hostelId', 'name location price images');
    
    // Get application statistics
    const stats = await Application.getApplicationStats(realtorId);
    
    res.json({
      success: true,
      count: applications.length,
      stats: stats,
      data: applications
    });
    
  } catch (error) {
    console.error('❌ Error fetching realtor applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
});

// @route   GET /api/applications/:applicationId
// @desc    Get a specific application by ID
// @access  Public
router.get('/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await Application.findOne({ applicationId })
      .populate('hostel.hostelId', 'name location price images description amenities');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Increment view count
    await application.incrementViews();
    
    res.json({
      success: true,
      data: application
    });
    
  } catch (error) {
    console.error('❌ Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
});

// @route   PATCH /api/applications/:applicationId/status
// @desc    Update application status
// @access  Private (realtor auth required)
router.patch('/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, note, updatedBy } = req.body;
    
    const application = await Application.findOne({ applicationId });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Validate status
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected', 'cancelled', 'expired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    // Update status
    await application.updateStatus(status, note, updatedBy);
    
    res.json({
      success: true,
      message: 'Application status updated',
      data: {
        applicationId: application.applicationId,
        status: application.status,
        updatedAt: application.lastUpdated
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message
    });
  }
});

// @route   POST /api/applications/:applicationId/message
// @desc    Add a message to application
// @access  Private
router.post('/:applicationId/message', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { sender, message } = req.body;
    
    const application = await Application.findOne({ applicationId });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    await application.addMessage(sender, message);
    
    res.json({
      success: true,
      message: 'Message added successfully',
      data: application.messages[application.messages.length - 1]
    });
    
  } catch (error) {
    console.error('❌ Error adding message:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding message',
      error: error.message
    });
  }
});

// @route   GET /api/applications/stats/overview
// @desc    Get overall application statistics (admin)
// @access  Private (admin auth required)
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const total = await Application.countDocuments();
    const recentApplications = await Application.find()
      .sort({ submittedAt: -1 })
      .limit(10)
      .select('applicationId hostel.hostelName studentInfo.firstName studentInfo.lastName status submittedAt');
    
    res.json({
      success: true,
      data: {
        total,
        byStatus: stats,
        recent: recentApplications
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// @route   DELETE /api/applications/:applicationId
// @desc    Cancel/Delete an application
// @access  Private
router.delete('/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await Application.findOne({ applicationId });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Only allow cancellation if status is pending
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending applications can be cancelled'
      });
    }
    
    await application.updateStatus('cancelled', 'Cancelled by student', 'student');
    
    res.json({
      success: true,
      message: 'Application cancelled successfully'
    });
    
  } catch (error) {
    console.error('❌ Error cancelling application:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling application',
      error: error.message
    });
  }
});

module.exports = router;
