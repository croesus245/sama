/* ===============================================
   ADVANCED JAVASCRIPT UTILITIES & IMPROVEMENTS
   =============================================== */

// Enhanced State Management
const AdvancedState = {
    // Cache management
    cache: new Map(),
    
    // Performance monitoring
    performance: {
        loadTimes: [],
        interactions: [],
        errors: []
    },
    
    // User preferences
    preferences: {
        theme: localStorage.getItem('userTheme') || 'auto',
        animations: localStorage.getItem('userAnimations') !== 'false',
        notifications: localStorage.getItem('userNotifications') !== 'false'
    },
    
    // Connection status
    isOnline: navigator.onLine,
    
    // Device info
    device: {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTablet: /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent),
        hasTouch: 'ontouchstart' in window,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
};

// Enhanced Error Handling
class ErrorHandler {
    static log(error, context = '') {
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // Log to console in development
        if (ENV?.get('ENVIRONMENT') !== 'production') {
            console.error('🚨 Error:', errorInfo);
        }
        
        // Store for analytics
        AdvancedState.performance.errors.push(errorInfo);
        
        // Send to error reporting service (in production)
        if (ENV?.get('ENVIRONMENT') === 'production') {
            this.reportError(errorInfo);
        }
    }
    
    static reportError(errorInfo) {
        // In a real application, send to error reporting service
        // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorInfo) });
        console.log('📊 Error reported:', errorInfo);
    }
    
    static showUserFriendlyError(message = 'Something went wrong. Please try again.') {
        showNotification(message, 'error');
    }
}

// Enhanced Performance Monitor
class PerformanceMonitor {
    static startTiming(label) {
        performance.mark(`${label}-start`);
    }
    
    static endTiming(label) {
        performance.mark(`${label}-end`);
        performance.measure(label, `${label}-start`, `${label}-end`);
        
        const measure = performance.getEntriesByName(label)[0];
        AdvancedState.performance.loadTimes.push({
            label,
            duration: measure.duration,
            timestamp: Date.now()
        });
        
        // Log slow operations
        if (measure.duration > 1000) {
            console.warn(`⚠️ Slow operation: ${label} took ${measure.duration.toFixed(2)}ms`);
        }
    }
}

// Enhanced Image Lazy Loading with Intersection Observer
class LazyImageLoader {
    constructor() {
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        this.init();
    }
    
    init() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (img.complete) {
                this.onImageLoad(img);
            } else {
                this.imageObserver.observe(img);
                img.addEventListener('load', () => this.onImageLoad(img));
                img.addEventListener('error', () => this.onImageError(img));
            }
        });
    }
    
    loadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    }
    
    onImageLoad(img) {
        img.classList.add('loaded');
        img.style.opacity = '1';
    }
    
    onImageError(img) {
        img.classList.add('error');
        img.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80';
        console.warn('🖼️ Image failed to load:', img.src);
    }
}

// Enhanced Form Validation
class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    static validatePhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    static validateRequired(value) {
        return value && value.trim().length > 0;
    }
    
    static validateForm(formElement) {
        const errors = [];
        const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            const value = input.value.trim();
            const fieldName = input.name || input.id || 'Field';
            
            if (!this.validateRequired(value)) {
                errors.push(`${fieldName} is required`);
                this.showFieldError(input, `${fieldName} is required`);
            } else if (input.type === 'email' && !this.validateEmail(value)) {
                errors.push(`${fieldName} must be a valid email`);
                this.showFieldError(input, 'Please enter a valid email address');
            } else if (input.type === 'tel' && !this.validatePhone(value)) {
                errors.push(`${fieldName} must be a valid phone number`);
                this.showFieldError(input, 'Please enter a valid phone number');
            } else {
                this.clearFieldError(input);
            }
        });
        
        return errors;
    }
    
    static showFieldError(input, message) {
        input.classList.add('error');
        let errorElement = input.parentNode.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            input.parentNode.appendChild(errorElement);
        }
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    }
    
    static clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// Enhanced Notification System
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
        this.queue = [];
        this.activeNotifications = new Set();
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    show(message, type = 'info', duration = 5000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.activeNotifications.add(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => this.dismiss(notification), duration);
        }
        
        return notification;
    }
    
    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getBackgroundColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: auto;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;
        
        const icon = this.getIcon(type);
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `;
        closeBtn.onclick = () => this.dismiss(notification);
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        notification.appendChild(closeBtn);
        
        return notification;
    }
    
    getBackgroundColor(type) {
        const colors = {
            success: '#16a34a',
            error: '#dc2626',
            warning: '#f59e0b',
            info: '#2563eb'
        };
        return colors[type] || colors.info;
    }
    
    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    dismiss(notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.activeNotifications.delete(notification);
        }, 300);
    }
    
    clear() {
        this.activeNotifications.forEach(notification => this.dismiss(notification));
    }
}

// Enhanced Local Storage with Encryption
class SecureStorage {
    static encrypt(data) {
        // Simple encryption for demo - use proper encryption in production
        return btoa(JSON.stringify(data));
    }
    
    static decrypt(encryptedData) {
        try {
            return JSON.parse(atob(encryptedData));
        } catch (error) {
            console.error('Failed to decrypt data:', error);
            return null;
        }
    }
    
    static setItem(key, value, encrypt = false) {
        try {
            const data = encrypt ? this.encrypt(value) : JSON.stringify(value);
            localStorage.setItem(key, data);
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    }
    
    static getItem(key, encrypted = false) {
        try {
            const data = localStorage.getItem(key);
            if (!data) return null;
            
            return encrypted ? this.decrypt(data) : JSON.parse(data);
        } catch (error) {
            console.error('Failed to read from localStorage:', error);
            return null;
        }
    }
    
    static removeItem(key) {
        localStorage.removeItem(key);
    }
    
    static clear() {
        localStorage.clear();
    }
}

// Enhanced Search with Fuzzy Matching
class SearchEngine {
    static fuzzySearch(query, items, keys = ['name']) {
        if (!query) return items;
        
        const queryLower = query.toLowerCase();
        
        return items
            .map(item => {
                let score = 0;
                
                keys.forEach(key => {
                    const value = this.getNestedValue(item, key);
                    if (value) {
                        const valueLower = value.toString().toLowerCase();
                        
                        // Exact match
                        if (valueLower === queryLower) score += 100;
                        // Starts with
                        else if (valueLower.startsWith(queryLower)) score += 50;
                        // Contains
                        else if (valueLower.includes(queryLower)) score += 25;
                        // Fuzzy match
                        else {
                            const fuzzyScore = this.calculateFuzzyScore(queryLower, valueLower);
                            score += fuzzyScore;
                        }
                    }
                });
                
                return { item, score };
            })
            .filter(result => result.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(result => result.item);
    }
    
    static getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    
    static calculateFuzzyScore(query, text) {
        let score = 0;
        let queryIndex = 0;
        
        for (let i = 0; i < text.length && queryIndex < query.length; i++) {
            if (text[i] === query[queryIndex]) {
                score += 1;
                queryIndex++;
            }
        }
        
        return queryIndex === query.length ? score : 0;
    }
}

// Enhanced Analytics
class Analytics {
    static track(event, properties = {}) {
        const data = {
            event,
            properties: {
                ...properties,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                viewport: `${window.innerWidth}x${window.innerHeight}`
            }
        };
        
        // Store locally for demo
        AdvancedState.performance.interactions.push(data);
        
        // In production, send to analytics service
        console.log('📊 Analytics:', data);
    }
    
    static trackPageView() {
        this.track('page_view', {
            page: window.location.pathname,
            title: document.title
        });
    }
    
    static trackInteraction(element, action) {
        this.track('user_interaction', {
            element: element.tagName.toLowerCase(),
            action,
            text: element.textContent?.slice(0, 50)
        });
    }
}

// Initialize Enhanced Features
function initializeAdvancedFeatures() {
    try {
        // Initialize enhanced systems
        window.notifications = new NotificationSystem();
        window.lazyLoader = new LazyImageLoader();
        
        // Track initial page view
        Analytics.trackPageView();
        
        // Set up global error handling
        window.addEventListener('error', (event) => {
            ErrorHandler.log(event.error, 'Global error');
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            ErrorHandler.log(new Error(event.reason), 'Unhandled promise rejection');
        });
        
        // Monitor online/offline status
        window.addEventListener('online', () => {
            AdvancedState.isOnline = true;
            notifications.show('Connection restored', 'success');
        });
        
        window.addEventListener('offline', () => {
            AdvancedState.isOnline = false;
            notifications.show('Connection lost', 'warning');
        });
        
        // Set up interaction tracking
        document.addEventListener('click', (event) => {
            if (event.target.matches('button, a, .card, .btn')) {
                Analytics.trackInteraction(event.target, 'click');
            }
        });
        
        console.log('✅ Advanced features initialized successfully');
        
    } catch (error) {
        ErrorHandler.log(error, 'Advanced features initialization');
    }
}

// Enhanced utility functions
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    formatCurrency(amount, currency = 'NGN') {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    formatDate(date, options = {}) {
        return new Intl.DateTimeFormat('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        }).format(new Date(date));
    },
    
    copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        }
    },
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    sanitizeHtml(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
};

// Simple Analytics System (for dashboard tracking)
const Analytics = {
    track(eventName, data = {}) {
        const event = {
            name: eventName,
            data,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        console.log('📊 Analytics Event:', eventName, data);
        
        // Store in local storage for debugging
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        events.push(event);
        
        // Keep only last 50 events
        if (events.length > 50) {
            events.shift();
        }
        
        localStorage.setItem('analytics_events', JSON.stringify(events));
        
        // In production, send to analytics service
        // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(event) });
    },
    
    getEvents() {
        return JSON.parse(localStorage.getItem('analytics_events') || '[]');
    },
    
    clearEvents() {
        localStorage.removeItem('analytics_events');
    }
};

// Make Analytics and Utils available globally
window.Analytics = Analytics;
window.Utils = Utils;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdvancedFeatures);
} else {
    initializeAdvancedFeatures();
}