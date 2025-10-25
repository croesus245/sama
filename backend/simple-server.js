// Simple Hostel API Server
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
// CORS Configuration - Allow both local and production frontend
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:8000',
      'http://localhost:3000',
      'http://127.0.0.1:8000',
      'https://mwgbysama.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Database connection with better error handling
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mwg_hostels';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.warn('⚠️  Continuing without database - using in-memory storage');
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
});

// Import routes - with fallback error handlers
const hostelRoutes = require('./routes/hostels');
const realtorAuthRoutes = require('./routes/realtorAuth');
const studentAuthRoutes = require('./routes/studentAuth');
const uploadRoutes = require('./routes/upload');
const applicationRoutes = require('./routes/applications');

// Routes with error handlers
app.use('/api/hostels', (req, res, next) => {
  try {
    return hostelRoutes(req, res, next);
  } catch (error) {
    console.error('Hostel route error:', error);
    res.status(500).json({ success: false, message: 'Hostel service error', error: error.message });
  }
});

app.use('/api/realtor-auth', (req, res, next) => {
  try {
    return realtorAuthRoutes(req, res, next);
  } catch (error) {
    console.error('Realtor auth route error:', error);
    res.status(500).json({ status: 'error', message: 'Auth service error', error: error.message });
  }
});

app.use('/api/students', (req, res, next) => {
  try {
    return studentAuthRoutes(req, res, next);
  } catch (error) {
    console.error('Student auth route error:', error);
    res.status(500).json({ success: false, message: 'Student service error', error: error.message });
  }
});

app.use('/api/upload', (req, res, next) => {
  try {
    return uploadRoutes(req, res, next);
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({ success: false, message: 'Upload service error', error: error.message });
  }
});

app.use('/api/applications', (req, res, next) => {
  try {
    return applicationRoutes(req, res, next);
  } catch (error) {
    console.error('Application route error:', error);
    res.status(500).json({ success: false, message: 'Application service error', error: error.message });
  }
});

// Optional: Admin routes (if adminPanel exists)
try {
  const adminPanelRoutes = require('./routes/adminPanel');
  app.use('/api/admin-panel', (req, res, next) => {
    try {
      return adminPanelRoutes(req, res, next);
    } catch (error) {
      console.error('Admin route error:', error);
      res.status(500).json({ status: 'error', message: 'Admin service error', error: error.message });
    }
  });
} catch (e) {
  console.warn('Admin routes not found, skipping...');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'MWG Hostels API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to MWG Hostels API',
    version: '2.1.0',
    endpoints: {
      health: '/api/health',
      hostels: '/api/hostels',
      singleHostel: '/api/hostels/:id',
      realtorHostels: '/api/hostels/realtor/:realtorId',
      // Realtor Authentication
      realtorRegister: '/api/realtor-auth/register',
      realtorLogin: '/api/realtor-auth/login',
      realtorProfile: '/api/realtor-auth/profile',
      realtorVerify: '/api/realtor-auth/verify',
      // Admin Authentication & Management
      adminLogin: '/api/realtor-auth/admin-login',
      adminStats: '/api/admin-panel/stats',
      adminRealtors: '/api/admin-panel/realtors',
      adminPendingRealtors: '/api/admin-panel/realtors/pending',
      adminApproveRealtor: '/api/admin-panel/realtors/:id/approve',
      adminSuspendRealtor: '/api/admin-panel/realtors/:id/suspend',
      adminRejectRealtor: '/api/admin-panel/realtors/:id/reject',
      adminHostels: '/api/admin-panel/hostels',
      // Student Authentication
      studentRegister: '/api/students/register',
      studentLogin: '/api/students/login',
      studentProfile: '/api/students/profile',
      studentSaveHostel: '/api/students/save-hostel/:hostelId',
      studentSavedHostels: '/api/students/saved-hostels',
      // Image Upload
      uploadImage: '/api/upload/image',
      uploadMultiple: '/api/upload/multiple',
      deleteImage: '/api/upload/image/:publicId',
      uploadConfig: '/api/upload/config'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler (catch all)
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(error.status || 500).json({
    status: 'error',
    message: error.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 MWG Hostels API Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
});

module.exports = app;
