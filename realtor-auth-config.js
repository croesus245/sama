/**
 * MWG HOSTELS - AUTHORIZED REALTORS CONFIGURATION
 * 
 * Only emails listed here can register as realtors.
 * Edit this file to add/remove authorized realtors.
 * 
 * Color Scheme: Blue (#2196F3) and White (#FFFFFF)
 */

const AUTHORIZED_REALTORS = {
    // List of pre-approved realtor emails (case-insensitive)
    authorizedEmails: [
        'admin@mwghostels.com',
        'croes@mwghostels.com',
        'manager@mwghostels.com',
        'ibitayo.emmanuel@hemmyspace.com',
        'hemmy.space@gmail.com',
        'ibitayo@mwghostels.com',
        'agent1@properties.com',
        'agent2@realty.com',
        // ADD MORE AUTHORIZED EMAILS HERE
    ],

    // Pre-registered accounts with credentials
    preRegisteredAccounts: [
        {
            email: 'admin@mwghostels.com',
            password: 'Admin@2025',
            name: 'Admin User',
            phone: '08012345678',
            company: 'MWG Hostels Management',
            verified: true
        },
        {
            email: 'croes@mwghostels.com',
            password: 'Croes@2025',
            name: 'Croes Manager',
            phone: '08011111111',
            company: 'MWG Hostels',
            verified: true
        },
        {
            email: 'ibitayo.emmanuel@hemmyspace.com',
            password: 'Hemmy@2025',
            name: 'Ibitayo Emmanuel',
            phone: '07042919808',
            company: 'Hemmy Space',
            verified: true
        }
        // ADD MORE PRE-REGISTERED ACCOUNTS HERE
    ],

    // System settings
    settings: {
        allowPublicRegistration: false,  // Set to true to allow anyone
        autoVerifyAuthorized: true,      // Auto-verify authorized emails
        requireStrongPassword: true      // Enforce strong passwords
    }
};

// Check if email is authorized
function isAuthorizedEmail(email) {
    return AUTHORIZED_REALTORS.authorizedEmails
        .map(e => e.toLowerCase())
        .includes(email.toLowerCase());
}

// Initialize pre-registered accounts
function initializeAuthorizedRealtors() {
    const existingAccounts = JSON.parse(localStorage.getItem('realtorAccounts') || '[]');
    
    AUTHORIZED_REALTORS.preRegisteredAccounts.forEach(preReg => {
        // Check if account already exists
        const exists = existingAccounts.some(acc => 
            acc.email.toLowerCase() === preReg.email.toLowerCase()
        );
        
        if (!exists) {
            const newAccount = {
                ...preReg,
                id: `realtor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString()
            };
            existingAccounts.push(newAccount);
            console.log(`✅ Initialized account: ${preReg.email}`);
        }
    });
    
    localStorage.setItem('realtorAccounts', JSON.stringify(existingAccounts));
}

// Validate password strength
function isStrongPassword(password) {
    if (!AUTHORIZED_REALTORS.settings.requireStrongPassword) {
        return password.length >= 6;
    }
    
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return minLength && hasUpper && hasLower && hasNumber;
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuthorizedRealtors);
} else {
    initializeAuthorizedRealtors();
}

console.log('🔐 Authorized Realtor System Active');
console.log(`📧 ${AUTHORIZED_REALTORS.authorizedEmails.length} authorized emails`);
console.log(`👥 ${AUTHORIZED_REALTORS.preRegisteredAccounts.length} pre-registered accounts`);