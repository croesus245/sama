// ===============================================
// UNIVERSAL FORM VALIDATION & ERROR HANDLING
// ===============================================

class FormValidator {
    constructor() {
        this.rules = {
            required: (value) => value !== null && value !== undefined && value.toString().trim() !== '',
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => /^(\+234|0)[789]\d{9}$/.test(value.replace(/\s/g, '')),
            matricNumber: (value) => /^[A-Z]{3}\/\d{2}\/\d{4}$/.test(value),
            password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
            minLength: (value, min) => value.length >= min,
            maxLength: (value, max) => value.length <= max,
            numeric: (value) => !isNaN(value) && !isNaN(parseFloat(value)),
            min: (value, min) => parseFloat(value) >= min,
            max: (value, max) => parseFloat(value) <= max
        };
        
        this.messages = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid Nigerian phone number',
            matricNumber: 'Please enter a valid matric number (e.g., CSC/23/0011)',
            password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
            minLength: (min) => `Must be at least ${min} characters`,
            maxLength: (max) => `Must be no more than ${max} characters`,
            numeric: 'Please enter a valid number',
            min: (min) => `Value must be at least ${min}`,
            max: (max) => `Value must be no more than ${max}`
        };
    }
    
    validateField(field, rules) {
        const value = field.value;
        const errors = [];
        
        for (const rule of rules) {
            if (typeof rule === 'string') {
                if (!this.rules[rule](value)) {
                    errors.push(this.messages[rule]);
                }
            } else if (typeof rule === 'object') {
                const [ruleName, param] = Object.entries(rule)[0];
                if (!this.rules[ruleName](value, param)) {
                    errors.push(typeof this.messages[ruleName] === 'function' 
                        ? this.messages[ruleName](param) 
                        : this.messages[ruleName]);
                }
            }
        }
        
        return errors;
    }
    
    showFieldError(field, errors) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        // Remove existing error messages
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (errors.length > 0) {
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errors[0]; // Show first error
            field.parentNode.appendChild(errorDiv);
            
            // Add shake animation
            field.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                field.style.animation = '';
            }, 500);
        } else {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
        }
    }
    
    validateForm(form, validationRules) {
        let isValid = true;
        const errors = {};
        
        for (const [fieldName, rules] of Object.entries(validationRules)) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                const fieldErrors = this.validateField(field, rules);
                if (fieldErrors.length > 0) {
                    isValid = false;
                    errors[fieldName] = fieldErrors;
                }
                this.showFieldError(field, fieldErrors);
            }
        }
        
        return { isValid, errors };
    }
}

// Global Form Validator Instance
const formValidator = new FormValidator();

// Notification System
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
    }
    
    createContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    }
    
    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getIcon(type);
        notification.innerHTML = `
            <div class="notification-content">
                <i class="${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentNode.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.container.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
        
        return notification;
    }
    
    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    success(message, duration) {
        return this.show(message, 'success', duration);
    }
    
    error(message, duration) {
        return this.show(message, 'error', duration);
    }
    
    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }
    
    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Global Notification System - Use window.notifications from fixed-error-handler.js
if (typeof window.notifications === 'undefined') {
    window.notifications = new NotificationSystem();
}

// Loading Manager
class LoadingManager {
    constructor() {
        this.loadingElements = new Set();
    }
    
    show(element, text = 'Loading...') {
        if (element) {
            element.classList.add('loading');
            element.disabled = true;
            
            if (element.tagName === 'BUTTON') {
                element.dataset.originalText = element.textContent;
                element.textContent = text;
            }
            
            this.loadingElements.add(element);
        }
    }
    
    hide(element) {
        if (element) {
            element.classList.remove('loading');
            element.disabled = false;
            
            if (element.tagName === 'BUTTON' && element.dataset.originalText) {
                element.textContent = element.dataset.originalText;
                delete element.dataset.originalText;
            }
            
            this.loadingElements.delete(element);
        }
    }
    
    hideAll() {
        this.loadingElements.forEach(element => this.hide(element));
    }
}

// Global Loading Manager
const loadingManager = new LoadingManager();

// Error Handler
class ErrorHandler {
    constructor() {
        this.setupGlobalErrorHandling();
    }
    
    setupGlobalErrorHandling() {
        // Disabled aggressive global error handling that was causing spam
        // Error handling is now managed by fixed-error-handler.js
// Only handle specific form-related errors
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (form.tagName === 'FORM') {
                form.addEventListener('error', (e) => {
                    this.handleFormError(form, e.error);
                });
            }
        });
    }
    
    handleError(error, context = 'Application') {
        console.error(`${context} Error:`, error);
        
        // Only show errors for critical application failures
        if (!error || !error.message) {
            return; // Don't show generic errors
        }
        
        // Only show user-facing errors for specific critical issues
        const criticalErrors = [
            'Registration failed',
            'Login failed',
            'Payment failed',
            'Form submission failed',
            'Data validation failed'
        ];
        
        const isCritical = criticalErrors.some(critical => 
            error.message.includes(critical)
        );
        
        if (!isCritical) {
return;
        }
        
        let message = error.message;
        
        if (error.message.includes('network') || error.message.includes('fetch')) {
            message = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('validation')) {
            message = 'Please check your input and try again.';
        }
        
        // Use improved notification system if available
        if (typeof window.notifications !== 'undefined' && window.notifications.error) {
            window.notifications.error(message);
        } else {
            console.error('Critical Error:', message);
        }
    }
    
    handleFormError(form, error) {
        console.error('Form error:', error);
        
        // Reset form loading states
        const submitButton = form.querySelector('[type="submit"]');
        if (submitButton) {
            loadingManager.hide(submitButton);
        }
        
        // Show appropriate error message
        if (error.validation) {
            window.notifications.error('Please fix the form errors and try again.');
        } else if (error.network) {
            window.notifications.error('Network error. Please check your connection and try again.');
        } else {
            window.notifications.error('An error occurred while submitting the form. Please try again.');
        }
    }
}

// Global Error Handler
const errorHandler = new ErrorHandler();

// Form Enhancement Functions
function enhanceForm(form, validationRules) {
    if (!form) return;
    
    // Add real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.addEventListener('blur', () => {
                const errors = formValidator.validateField(field, validationRules[fieldName]);
                formValidator.showFieldError(field, errors);
            });
            
            field.addEventListener('input', () => {
                // Clear error on input
                const formGroup = field.closest('.form-group');
                if (formGroup && formGroup.classList.contains('error')) {
                    formGroup.classList.remove('error');
                    const errorMessage = formGroup.querySelector('.error-message');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            });
        }
    });
    
    // Enhance form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('[type="submit"]');
        
        try {
            // Show loading state
            if (submitButton) {
                loadingManager.show(submitButton, 'Processing...');
            }
            
            // Validate form
            const validation = formValidator.validateForm(form, validationRules);
            
            if (!validation.isValid) {
                throw new Error('Form validation failed');
            }
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simulate API call (replace with actual API calls)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Success
            window.notifications.success('Form submitted successfully!');
            
            // Reset form if needed
            if (form.dataset.resetOnSuccess !== 'false') {
                form.reset();
            }
            
        } catch (error) {
            errorHandler.handleFormError(form, error);
        } finally {
            // Hide loading state
            if (submitButton) {
                loadingManager.hide(submitButton);
            }
        }
    });
}

// File Upload Enhancement
function enhanceFileUpload(input, options = {}) {
    if (!input) return;
    
    const {
        maxSize = 5 * 1024 * 1024, // 5MB
        allowedTypes = ['image/*'],
        maxFiles = 1,
        preview = true
    } = options;
    
    input.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        const errors = [];
        
        // Validate file count
        if (files.length > maxFiles) {
            errors.push(`Maximum ${maxFiles} files allowed`);
        }
        
        // Validate each file
        files.forEach(file => {
            // Check file size
            if (file.size > maxSize) {
                errors.push(`File "${file.name}" is too large. Maximum size: ${maxSize / 1024 / 1024}MB`);
            }
            
            // Check file type
            const isValidType = allowedTypes.some(type => {
                if (type.endsWith('/*')) {
                    return file.type.startsWith(type.slice(0, -1));
                }
                return file.type === type;
            });
            
            if (!isValidType) {
                errors.push(`File "${file.name}" has invalid type. Allowed types: ${allowedTypes.join(', ')}`);
            }
        });
        
        if (errors.length > 0) {
            window.notifications.error(errors[0]);
            input.value = '';
            return;
        }
        
        // Show preview if enabled
        if (preview && files.length > 0) {
            showFilePreview(input, files);
        }
    });
}

function showFilePreview(input, files) {
    const previewContainer = input.parentNode.querySelector('.file-preview') || 
                           createFilePreviewContainer(input);
    
    previewContainer.innerHTML = '';
    
    files.forEach(file => {
        const previewItem = document.createElement('div');
        previewItem.className = 'file-preview-item';
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = file.name;
            previewItem.appendChild(img);
        } else {
            previewItem.innerHTML = `
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
            `;
        }
        
        previewContainer.appendChild(previewItem);
    });
}

function createFilePreviewContainer(input) {
    const container = document.createElement('div');
    container.className = 'file-preview';
    input.parentNode.appendChild(container);
    return container;
}

// Accessibility Enhancements
function enhanceAccessibility() {
    // Add skip link
    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Enhance focus management for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="flex"]');
            if (openModal) {
                const closeButton = openModal.querySelector('.modal-close, .close');
                if (closeButton) {
                    closeButton.click();
                }
            }
        }
    });
    
    // Enhance keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('using-keyboard');
    });
}

// Connection Status Monitor
function monitorConnection() {
    const showOfflineIndicator = () => {
        let indicator = document.querySelector('.offline-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'offline-indicator';
            indicator.innerHTML = `
                <i class="fas fa-wifi"></i>
                You are currently offline. Some features may not work.
            `;
            document.body.appendChild(indicator);
        }
        indicator.classList.add('show');
    };
    
    const hideOfflineIndicator = () => {
        const indicator = document.querySelector('.offline-indicator');
        if (indicator) {
            indicator.classList.remove('show');
        }
    };
    
    window.addEventListener('online', () => {
        hideOfflineIndicator();
        window.notifications.success('Connection restored!');
    });
    
    window.addEventListener('offline', () => {
        showOfflineIndicator();
        window.notifications.warning('You are now offline');
    });
    
    // Check initial connection status
    if (!navigator.onLine) {
        showOfflineIndicator();
    }
}

// Initialize all enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    enhanceAccessibility();
    monitorConnection();
    
    // Add CSS for notification system and other enhancements
    if (!document.querySelector('#enhancement-styles')) {
        const style = document.createElement('style');
        style.id = 'enhancement-styles';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            }
            
            .notification {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                margin-bottom: 10px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                border-left: 4px solid #3b82f6;
                overflow: hidden;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success { border-left-color: #22c55e; }
            .notification-error { border-left-color: #ef4444; }
            .notification-warning { border-left-color: #f59e0b; }
            .notification-info { border-left-color: #3b82f6; }
            
            .notification-content {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                gap: 8px;
            }
            
            .notification-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                color: #64748b;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background 0.2s ease;
            }
            
            .notification-close:hover {
                background: #f1f5f9;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .file-preview {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
            }
            
            .file-preview-item {
                width: 80px;
                height: 80px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                font-size: 0.75rem;
                text-align: center;
            }
            
            .file-preview-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .using-keyboard *:focus {
                outline: 2px solid #3b82f6 !important;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
});

// Export for use in other scripts
window.FormValidator = FormValidator;
window.formValidator = formValidator;
// notifications already exported as window.notifications above
window.loadingManager = loadingManager;
window.errorHandler = errorHandler;
window.enhanceForm = enhanceForm;
window.enhanceFileUpload = enhanceFileUpload;