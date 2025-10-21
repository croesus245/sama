/**
 * Production Performance Optimizations for MWG Hostels
 * Enhances loading speed and user experience
 */

// Service Worker for caching (Progressive Web App features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('🔧 Service Worker registered successfully');
            })
            .catch(function(error) {
                console.log('❌ Service Worker registration failed');
            });
    });
}

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    // Create intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
});

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.startTime = performance.now();
        this.init();
    }

    init() {
        // Monitor page load time
        window.addEventListener('load', () => {
            this.metrics.pageLoadTime = performance.now() - this.startTime;
            this.logMetrics();
        });

        // Monitor API response times
        this.monitorAPIPerformance();
    }

    monitorAPIPerformance() {
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const startTime = performance.now();
            const response = await originalFetch(...args);
            const endTime = performance.now();
            
            // Log API performance
            if (args[0].includes('/api/')) {
                console.log(`🚀 API Call: ${args[0]} - ${Math.round(endTime - startTime)}ms`);
            }
            
            return response;
        };
    }

    logMetrics() {
        console.log('📊 Performance Metrics:', this.metrics);
        
        // Send to analytics if needed
        if (this.metrics.pageLoadTime > 3000) {
            console.warn('⚠️ Slow page load detected:', this.metrics.pageLoadTime + 'ms');
        }
    }
}

// Initialize performance monitoring
new PerformanceMonitor();

// Critical CSS inlining for above-the-fold content
const criticalCSS = `
    /* Critical styles for immediate rendering */
    .landing-hero {
        min-height: 100vh;
        background: linear-gradient(rgba(0,0,0,0.4), rgba(102,126,234,0.6));
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .landing-container {
        text-align: center;
        color: white;
        max-width: 800px;
        padding: 2rem;
    }
    
    .sama-logo {
        max-width: 400px;
        width: 90%;
        height: auto;
        margin-bottom: 2rem;
    }
`;

// Inject critical CSS
const productionStyle = document.createElement('style');
productionStyle.textContent = criticalCSS;
document.head.appendChild(productionStyle);

// Preload key resources
const preloadResources = [
    { href: '/sama.png', as: 'image' },
    { href: '/api-integration.js', as: 'script' }
];

preloadResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    document.head.appendChild(link);
});

// Analytics tracking for production
class ProductionAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.init();
    }

    generateSessionId() {
        return Math.random().toString(36).substr(2, 9);
    }

    init() {
        // Track page views
        this.trackPageView();
        
        // Track user interactions
        this.trackUserInteractions();
        
        // Track errors
        this.trackErrors();
    }

    trackPageView() {
        const pageData = {
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        console.log('📊 Page View:', pageData);
        // Send to analytics service when available
    }

    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (event) => {
            if (event.target.matches('button, .btn, .cta-button')) {
                const interactionData = {
                    type: 'click',
                    element: event.target.textContent.trim(),
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                    sessionId: this.sessionId
                };
                
                console.log('👆 User Interaction:', interactionData);
            }
        });

        // Track form submissions
        document.addEventListener('submit', (event) => {
            const formData = {
                type: 'form_submission',
                form: event.target.id || event.target.className,
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId
            };
            
            console.log('📝 Form Submission:', formData);
        });
    }

    trackErrors() {
        window.addEventListener('error', (event) => {
            const errorData = {
                type: 'javascript_error',
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId
            };
            
            console.error('❌ JavaScript Error:', errorData);
            // Send to error tracking service
        });

        // Track API errors
        window.addEventListener('unhandledrejection', (event) => {
            const errorData = {
                type: 'promise_rejection',
                reason: event.reason?.message || event.reason,
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId
            };
            
            console.error('❌ Promise Rejection:', errorData);
        });
    }
}

// Initialize analytics only in production
if (window.location.hostname !== 'localhost') {
    new ProductionAnalytics();
}

// Theme performance optimization
document.addEventListener('DOMContentLoaded', function() {
    // Preload theme assets
    const themeAssets = [
        'theme-system.css',
        'theme-integration.css',
        'landing-theme-fix.css'
    ];
    
    themeAssets.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = asset;
        document.head.appendChild(link);
    });
    
    // Optimize theme transitions
    document.documentElement.style.setProperty('--transition-speed', '0.2s');
});

// Connection quality detection
class ConnectionMonitor {
    constructor() {
        this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        this.init();
    }

    init() {
        if (this.connection) {
            this.logConnectionInfo();
            this.connection.addEventListener('change', () => {
                this.logConnectionInfo();
                this.adjustForConnection();
            });
        }
    }

    logConnectionInfo() {
        console.log('🌐 Connection Info:', {
            effectiveType: this.connection.effectiveType,
            downlink: this.connection.downlink,
            rtt: this.connection.rtt
        });
    }

    adjustForConnection() {
        const isSlowConnection = this.connection.effectiveType === '2g' || 
                               this.connection.effectiveType === 'slow-2g';
        
        if (isSlowConnection) {
            // Reduce animations for slow connections
            document.documentElement.style.setProperty('--transition-speed', '0s');
            console.log('🐌 Slow connection detected, reducing animations');
        }
    }
}

new ConnectionMonitor();