const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Basic Information
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
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
        select: false // Don't include password in queries by default
    },
    
    // Student Information
    studentId: {
        type: String,
        required: [true, 'Student ID is required'],
        unique: true,
        uppercase: true
    },
    university: {
        type: String,
        required: [true, 'University is required'],
        default: 'Federal University of Technology, Akure (FUTA)'
    },
    faculty: {
        type: String,
        required: [true, 'Faculty is required']
    },
    department: {
        type: String,
        required: [true, 'Department is required']
    },
    yearOfStudy: {
        type: Number,
        required: [true, 'Year of study is required'],
        min: [1, 'Year of study must be at least 1'],
        max: [7, 'Year of study cannot exceed 7']
    },
    graduationYear: {
        type: Number,
        required: [true, 'Expected graduation year is required']
    },
    
    // Profile Information
    avatar: {
        type: String,
        default: null
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female', 'other']
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    
    // Preferences
    preferences: {
        accommodationType: {
            type: [String],
            enum: ['shared', 'private', 'studio', 'dormitory'],
            default: ['shared']
        },
        budgetMin: {
            type: Number,
            min: [0, 'Budget cannot be negative']
        },
        budgetMax: {
            type: Number,
            min: [0, 'Budget cannot be negative']
        },
        preferredLocation: {
            type: [String],
            default: []
        },
        lifestyle: {
            smokingAllowed: { type: Boolean, default: false },
            petsAllowed: { type: Boolean, default: false },
            partyFriendly: { type: Boolean, default: false },
            studyFriendly: { type: Boolean, default: true },
            cleanlinessLevel: {
                type: Number,
                min: 1,
                max: 5,
                default: 3
            }
        },
        amenities: {
            type: [String],
            enum: [
                'wifi', 'parking', 'laundry', 'kitchen', 'gym', 'security',
                'backup_power', 'water_supply', 'air_conditioning', 'heating',
                'cable_tv', 'balcony', 'garden', 'swimming_pool'
            ],
            default: ['wifi', 'security', 'water_supply']
        }
    },
    
    // Verification
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    emailVerified: {
        type: Boolean,
        default: false
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    studentIdVerified: {
        type: Boolean,
        default: false
    },
    verificationDocuments: [{
        type: {
            type: String,
            enum: ['student_id', 'admission_letter', 'school_id_card', 'transcript'],
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
        },
        reviewedAt: Date,
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        rejectionReason: String
    }],
    
    // Account Security
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date,
    lastLogin: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    
    // Social Features
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friends: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'blocked'],
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Activity
    savedProperties: [{
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property'
        },
        savedAt: {
            type: Date,
            default: Date.now
        }
    }],
    viewedProperties: [{
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property'
        },
        viewedAt: {
            type: Date,
            default: Date.now
        }
    }],
    searchHistory: [{
        query: String,
        filters: mongoose.Schema.Types.Mixed,
        searchedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Notifications
    notificationSettings: {
        email: {
            newProperties: { type: Boolean, default: true },
            roommates: { type: Boolean, default: true },
            bookings: { type: Boolean, default: true },
            messages: { type: Boolean, default: true },
            marketing: { type: Boolean, default: false }
        },
        push: {
            newProperties: { type: Boolean, default: true },
            roommates: { type: Boolean, default: true },
            bookings: { type: Boolean, default: true },
            messages: { type: Boolean, default: true }
        },
        sms: {
            bookings: { type: Boolean, default: true },
            emergencies: { type: Boolean, default: true }
        }
    },
    
    // Status
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'banned'],
        default: 'active'
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    
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

// Indexes for better performance
// Email and studentId indexes are automatically created due to unique: true
userSchema.index({ university: 1, faculty: 1, department: 1 });
userSchema.index({ 'preferences.budgetMin': 1, 'preferences.budgetMax': 1 });
userSchema.index({ isVerified: 1, status: 1 });
userSchema.index({ lastActive: -1 });

// Virtual for user's age
userSchema.virtual('age').get(function() {
    if (this.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }
    return null;
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash password if it's been modified
    if (!this.isModified('password')) return next();
    
    try {
        // Hash password with cost of 12
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
        this.password = await bcrypt.hash(this.password, salt);
        
        // Set password changed timestamp
        this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure token is created after password change
        
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to update lastActive and updatedAt
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    if (this.isNew) {
        this.lastActive = Date.now();
    }
    next();
});

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = async function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
    const lockoutTime = parseInt(process.env.LOCKOUT_TIME) || 15; // minutes
    
    // If we have max attempts and no lock, set lock
    if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + (lockoutTime * 60 * 1000) };
    }
    
    return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
    });
};

// Instance method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Static method to find compatible roommates
userSchema.statics.findCompatibleRoommates = function(userId, preferences = {}) {
    return this.find({
        _id: { $ne: userId },
        isVerified: true,
        status: 'active',
        'preferences.accommodationType': { $in: preferences.accommodationType || ['shared'] },
        'preferences.budgetMin': { $lte: preferences.budgetMax || 1000000 },
        'preferences.budgetMax': { $gte: preferences.budgetMin || 0 }
    }).select('-password -verificationToken -passwordResetToken');
};

// Static method to get user statistics
userSchema.statics.getStatistics = function() {
    return this.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                verifiedUsers: {
                    $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
                },
                activeUsers: {
                    $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                },
                maleUsers: {
                    $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] }
                },
                femaleUsers: {
                    $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] }
                }
            }
        }
    ]);
};

module.exports = mongoose.model('User', userSchema);