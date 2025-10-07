/**
 * Enhanced Error Handling and Validation System
 * Provides comprehensive error management and user feedback
 */

class ErrorHandler {
    static handle(error, context = 'general') {
        console.error(`Error in ${context}:`, error);
        
        // Log error for analytics
        this.logError(error, context);
        
        // Show user-friendly message
        this.showUserMessage(error, context);
    }

    static logError(error, context) {
        const errorData = {
            message: error.message,
            context: context,
            stack: error.stack,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userId: window.authSystem?.currentUser?.id || 'anonymous'
        };

        // Store in localStorage for later transmission
        const errors = JSON.parse(localStorage.getItem('mwg_errors') || '[]');
        errors.push(errorData);
        
        // Keep only last 50 errors
        if (errors.length > 50) {
            errors.splice(0, errors.length - 50);
        }
        
        localStorage.setItem('mwg_errors', JSON.stringify(errors));
    }

    static showUserMessage(error, context) {
        const userMessages = {
            'registration': 'Registration failed. Please check your information and try again.',
            'login': 'Login failed. Please check your email and password.',
            'network': 'Connection issue. Your data has been saved locally and will sync when connected.',
            'validation': 'Please check the highlighted fields and try again.',
            'database': 'Service temporarily unavailable. Your data is saved locally.',
            'upload': 'File upload failed. Please check file size and format.',
            'permission': 'You don\'t have permission to perform this action.',
            'general': 'Something went wrong. Please try again or contact support.'
        };

        const message = userMessages[context] || userMessages.general;
        
        if (window.showNotification) {
            window.showNotification(message, 'error');
        } else {
            this.showFallbackMessage(message, 'error');
        }
    }

    static showFallbackMessage(message, type = 'info') {
        // Create a simple notification if showNotification doesn't exist
        const notification = document.createElement('div');
        notification.className = `error-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee2e2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    static async sendErrorReports() {
        // Send stored errors to server when online
        if (!navigator.onLine) return;

        const errors = JSON.parse(localStorage.getItem('mwg_errors') || '[]');
        if (errors.length === 0) return;

        try {
            if (window.api) {
                await window.api.makeRequest('/errors/report', {
                    method: 'POST',
                    body: JSON.stringify({ errors })
                });
                
                // Clear sent errors
                localStorage.removeItem('mwg_errors');
                console.log(`Sent ${errors.length} error reports to server`);
            }
        } catch (error) {
            console.warn('Failed to send error reports:', error);
        }
    }
}

class ValidationSystem {
    static rules = {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        password: {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
        },
        phone: {
            pattern: /^\+?[\d\s\-\(\)]{10,}$/,
            message: 'Please enter a valid phone number'
        },
        name: {
            pattern: /^[a-zA-Z\s]{2,50}$/,
            message: 'Name must be 2-50 characters and contain only letters'
        },
        studentId: {
            pattern: /^[A-Za-z0-9\/]{6,20}$/,
            message: 'Student ID format is invalid'
        }
    };

    static validateField(field, ruleName) {
        const value = field.value.trim();
        const rule = this.rules[ruleName];
        
        if (!rule) {
            console.warn(`No validation rule found for: ${ruleName}`);
            return true;
        }

        const isValid = rule.pattern.test(value);
        this.updateFieldUI(field, isValid, rule.message);
        
        return isValid;
    }

    static validateForm(form) {
        const fields = form.querySelectorAll('[data-validate]');
        let isValid = true;

        fields.forEach(field => {
            const ruleName = field.dataset.validate;
            if (!this.validateField(field, ruleName)) {
                isValid = false;
            }
        });

        return isValid;
    }

    static updateFieldUI(field, isValid, message) {
        const wrapper = field.closest('.form-group');
        if (!wrapper) return;

        let errorDiv = wrapper.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            wrapper.appendChild(errorDiv);
        }

        // Remove existing classes
        wrapper.classList.remove('error', 'success');
        
        if (isValid) {
            wrapper.classList.add('success');
            errorDiv.style.display = 'none';
        } else {
            wrapper.classList.add('error');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    static setupRealTimeValidation(form) {
        const fields = form.querySelectorAll('[data-validate]');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                const ruleName = field.dataset.validate;
                this.validateField(field, ruleName);
            });

            field.addEventListener('input', () => {
                // Clear error state while typing
                const wrapper = field.closest('.form-group');
                if (wrapper && wrapper.classList.contains('error')) {
                    wrapper.classList.remove('error');
                    const errorDiv = wrapper.querySelector('.field-error');
                    if (errorDiv) errorDiv.style.display = 'none';
                }
            });
        });
    }
}

class SecurityUtils {
    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .trim()
            .replace(/[<>\"']/g, '') // Remove potential XSS characters
            .substring(0, 1000); // Limit length
    }

    static sanitizeFormData(formData) {
        const sanitized = {};
        
        for (const [key, value] of formData.entries()) {
            sanitized[key] = this.sanitizeInput(value);
        }
        
        return sanitized;
    }

    static validateFileUpload(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            throw new Error('Only JPEG, PNG, WebP images and PDF documents are allowed');
        }

        if (file.size > maxSize) {
            throw new Error('File size must be less than 5MB');
        }

        return true;
    }

    static generateSecureId() {
        const array = new Uint32Array(4);
        crypto.getRandomValues(array);
        return Array.from(array, x => x.toString(36)).join('');
    }
}

class RateLimiter {
    constructor(maxRequests = 5, timeWindow = 60000) {
        this.requests = [];
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
    }

    canMakeRequest() {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.timeWindow);

        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = Math.min(...this.requests);
            const timeUntilNext = this.timeWindow - (now - oldestRequest);
            
            ErrorHandler.showUserMessage(
                new Error(`Too many requests. Please wait ${Math.ceil(timeUntilNext / 1000)} seconds.`),
                'general'
            );
            
            return false;
        }

        this.requests.push(now);
        return true;
    }
}

class Analytics {
    static trackEvent(category, action, label = '') {
        console.log(`Analytics: ${category} - ${action} - ${label}`);
        
        // Store for batch sending
        const events = JSON.parse(localStorage.getItem('mwg_analytics') || '[]');
        events.push({
            category,
            action,
            label,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            userId: window.authSystem?.currentUser?.id || 'anonymous'
        });

        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        localStorage.setItem('mwg_analytics', JSON.stringify(events));

        // Send to Google Analytics if available
        if (window.gtag) {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    static trackPageView(page) {
        this.trackEvent('page_view', 'view', page);
    }

    static trackRegistration(userType) {
        this.trackEvent('user', 'registration', userType);
    }

    static trackError(error, context) {
        this.trackEvent('error', context, error.message);
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    ErrorHandler.handle(event.error, 'global');
});

window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.handle(new Error(event.reason), 'promise');
});

// Send error reports when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        ErrorHandler.sendErrorReports();
    }, 5000);
});

// Send analytics when online
window.addEventListener('online', () => {
    ErrorHandler.sendErrorReports();
    // Could also send analytics data here
});

// Expose globally
window.ErrorHandler = ErrorHandler;
window.ValidationSystem = ValidationSystem;
window.SecurityUtils = SecurityUtils;
window.RateLimiter = RateLimiter;
window.Analytics = Analytics;