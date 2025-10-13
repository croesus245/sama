// Student Hostel Application Model
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Hostel Information
  hostel: {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true
    },
    hostelName: {
      type: String,
      required: true
    },
    hostelPrice: Number,
    hostelLocation: String
  },
  
  // Realtor Information
  realtor: {
    realtorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Realtor',
      required: true
    },
    realtorName: String,
    realtorEmail: String,
    realtorPhone: String
  },
  
  // Student Personal Information
  studentInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    whatsapp: {
      type: String,
      trim: true
    },
    studentId: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      required: true,
      enum: ['100', '200', '300', '400', '500', 'postgraduate']
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    graduation: String
  },
  
  // Accommodation Preferences
  accommodation: {
    roomType: {
      type: String,
      required: true,
      enum: ['single', 'shared', 'apartment', 'any']
    },
    moveInDate: {
      type: Date,
      required: true
    },
    duration: {
      type: String,
      required: true,
      enum: ['semester', 'academic_year', 'multiple_years']
    },
    previousStay: {
      type: String,
      enum: ['first_time', 'hostel_experience', 'apartment_experience']
    }
  },
  
  // Additional Information
  additional: {
    emergencyContact: {
      type: String,
      required: true
    },
    additionalInfo: String,
    paymentMethod: {
      type: String,
      required: true,
      enum: ['full_payment', 'installments', 'family_support', 'scholarship']
    }
  },
  
  // Application Status
  status: {
    type: String,
    required: true,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'cancelled', 'expired'],
    default: 'pending'
  },
  
  // Status History
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String,
    updatedBy: String
  }],
  
  // Realtor Actions
  realtorNotes: String,
  realtorResponse: String,
  realtorResponseDate: Date,
  
  // Communication
  messages: [{
    sender: {
      type: String,
      enum: ['student', 'realtor', 'system']
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from creation
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  lastViewedAt: Date,
  
  // Terms Agreement
  termsAccepted: {
    type: Boolean,
    required: true,
    default: false
  },
  dataConsentGiven: {
    type: Boolean,
    required: true,
    default: false
  },
  communicationConsentGiven: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
applicationSchema.index({ 'hostel.hostelId': 1 });
applicationSchema.index({ 'realtor.realtorId': 1 });
applicationSchema.index({ 'studentInfo.email': 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ submittedAt: -1 });

// Virtual for full student name
applicationSchema.virtual('studentFullName').get(function() {
  return `${this.studentInfo.firstName} ${this.studentInfo.lastName}`;
});

// Virtual for application age in days
applicationSchema.virtual('applicationAge').get(function() {
  const now = new Date();
  const submitted = new Date(this.submittedAt);
  const diffTime = Math.abs(now - submitted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware
applicationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Methods
applicationSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || '',
    updatedBy: updatedBy || 'system'
  });
  return this.save();
};

applicationSchema.methods.addMessage = function(sender, message) {
  this.messages.push({
    sender,
    message,
    timestamp: new Date(),
    read: false
  });
  return this.save();
};

applicationSchema.methods.incrementViews = function() {
  this.views += 1;
  this.lastViewedAt = new Date();
  return this.save();
};

// Statics
applicationSchema.statics.findByStudent = function(email) {
  return this.find({ 'studentInfo.email': email }).sort({ submittedAt: -1 });
};

applicationSchema.statics.findByRealtor = function(realtorId) {
  return this.find({ 'realtor.realtorId': realtorId }).sort({ submittedAt: -1 });
};

applicationSchema.statics.findByHostel = function(hostelId) {
  return this.find({ 'hostel.hostelId': hostelId }).sort({ submittedAt: -1 });
};

applicationSchema.statics.getPendingApplications = function() {
  return this.find({ status: 'pending' }).sort({ submittedAt: -1 });
};

applicationSchema.statics.getApplicationStats = async function(realtorId) {
  const stats = await this.aggregate([
    { $match: { 'realtor.realtorId': mongoose.Types.ObjectId(realtorId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
