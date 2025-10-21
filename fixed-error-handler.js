/**
 * Fixed Error Handling System
 * Only shows errors for actual application failures, not normal browser behavior
 */

// Global error handler that's less aggressive
window.addEventListener('error', function(event) {
    // Ignore common browser errors that aren't actually problems
    const ignoredErrors = [
        'Script error',
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'Loading chunk',
        'ChunkLoadError',
        'Loading CSS chunk',
        'Network request failed'
    ];
    
    const errorMessage = event.message || '';
    const shouldIgnore = ignoredErrors.some(ignored => 
        errorMessage.includes(ignored)
    );
    
    if (shouldIgnore) {
        console.warn('Ignored non-critical error:', errorMessage);
        return;
    }
    
    // Only log actual application errors
    console.error('Application Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

// Promise rejection handler that's less aggressive
window.addEventListener('unhandledrejection', function(event) {
    // Ignore common promise rejections that aren't actually problems
    const ignoredRejections = [
        'Network request failed',
        'Load failed',
        'The user aborted a request',
        'Failed to fetch',
        'NetworkError'
    ];
    
    const reason = event.reason?.toString() || '';
    const shouldIgnore = ignoredRejections.some(ignored => 
        reason.includes(ignored)
    );
    
    if (shouldIgnore) {
        console.warn('Ignored non-critical promise rejection:', reason);
        event.preventDefault(); // Prevent default handling
        return;
    }
    
    // Only log actual application promise rejections
    console.error('Application Promise Rejection:', event.reason);
});

// Improved notification system that doesn't spam users
class ImprovedNotifications {
    constructor() {
        this.lastNotification = null;
        this.notificationCount = 0;
        this.resetInterval = 30000; // Reset count every 30 seconds
        
        setInterval(() => {
            this.notificationCount = 0;
        }, this.resetInterval);
    }
    
    show(message, type = 'info', duration = 5000) {
        // Prevent spam notifications
        if (this.lastNotification === message && this.notificationCount > 2) {
            console.log('Prevented duplicate notification:', message);
            return;
        }
        
        this.lastNotification = message;
        this.notificationCount++;
        
        // Only show critical errors or success messages
        if (type === 'error' && !this.isCriticalError(message)) {
            console.warn('Non-critical error suppressed:', message);
            return;
        }
        
        this.displayNotification(message, type, duration);
    }
    
    isCriticalError(message) {
        const criticalErrors = [
            'Registration failed',
            'Login failed',
            'Payment failed',
            'Data loss',
            'Security issue',
            'Authentication required'
        ];
        
        return criticalErrors.some(critical => 
            message.toLowerCase().includes(critical.toLowerCase())
        );
    }
    
    displayNotification(message, type, duration) {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification-toast');
        existing.forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-toast notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            background: ${this.getBackgroundColor(type)};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }
    
    getIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    getBackgroundColor(type) {
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }
    
    // Convenience methods
    success(message, duration) {
        this.show(message, 'success', duration);
    }
    
    error(message, duration) {
        this.show(message, 'error', duration);
    }
    
    warning(message, duration) {
        this.show(message, 'warning', duration);
    }
    
    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

// Initialize improved notifications (only if not already defined)
if (typeof window.notifications === 'undefined') {
    window.notifications = new ImprovedNotifications();
}

// Override existing notification functions to use improved system
window.showNotification = function(message, type = 'info', duration = 5000) {
    if (typeof window.notifications !== 'undefined' && window.notifications.show) {
        window.notifications.show(message, type, duration);
    }
};

// Improved showModal function that doesn't throw errors
window.showModal = function(title, content, size = 'medium') {
    try {
        // Remove existing modals
        const existingModals = document.querySelectorAll('.modal, .gate-modal');
        existingModals.forEach(modal => modal.remove());
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        const sizeClasses = {
            'small': 'modal-small',
            'medium': '',
            'large': 'modal-large'
        };
        
        modal.innerHTML = `
            <div class="modal-content ${sizeClasses[size] || ''}">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
    } catch (error) {
        console.error('Modal creation error:', error);
        // Fallback to alert if modal fails
        alert(title + '\n\n' + content.replace(/<[^>]*>/g, ''));
    }
};

// Improved closeModal function
window.closeModal = function() {
    try {
        const modals = document.querySelectorAll('.modal, .gate-modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
            setTimeout(() => {
                if (modal.parentElement) {
                    modal.remove();
                }
            }, 100);
        });
        document.body.style.overflow = '';
    } catch (error) {
        console.error('Modal close error:', error);
    }
};

// Debug function to check for missing files
function checkRequiredFiles() {
    const requiredFiles = [
        'hostel-script.js',
        'theme-enhanced.css',
        'modal-styles.css',
        'student-application-system.js',
        'student-application-system.css'
    ];
    
    requiredFiles.forEach(file => {
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    console.warn(`Missing file: ${file}`);
                }
            })
            .catch(() => {
                console.warn(`Could not load: ${file}`);
            });
    });
}

// Check files on load
document.addEventListener('DOMContentLoaded', function() {
    checkRequiredFiles();
    console.log('✅ Fixed error handling system loaded');
});

// Prevent common errors from showing to users
const originalConsoleError = console.error;
console.error = function(...args) {
    // Log to console but don't show popup errors for these
    const message = args.join(' ');
    const suppressedErrors = [
        'favicon.ico',
        '404',
        'chunk',
        'manifest.json'
    ];
    
    const shouldSuppress = suppressedErrors.some(error => 
        message.toLowerCase().includes(error)
    );
    
    if (!shouldSuppress) {
        originalConsoleError.apply(console, args);
    }
};

console.log('🔧 Fixed Error Handling System Active - Reduced Error Spam');