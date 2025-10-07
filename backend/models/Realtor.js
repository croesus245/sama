const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const realtorSchema = new mongoose.Schema({
    // Basic Information
    businessName: {
        type: String,
        required: [true, 'Business name is required'],
        trim: true,
        maxlength: [100, 'Business name cannot exceed 100 characters']
    },
    contactPerson: {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    
    // Business Information
    businessRegistrationNumber: {
        type: String,
        required: [true, 'Business registration number is required'],
        unique: true
    },
    businessType: {
        type: String,
        required: [true, 'Business type is required'],
        enum: ['individual', 'partnership', 'company', 'cooperative']
    },
    yearsInBusiness: {
        type: Number,
        min: [0, 'Years in business cannot be negative']
    },
    
    // Address
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            default: 'Akure'
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            default: 'Ondo'
        },
        postalCode: String,
        country: {
            type: String,
            default: 'Nigeria'
        }
    },
    
    // Verification
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected', 'suspended'],
        default: 'pending'
    },
    verificationDocuments: [{
        type: {
            type: String,
            enum: ['business_registration', 'tax_certificate', 'id_card', 'utility_bill'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Profile
    logo: String,
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    website: String,
    socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String
    },
    
    // Services
    services: [{
        type: String,
        enum: [
            'student_accommodation',
            'family_housing',
            'commercial_properties',
            'property_management',
            'real_estate_consultation'
        ]
    }],
    specializations: [String],
    
    // Statistics
    properties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }],
    totalProperties: {
        type: Number,
        default: 0
    },
    activeProperties: {
        type: Number,
        default: 0
    },
    successfulBookings: {
        type: Number,
        default: 0
    },
    
    // Rating
    rating: {
        average: {
            type: Number,
            default: 0,
            min: [0, 'Rating cannot be below 0'],
            max: [5, 'Rating cannot be above 5']
        },
        count: {
            type: Number,
            default: 0
        }
    },
    
    // Subscription
    subscription: {
        plan: {
            type: String,
            enum: ['free', 'basic', 'premium', 'enterprise'],
            default: 'free'
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended', 'cancelled'],
            default: 'active'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: Date,
        paymentHistory: [{
            amount: Number,
            currency: { type: String, default: 'NGN' },
            date: { type: Date, default: Date.now },
            transactionId: String,
            status: {
                type: String,
                enum: ['pending', 'completed', 'failed', 'refunded'],
                default: 'pending'
            }
        }]
    },
    
    // Account Status
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'banned'],
        default: 'active'
    },
    lastLogin: Date,
    lastActive: {
        type: Date,
        default: Date.now
    },
    
    // Security
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// Email and businessRegistrationNumber indexes are automatically created due to unique: true
realtorSchema.index({ verificationStatus: 1, status: 1 });
realtorSchema.index({ 'rating.average': -1 });
realtorSchema.index({ lastActive: -1 });

// Virtual for full name
realtorSchema.virtual('fullName').get(function() {
    return `${this.contactPerson.firstName} ${this.contactPerson.lastName}`;
});

// Virtual for account lock status
realtorSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
realtorSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        this.passwordChangedAt = Date.now() - 1000;
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
realtorSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to increment login attempts
realtorSchema.methods.incLoginAttempts = async function() {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + (15 * 60 * 1000) };
    }
    
    return this.updateOne(updates);
};

// Instance method to reset login attempts
realtorSchema.methods.resetLoginAttempts = async function() {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
    });
};

module.exports = mongoose.model('Realtor', realtorSchema);