// Student Model
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    matric: {
        type: String,
        required: [true, 'Matric number is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    whatsapp: {
        type: String,
        required: [true, 'WhatsApp number is required'],
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false // Don't include password in queries by default
    },
    role: {
        type: String,
        default: 'student',
        immutable: true
    },
    savedHostels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    }],
    applications: [{
        hostelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hostel'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    }],
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
studentSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Method to get public profile (without sensitive data)
studentSchema.methods.getPublicProfile = function() {
    return {
        _id: this._id,
        fullName: this.fullName,
        email: this.email,
        matric: this.matric,
        phone: this.phone,
        whatsapp: this.whatsapp,
        department: this.department,
        role: this.role,
        createdAt: this.createdAt
    };
};

// Method to update last login
studentSchema.methods.updateLastLogin = async function() {
    this.lastLogin = new Date();
    await this.save();
};

// Static method to find by email or matric
studentSchema.statics.findByEmailOrMatric = function(identifier) {
    return this.findOne({
        $or: [
            { email: identifier.toLowerCase() },
            { matric: identifier.toUpperCase() }
        ]
    });
};

module.exports = mongoose.model('Student', studentSchema);
