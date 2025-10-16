const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const realtorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password in queries by default
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  whatsapp: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true
  },
  businessName: {
    type: String,
    trim: true,
    default: ''
  },
  businessAddress: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  totalHostels: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
realtorSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
realtorSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get public profile (without sensitive data)
realtorSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    id: this._id, // Include both for compatibility
    email: this.email,
    fullName: this.fullName,
    phoneNumber: this.phoneNumber,
    whatsapp: this.whatsapp,
    businessName: this.businessName,
    businessAddress: this.businessAddress,
    status: this.status,
    totalHostels: this.totalHostels,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin
  };
};

// Static method to find active realtors
realtorSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find pending realtors
realtorSchema.statics.findPending = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: -1 });
};

// Update last login timestamp
realtorSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('Realtor', realtorSchema);
