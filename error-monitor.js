// Global error tracker

class ErrorMonitor {
    constructor() {
        this.errors = [];
        this.init();
    }
    
    init() {
        // Catch JavaScript errors
        window.addEventListener('error', (e) => {
            this.log({
                type: 'JavaScript Error',
                message: e.message,
                file: e.filename,
                line: e.lineno,
                col: e.colno,
                stack: e.error?.stack
            });
        });
        
        // Catch promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.log({
                type: 'Promise Rejection',
                message: e.reason?.message || e.reason,
                stack: e.reason?.stack
            });
        });
        
        // Catch resource load errors
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                this.log({
                    type: 'Resource Error',
                    element: e.target.tagName,
                    src: e.target.src || e.target.href
                });
            }
        }, true);
    }
    
    log(error) {
        error.timestamp = new Date().toISOString();
        error.url = window.location.href;
        error.userAgent = navigator.userAgent;
        
        this.errors.push(error);
        console.error('❌ Error logged:', error);
        
        // Store in localStorage for debugging
        try {
            const stored = JSON.parse(localStorage.getItem('errorLog') || '[]');
            stored.push(error);
            localStorage.setItem('errorLog', JSON.stringify(stored.slice(-50))); // Keep last 50
        } catch (e) {
            // Ignore storage errors
        }
    }
    
    getErrors() {
        return this.errors;
    }
    
    clearErrors() {
        this.errors = [];
        localStorage.removeItem('errorLog');
    }
}

// Initialize
const errorMonitor = new ErrorMonitor();
window.ErrorMonitor = errorMonitor;

// View errors in console
console.log('📊 Error Monitor initialized. Use ErrorMonitor.getErrors() to view errors');

// Browser console test suite
const tests = {
    localStorage: () => {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return '✅ localStorage works';
        } catch (e) {
            return '❌ localStorage failed: ' + e.message;
        }
    },
    
    images: () => {
        const broken = Array.from(document.querySelectorAll('img'))
            .filter(img => !img.complete || img.naturalHeight === 0);
        return broken.length === 0 
            ? '✅ All images loaded' 
            : `❌ ${broken.length} images failed`;
    },
    
    forms: () => {
        const forms = document.querySelectorAll('form');
        return forms.length > 0 
            ? `✅ ${forms.length} forms found` 
            : '⚠️ No forms found';
    }
};

Object.entries(tests).forEach(([name, test]) => {
    console.log(`${name}: ${test()}`);
});