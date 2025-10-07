const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    // Basic Information
    title: {
        type: String,
        required: [true, 'Property title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Property description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    type: {
        type: String,
        required: [true, 'Property type is required'],
        enum: ['shared', 'private', 'studio', 'dormitory', 'apartment', 'house']
    },
    
    // Location
    location: {
        address: {
            type: String,
            required: [true, 'Address is required']
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
        country: {
            type: String,
            required: [true, 'Country is required'],
            default: 'Nigeria'
        },
        nearbyLandmarks: [String],
        distanceToUniversity: {
            type: Number, // in kilometers
            required: [true, 'Distance to university is required']
        },
        coordinates: {
            latitude: {
                type: Number,
                required: [true, 'Latitude is required']
            },
            longitude: {
                type: Number,
                required: [true, 'Longitude is required']
            }
        },
        area: {
            type: String,
            enum: [
                'North Gate', 'South Gate', 'Town Campus', 'Apatapiti',
                'Aule', 'Oba Ile', 'Federal Road', 'Akure Metro',
                'Other'
            ],
            required: [true, 'Area near FUTA is required']
        }
    },
    
    // Property Details
    rooms: {
        bedrooms: {
            type: Number,
            required: [true, 'Number of bedrooms is required'],
            min: [1, 'Must have at least 1 bedroom']
        },
        bathrooms: {
            type: Number,
            required: [true, 'Number of bathrooms is required'],
            min: [1, 'Must have at least 1 bathroom']
        },
        livingRooms: {
            type: Number,
            default: 1
        },
        kitchen: {
            type: Boolean,
            default: true
        },
        balcony: {
            type: Boolean,
            default: false
        },
        totalRooms: {
            type: Number,
            required: [true, 'Total number of rooms is required']
        }
    },
    
    // Capacity
    capacity: {
        maxOccupants: {
            type: Number,
            required: [true, 'Maximum occupants is required'],
            min: [1, 'Must accommodate at least 1 person']
        },
        currentOccupants: {
            type: Number,
            default: 0,
            min: [0, 'Current occupants cannot be negative']
        },
        availableSpaces: {
            type: Number,
            default: function() {
                return this.capacity.maxOccupants;
            }
        },
        genderPreference: {
            type: String,
            enum: ['male', 'female', 'mixed', 'no_preference'],
            default: 'no_preference'
        }
    },
    
    // Pricing
    pricing: {
        rentPerMonth: {
            type: Number,
            required: [true, 'Monthly rent is required'],
            min: [0, 'Rent cannot be negative']
        },
        securityDeposit: {
            type: Number,
            required: [true, 'Security deposit is required'],
            min: [0, 'Security deposit cannot be negative']
        },
        additionalFees: [{
            name: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true,
                min: [0, 'Fee amount cannot be negative']
            },
            frequency: {
                type: String,
                enum: ['one-time', 'monthly', 'yearly'],
                default: 'one-time'
            },
            description: String
        }],
        currency: {
            type: String,
            default: 'NGN'
        },
        paymentTerms: {
            type: String,
            enum: ['monthly', 'quarterly', 'biannually', 'annually'],
            default: 'monthly'
        },
        utilitiesIncluded: {
            type: Boolean,
            default: false
        },
        negotiable: {
            type: Boolean,
            default: false
        }
    },
    
    // Amenities
    amenities: {
        basic: {
            wifi: { type: Boolean, default: false },
            electricity: { type: Boolean, default: true },
            water: { type: Boolean, default: true },
            security: { type: Boolean, default: false },
            parking: { type: Boolean, default: false },
            generator: { type: Boolean, default: false }
        },
        comfort: {
            airConditioning: { type: Boolean, default: false },
            heating: { type: Boolean, default: false },
            fan: { type: Boolean, default: false },
            furnished: { type: Boolean, default: false },
            kitchen: { type: Boolean, default: true },
            laundry: { type: Boolean, default: false }
        },
        entertainment: {
            cableTV: { type: Boolean, default: false },
            dstv: { type: Boolean, default: false },
            netflix: { type: Boolean, default: false },
            gameRoom: { type: Boolean, default: false },
            garden: { type: Boolean, default: false },
            swimmingPool: { type: Boolean, default: false }
        },
        safety: {
            fireExtinguisher: { type: Boolean, default: false },
            smokeDetector: { type: Boolean, default: false },
            cctv: { type: Boolean, default: false },
            securityGuard: { type: Boolean, default: false },
            gatedCommunity: { type: Boolean, default: false },
            emergencyExit: { type: Boolean, default: false }
        }
    },
    
    // Rules and Policies
    rules: {
        smokingAllowed: { type: Boolean, default: false },
        petsAllowed: { type: Boolean, default: false },
        visitorsAllowed: { type: Boolean, default: true },
        partyingAllowed: { type: Boolean, default: false },
        overnightGuests: { type: Boolean, default: true },
        alcoholAllowed: { type: Boolean, default: true },
        quietHours: {
            enabled: { type: Boolean, default: true },
            start: { type: String, default: '22:00' },
            end: { type: String, default: '07:00' }
        },
        checkInTime: { type: String, default: '10:00' },
        checkOutTime: { type: String, default: '12:00' },
        minimumStay: {
            value: { type: Number, default: 1 },
            unit: { type: String, enum: ['days', 'weeks', 'months', 'years'], default: 'months' }
        },
        maximumStay: {
            value: { type: Number, default: 12 },
            unit: { type: String, enum: ['days', 'weeks', 'months', 'years'], default: 'months' }
        }
    },
    
    // Media
    images: [{
        url: {
            type: String,
            required: true
        },
        caption: String,
        isMain: {
            type: Boolean,
            default: false
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    videos: [{
        url: {
            type: String,
            required: true
        },
        caption: String,
        duration: Number, // in seconds
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    virtualTour: {
        url: String,
        provider: {
            type: String,
            enum: ['matterport', 'google_street_view', 'custom']
        }
    },
    
    // Owner/Realtor Information
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Realtor',
        required: [true, 'Property owner is required']
    },
    
    // Verification and Status
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected', 'suspended'],
        default: 'pending'
    },
    verificationDocuments: [{
        type: {
            type: String,
            enum: ['ownership_document', 'property_photos', 'utility_bills', 'tax_certificate'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'rented', 'maintenance', 'suspended'],
        default: 'active'
    },
    availability: {
        available: {
            type: Boolean,
            default: true
        },
        availableFrom: {
            type: Date,
            default: Date.now
        },
        availableUntil: Date,
        immediateBooking: {
            type: Boolean,
            default: true
        }
    },
    
    // Ratings and Reviews
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
        },
        breakdown: {
            cleanliness: { type: Number, default: 0 },
            location: { type: Number, default: 0 },
            value: { type: Number, default: 0 },
            communication: { type: Number, default: 0 },
            safety: { type: Number, default: 0 }
        }
    },
    
    // Analytics
    analytics: {
        views: {
            type: Number,
            default: 0
        },
        favorites: {
            type: Number,
            default: 0
        },
        inquiries: {
            type: Number,
            default: 0
        },
        bookings: {
            type: Number,
            default: 0
        },
        lastViewed: Date
    },
    
    // SEO and Search
    tags: [String],
    featured: {
        type: Boolean,
        default: false
    },
    promoted: {
        type: Boolean,
        default: false
    },
    
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    publishedAt: Date,
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Realtor'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ type: 1, status: 1, 'availability.available': 1 });
propertySchema.index({ 'pricing.rentPerMonth': 1 });
propertySchema.index({ 'location.area': 1 });
propertySchema.index({ verificationStatus: 1 });
propertySchema.index({ featured: 1, promoted: 1 });
propertySchema.index({ 'rating.average': -1 });
propertySchema.index({ 'analytics.views': -1 });
propertySchema.index({ createdAt: -1 });

// Virtual for total monthly cost
propertySchema.virtual('totalMonthlyCost').get(function() {
    let total = this.pricing.rentPerMonth;
    
    // Add monthly additional fees
    this.pricing.additionalFees.forEach(fee => {
        if (fee.frequency === 'monthly') {
            total += fee.amount;
        }
    });
    
    return total;
});

// Virtual for main image
propertySchema.virtual('mainImage').get(function() {
    const mainImg = this.images.find(img => img.isMain);
    return mainImg ? mainImg.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Virtual for distance category
propertySchema.virtual('distanceCategory').get(function() {
    const distance = this.location.distanceToUniversity;
    if (distance <= 1) return 'Very Close';
    if (distance <= 3) return 'Close';
    if (distance <= 5) return 'Moderate';
    if (distance <= 10) return 'Far';
    return 'Very Far';
});

// Virtual for price range category
propertySchema.virtual('priceRange').get(function() {
    const rent = this.pricing.rentPerMonth;
    if (rent < 50000) return 'Budget';
    if (rent < 100000) return 'Standard';
    if (rent < 200000) return 'Premium';
    return 'Luxury';
});

// Pre-save middleware to update availability spaces
propertySchema.pre('save', function(next) {
    this.capacity.availableSpaces = this.capacity.maxOccupants - this.capacity.currentOccupants;
    this.updatedAt = Date.now();
    next();
});

// Pre-save middleware to set main image if none exists
propertySchema.pre('save', function(next) {
    if (this.images.length > 0 && !this.images.some(img => img.isMain)) {
        this.images[0].isMain = true;
    }
    next();
});

// Instance method to increment view count
propertySchema.methods.incrementViews = function() {
    this.analytics.views += 1;
    this.analytics.lastViewed = Date.now();
    return this.save();
};

// Instance method to check availability
propertySchema.methods.isAvailable = function() {
    return this.status === 'active' && 
           this.availability.available && 
           this.capacity.availableSpaces > 0 &&
           this.verificationStatus === 'verified';
};

// Instance method to calculate compatibility score with user preferences
propertySchema.methods.getCompatibilityScore = function(userPreferences) {
    let score = 0;
    let maxScore = 0;
    
    // Price compatibility (40% weight)
    maxScore += 40;
    if (userPreferences.budgetMin && userPreferences.budgetMax) {
        const propertyPrice = this.pricing.rentPerMonth;
        if (propertyPrice >= userPreferences.budgetMin && propertyPrice <= userPreferences.budgetMax) {
            score += 40;
        } else if (propertyPrice <= userPreferences.budgetMax * 1.1) {
            score += 30; // Close to budget
        } else if (propertyPrice <= userPreferences.budgetMax * 1.2) {
            score += 20; // Slightly over budget
        }
    }
    
    // Location compatibility (30% weight)
    maxScore += 30;
    if (userPreferences.preferredLocation && userPreferences.preferredLocation.includes(this.location.area)) {
        score += 30;
    } else if (this.location.distanceToUniversity <= 3) {
        score += 20; // Close to university
    } else if (this.location.distanceToUniversity <= 5) {
        score += 10; // Moderate distance
    }
    
    // Type compatibility (20% weight)
    maxScore += 20;
    if (userPreferences.accommodationType && userPreferences.accommodationType.includes(this.type)) {
        score += 20;
    }
    
    // Amenities compatibility (10% weight)
    maxScore += 10;
    if (userPreferences.amenities) {
        const matchingAmenities = userPreferences.amenities.filter(amenity => {
            return this.amenities.basic[amenity] || 
                   this.amenities.comfort[amenity] || 
                   this.amenities.entertainment[amenity] || 
                   this.amenities.safety[amenity];
        });
        score += (matchingAmenities.length / userPreferences.amenities.length) * 10;
    }
    
    return Math.round((score / maxScore) * 100);
};

// Static method to search properties
propertySchema.statics.searchProperties = function(searchCriteria = {}) {
    const query = {
        status: 'active',
        verificationStatus: 'verified',
        'availability.available': true,
        'capacity.availableSpaces': { $gt: 0 }
    };
    
    // Add search criteria
    if (searchCriteria.type) {
        query.type = { $in: Array.isArray(searchCriteria.type) ? searchCriteria.type : [searchCriteria.type] };
    }
    
    if (searchCriteria.minPrice || searchCriteria.maxPrice) {
        query['pricing.rentPerMonth'] = {};
        if (searchCriteria.minPrice) {
            query['pricing.rentPerMonth'].$gte = searchCriteria.minPrice;
        }
        if (searchCriteria.maxPrice) {
            query['pricing.rentPerMonth'].$lte = searchCriteria.maxPrice;
        }
    }
    
    if (searchCriteria.area) {
        query['location.area'] = { $in: Array.isArray(searchCriteria.area) ? searchCriteria.area : [searchCriteria.area] };
    }
    
    if (searchCriteria.bedrooms) {
        query['rooms.bedrooms'] = { $gte: searchCriteria.bedrooms };
    }
    
    if (searchCriteria.maxDistance) {
        query['location.distanceToUniversity'] = { $lte: searchCriteria.maxDistance };
    }
    
    return this.find(query).populate('owner', 'businessName phone email rating');
};

// Static method to get property statistics
propertySchema.statics.getStatistics = function() {
    return this.aggregate([
        {
            $group: {
                _id: null,
                totalProperties: { $sum: 1 },
                verifiedProperties: {
                    $sum: { $cond: [{ $eq: ['$verificationStatus', 'verified'] }, 1, 0] }
                },
                activeProperties: {
                    $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                },
                averageRent: { $avg: '$pricing.rentPerMonth' },
                totalViews: { $sum: '$analytics.views' },
                featuredProperties: {
                    $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] }
                }
            }
        }
    ]);
};

module.exports = mongoose.model('Property', propertySchema);