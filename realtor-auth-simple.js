/**
 * MWG HOSTELS - SIMPLIFIED REALTOR SYSTEM
 * 
 * One master password for all realtors.
 * Each realtor enters their details when uploading.
 * Blue (#2196F3) and White theme
 */

const REALTOR_MASTER_PASSWORD = 'MWG@2025'; // One password for everyone

// Check if user entered correct master password
function checkRealtorAccess(password) {
    return password === REALTOR_MASTER_PASSWORD;
}

// Show notification
function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1rem;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3500);
}

// Check if realtor is logged in
function isRealtorLoggedIn() {
    return localStorage.getItem('realtorAccess') === 'granted';
}

// Login handler
function realtorLogin(password) {
    if (checkRealtorAccess(password)) {
        localStorage.setItem('realtorAccess', 'granted');
        return true;
    }
    return false;
}

// Logout handler
function realtorLogout() {
    localStorage.removeItem('realtorAccess');
    window.location.href = 'realtor-login.html';
}

console.log('🔐 Simple Realtor Auth System Loaded');
console.log('Master Password: MWG@2025');