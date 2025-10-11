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

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database: mwg-hostels');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

// Import routes
const hostelRoutes = require('./routes/hostels');
const realtorAuthRoutes = require('./routes/realtorAuth');
const adminPanelRoutes = require('./routes/adminPanel');
const studentAuthRoutes = require('./routes/studentAuth');
const uploadRoutes = require('./routes/upload');

// Routes
app.use('/api/hostels', hostelRoutes);
app.use('/api/realtor-auth', realtorAuthRoutes);
app.use('/api/admin-panel', adminPanelRoutes);
app.use('/api/students', studentAuthRoutes);
app.use('/api/upload', uploadRoutes);

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Hostels API: http://localhost:${PORT}/api/hostels`);
});

module.exports = app;
