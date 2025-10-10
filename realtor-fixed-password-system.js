/**
 * ═══════════════════════════════════════════════════════
 * MWG HOSTELS - FIXED PASSWORD SYSTEM FOR ALL REALTORS
 * ═══════════════════════════════════════════════════════
 * 
 * ONE PASSWORD FOR ALL AUTHORIZED REALTORS
 * Password: MWG@2025
 * 
 * Each realtor just enters their name when logging in
 * No complicated registration or verification needed
 */

// ═══════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════

const FIXED_REALTOR_PASSWORD = 'MWG@2025';  // ONE password for everyone

// Pre-approved realtor names (optional - for validation)
const AUTHORIZED_REALTORS = [
    'Administrator',
    'John Smith',
    'Sarah Johnson',
    'Oluwaseun Great Sama',
    'Michael Adebayo',
    'Funmilayo Ogundimu',
    'David Oluwaseun',
    'Blessing Adeyemi',
    'Demo Realtor'
];

// ═══════════════════════════════════════════════════════
// CORE AUTHENTICATION FUNCTIONS
// ═══════════════════════════════════════════════════════

/**
 * Check if realtor is currently logged in
 */
function isRealtorLoggedIn() {
    const loggedIn = localStorage.getItem('realtorLoggedIn');
    const realtorName = localStorage.getItem('realtorName');
    return loggedIn === 'true' && realtorName;
}

/**
 * Get current realtor information
 */
function getCurrentRealtor() {
    if (!isRealtorLoggedIn()) return null;
    
    return {
        name: localStorage.getItem('realtorName'),
        loginTime: localStorage.getItem('realtorLoginTime'),
        id: localStorage.getItem('realtorId')
    };
}

/**
 * Login with fixed password
 */
function realtorLogin(name, password) {
    // Validate inputs
    if (!name || !password) {
        return {
            success: false,
            message: '❌ Please enter your name and password'
        };
    }

    // Check password
    if (password !== FIXED_REALTOR_PASSWORD) {
        return {
            success: false,
            message: '❌ Incorrect password! Use: MWG@2025'
        };
    }

    // Optional: Check if name is authorized (can be disabled)
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
        return {
            success: false,
            message: '❌ Please enter your full name'
        };
    }

    // SUCCESS - Set login status
    const realtorId = 'realtor_' + Date.now();
    localStorage.setItem('realtorLoggedIn', 'true');
    localStorage.setItem('realtorName', trimmedName);
    localStorage.setItem('realtorLoginTime', new Date().toISOString());
    localStorage.setItem('realtorId', realtorId);

    // Log successful login
    console.log('✅ Realtor Login Successful:', {
        name: trimmedName,
        id: realtorId,
        time: new Date().toLocaleString()
    });

    return {
        success: true,
        message: `✅ Welcome back, ${trimmedName}!`,
        realtor: {
            name: trimmedName,
            id: realtorId
        }
    };
}

/**
 * Logout realtor
 */
function realtorLogout() {
    const realtor = getCurrentRealtor();
    
    // Clear login data
    localStorage.removeItem('realtorLoggedIn');
    localStorage.removeItem('realtorName');
    localStorage.removeItem('realtorLoginTime');
    localStorage.removeItem('realtorId');

    console.log('👋 Realtor Logged Out:', realtor?.name || 'Unknown');

    // Redirect to login page
    if (window.location.pathname !== '/realtor-login.html' && 
        !window.location.pathname.includes('realtor-login.html')) {
        window.location.href = 'realtor-login.html';
    }
}

/**
 * Protect realtor-only pages
 */
function requireRealtorAuth() {
    if (!isRealtorLoggedIn()) {
        console.warn('⚠️ Unauthorized access attempt - redirecting to login');
        window.location.href = 'realtor-login.html';
        return false;
    }
    return true;
}

/**
 * Auto-redirect if already logged in (for login page)
 */
function redirectIfLoggedIn(targetPage = 'realtor-dashboard.html') {
    if (isRealtorLoggedIn()) {
        console.log('✅ Already logged in - redirecting to dashboard');
        window.location.href = targetPage;
        return true;
    }
    return false;
}

// ═══════════════════════════════════════════════════════
// UI HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════

/**
 * Show notification message
 */
function showRealtorNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.realtor-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'realtor-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 16px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    notification.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Update dashboard UI with realtor name
 */
function updateRealtorDashboardUI() {
    const realtor = getCurrentRealtor();
    if (!realtor) return;

    // Update name displays
    document.querySelectorAll('[data-realtor-name]').forEach(el => {
        el.textContent = realtor.name;
    });

    // Update welcome messages
    document.querySelectorAll('[data-realtor-welcome]').forEach(el => {
        el.textContent = `Welcome back, ${realtor.name}!`;
    });
}

// ═══════════════════════════════════════════════════════
// AUTO-INITIALIZATION
// ═══════════════════════════════════════════════════════

// Add CSS animations
if (!document.getElementById('realtor-auth-styles')) {
    const style = document.createElement('style');
    style.id = 'realtor-auth-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Log system status
console.log('═══════════════════════════════════════════════════════');
console.log('🔐 MWG HOSTELS - Fixed Password System Loaded');
console.log('═══════════════════════════════════════════════════════');
console.log('Password for all realtors: MWG@2025');
console.log('Currently logged in:', isRealtorLoggedIn() ? getCurrentRealtor()?.name : 'No');
console.log('═══════════════════════════════════════════════════════');

// Make functions globally available
window.isRealtorLoggedIn = isRealtorLoggedIn;
window.getCurrentRealtor = getCurrentRealtor;
window.realtorLogin = realtorLogin;
window.realtorLogout = realtorLogout;
window.requireRealtorAuth = requireRealtorAuth;
window.redirectIfLoggedIn = redirectIfLoggedIn;
window.showRealtorNotification = showRealtorNotification;
window.updateRealtorDashboardUI = updateRealtorDashboardUI;
window.FIXED_REALTOR_PASSWORD = FIXED_REALTOR_PASSWORD;
