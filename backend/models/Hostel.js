// Hostel Model - MongoDB Schema
const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Hostel name is required'],
    trim: true,
    maxlength: [100, 'Hostel name cannot exceed 100 characters']
  },
  
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  // Media
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  
  // Features
  features: [{
    type: String,
    trim: true
  }],
  
  // Contact Information
  whatsapp: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true
  },
  
  // Availability
  available: {
    type: Boolean,
    default: true
  },
  
  // Realtor Information
  realtorId: {
    type: String,
    required: [true, 'Realtor ID is required']
  },
  
  realtorName: {
    type: String,
    trim: true
  },
  
  // Statistics
  applications: {
    type: Number,
    default: 0
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  // Additional Details
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  amenities: [{
    type: String,
    trim: true
  }],
  
  roomType: {
    type: String,
    enum: ['Single', 'Double', 'Shared', 'Self-Contain'],
    default: 'Shared'
  },
  
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Mixed'],
    default: 'Mixed'
  }
  
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for faster queries
hostelSchema.index({ available: 1, price: 1 });
hostelSchema.index({ realtorId: 1 });
hostelSchema.index({ location: 1 });

// Methods
hostelSchema.methods.incrementApplications = function() {
  this.applications += 1;
  return this.save();
};

hostelSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Static methods
hostelSchema.statics.findAvailable = function() {
  return this.find({ available: true }).sort({ createdAt: -1 });
};

hostelSchema.statics.findByRealtor = function(realtorId) {
  return this.find({ realtorId }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Hostel', hostelSchema);
