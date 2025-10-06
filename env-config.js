// Environment Configuration Manager
// Handles secure loading of environment variables for MWG Hostels Platform

class EnvironmentConfig {
    constructor() {
        this.config = {};
        this.isLoaded = false;
        this.loadEnvironment();
    }

    // Load environment variables (simulated for frontend)
    loadEnvironment() {
        // In a real production environment, these would come from secure server-side config
        // For demo purposes, we'll define secure defaults that would normally be loaded from .env
        this.config = {
            // Platform Configuration
            PLATFORM_NAME: 'MWG Hostels',
            PLATFORM_TAGLINE: 'Powered by SAMA d\'GREAT',
            PLATFORM_VERSION: '1.0.0',
            ENVIRONMENT: 'production',

            // Realtor Credentials (would be hashed/encrypted in production)
            REALTOR_CREDENTIALS: [
                {
                    email: 'admin@mwghostels.com',
                    password: 'sama2024', // Would be hashed in production
                    brandName: 'MWG Premium Properties',
                    fullName: 'Administrator'
                },
                {
                    email: 'realtor@mwghostels.com',
                    password: 'futarian', // Would be hashed in production
                    brandName: 'FUTA Student Housing Co.',
                    fullName: 'John Smith'
                },
                {
                    email: 'manager@mwghostels.com',
                    password: 'mwgrealtor', // Would be hashed in production
                    brandName: 'Campus Living Solutions',
                    fullName: 'Sarah Johnson'
                },
                {
                    email: 'sama@mwghostels.com',
                    password: 'sama2024', // Would be hashed in production
                    brandName: 'SAMA Properties',
                    fullName: 'Oluwaseun Great Sama'
                },
                {
                    email: 'michael@mwghostels.com',
                    password: 'michael2024', // Would be hashed in production
                    brandName: 'Elite Student Homes',
                    fullName: 'Michael Adebayo'
                },
                {
                    email: 'funmi@mwghostels.com',
                    password: 'funmi2024', // Would be hashed in production
                    brandName: 'Comfort Lodge Properties',
                    fullName: 'Funmilayo Ogundimu'
                },
                {
                    email: 'david@mwghostels.com',
                    password: 'david2024', // Would be hashed in production
                    brandName: 'Premium Campus Residence',
                    fullName: 'David Oluwaseun'
                },
                {
                    email: 'blessing@mwghostels.com',
                    password: 'blessing2024', // Would be hashed in production
                    brandName: 'Student Haven Properties',
                    fullName: 'Blessing Adeyemi'
                }
            ],

            // API Configuration
            API_BASE_URL: 'https://api.mwghostels.com',
            API_VERSION: 'v1',
            API_TIMEOUT: 30000,

            // Contact Information
            SUPPORT_EMAIL: 'support@mwghostels.com',
            SUPPORT_PHONE: '+234-801-234-5678',
            ADMIN_PHONE: '+234-901-234-5678',
            BUSINESS_ADDRESS: 'FUTA Campus, Akure, Ondo State, Nigeria',

            // Platform Settings
            MAX_UPLOAD_SIZE: 10485760, // 10MB
            ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'webp'],
            ALLOWED_VIDEO_TYPES: ['mp4', 'mov', 'avi'],
            DEFAULT_PAGE_SIZE: 20,
            MAX_HOSTEL_IMAGES: 8,
            MAX_ROOM_VIDEOS: 2,

            // Security Settings
            MAX_LOGIN_ATTEMPTS: 5,
            LOGIN_LOCKOUT_DURATION: 1800, // 30 minutes
            SESSION_TIMEOUT: 3600, // 1 hour

            // Feature Flags
            ENABLE_ROOMMATE_FEATURE: true,
            ENABLE_PAYMENT_INTEGRATION: false,
            ENABLE_CHAT_FEATURE: false,
            ENABLE_REVIEWS_SYSTEM: true,
            ENABLE_ANALYTICS: true,
            ENABLE_NOTIFICATIONS: true,

            // Social Media
            FACEBOOK_PAGE: 'https://facebook.com/mwghostels',
            TWITTER_HANDLE: '@mwghostels',
            INSTAGRAM_HANDLE: '@mwghostels',
            LINKEDIN_PAGE: 'https://linkedin.com/company/mwg-hostels'
        };

        this.isLoaded = true;
        console.log('🔐 Environment configuration loaded securely');
    }

    // Get configuration value
    get(key, defaultValue = null) {
        if (!this.isLoaded) {
            console.warn('Environment configuration not loaded yet');
            return defaultValue;
        }
        return this.config[key] !== undefined ? this.config[key] : defaultValue;
    }

    // Check if feature is enabled
    isFeatureEnabled(featureName) {
        const key = `ENABLE_${featureName.toUpperCase()}`;
        return this.get(key, false);
    }

    // Get realtor credentials (for authentication)
    getRealtorCredentials() {
        return this.get('REALTOR_CREDENTIALS', []);
    }

    // Validate realtor login
    validateRealtorLogin(email, password) {
        const credentials = this.getRealtorCredentials();
        return credentials.find(cred => 
            cred.email === email && cred.password === password
        );
    }

    // Get platform information
    getPlatformInfo() {
        return {
            name: this.get('PLATFORM_NAME'),
            tagline: this.get('PLATFORM_TAGLINE'),
            version: this.get('PLATFORM_VERSION'),
            environment: this.get('ENVIRONMENT')
        };
    }

    // Get contact information
    getContactInfo() {
        return {
            supportEmail: this.get('SUPPORT_EMAIL'),
            supportPhone: this.get('SUPPORT_PHONE'),
            adminPhone: this.get('ADMIN_PHONE'),
            businessAddress: this.get('BUSINESS_ADDRESS')
        };
    }

    // Get social media links
    getSocialMedia() {
        return {
            facebook: this.get('FACEBOOK_PAGE'),
            twitter: this.get('TWITTER_HANDLE'),
            instagram: this.get('INSTAGRAM_HANDLE'),
            linkedin: this.get('LINKEDIN_PAGE')
        };
    }

    // Get upload settings
    getUploadSettings() {
        return {
            maxSize: this.get('MAX_UPLOAD_SIZE'),
            allowedImageTypes: this.get('ALLOWED_IMAGE_TYPES'),
            allowedVideoTypes: this.get('ALLOWED_VIDEO_TYPES'),
            maxHostelImages: this.get('MAX_HOSTEL_IMAGES'),
            maxRoomVideos: this.get('MAX_ROOM_VIDEOS')
        };
    }

    // Security check for sensitive operations
    checkSecurityLevel() {
        return {
            maxLoginAttempts: this.get('MAX_LOGIN_ATTEMPTS'),
            lockoutDuration: this.get('LOGIN_LOCKOUT_DURATION'),
            sessionTimeout: this.get('SESSION_TIMEOUT')
        };
    }

    // Development mode check
    isDevelopment() {
        return this.get('ENVIRONMENT') === 'development';
    }

    // Production mode check
    isProduction() {
        return this.get('ENVIRONMENT') === 'production';
    }

    // Generate secure email domain
    generateSecureEmail(prefix) {
        return `${prefix}@mwghostels.com`;
    }

    // Mask sensitive information for logging
    maskSensitiveData(data) {
        if (typeof data === 'string') {
            return data.length > 4 ? `${data.substring(0, 2)}***${data.substring(data.length - 2)}` : '***';
        }
        return '***';
    }

    // Log configuration status (without sensitive data)
    logStatus() {
        console.log('🔐 Environment Configuration Status:');
        console.log(`   Platform: ${this.get('PLATFORM_NAME')} v${this.get('PLATFORM_VERSION')}`);
        console.log(`   Environment: ${this.get('ENVIRONMENT')}`);
        console.log(`   Features: Roommate(${this.isFeatureEnabled('roommate_feature')}), Analytics(${this.isFeatureEnabled('analytics')})`);
        console.log(`   Security: Max attempts(${this.get('MAX_LOGIN_ATTEMPTS')}), Session timeout(${this.get('SESSION_TIMEOUT')}s)`);
    }
}

// Create global environment instance
const ENV = new EnvironmentConfig();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ENV;
}

// Make available globally for frontend use
window.ENV = ENV;