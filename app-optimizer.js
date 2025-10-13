// Application-wide Optimizer
class AppOptimizer {
    constructor() {
        this.initialized = false;
        this.cache = new Map();
        this.observers = new Map();
    }

    // Initialize all optimizations
    init() {
        if (this.initialized) return;

        console.log('🚀 Initializing App Optimizer...');

        this.setupImageLazyLoading();
        this.setupCacheManagement();
        this.setupServiceWorker();
        this.setupErrorRecovery();
        this.setupPerformanceMonitoring();
        this.optimizeFormInputs();
        this.setupPrefetching();

        this.initialized = true;
        console.log('✅ App Optimizer initialized');
    }

    // Lazy load images for better performance
    setupImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src) {
                            // Create a temporary image to load
                            const tempImg = new Image();
                            tempImg.onload = () => {
                                img.src = src;
                                img.classList.add('loaded');
                                img.removeAttribute('data-src');
                            };
                            tempImg.onerror = () => {
                                img.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
                                img.classList.add('error');
                            };
                            tempImg.src = src;
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '100px'
            });

            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });

            this.observers.set('images', imageObserver);
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // Manage localStorage and cache
    setupCacheManagement() {
        // Clean old cache entries
        const cleanCache = () => {
            const now = Date.now();
            const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.includes('_timestamp')) {
                    const timestamp = parseInt(localStorage.getItem(key));
                    if (now - timestamp > maxAge) {
                        const dataKey = key.replace('_timestamp', '');
                        localStorage.removeItem(dataKey);
                        localStorage.removeItem(key);
                        console.log(`🗑️ Cleaned old cache: ${dataKey}`);
                    }
                }
            }
        };

        // Run cleanup on init and daily
        cleanCache();
        setInterval(cleanCache, 24 * 60 * 60 * 1000);
    }

    // Setup service worker for offline support
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('⚠️ Service Worker registration failed:', error);
                });
        }
    }

    // Global error recovery
    setupErrorRecovery() {
        window.addEventListener('error', (event) => {
            console.error('❌ Global error:', event.error);
            
            // If it's an image error, use fallback
            if (event.target.tagName === 'IMG') {
                event.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
            }
        }, true);

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('❌ Unhandled promise rejection:', event.reason);
            event.preventDefault();
        });
    }

    // Monitor performance metrics
    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            try {
                // Monitor long tasks
                const longTaskObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            console.warn('⚠️ Long task detected:', entry.duration.toFixed(2) + 'ms');
                        }
                    }
                });
                longTaskObserver.observe({ entryTypes: ['longtask'] });

                // Monitor layout shifts
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput && entry.value > 0.1) {
                            console.warn('⚠️ Layout shift detected:', entry.value.toFixed(4));
                        }
                    }
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });

            } catch (e) {
                console.log('Performance monitoring not fully supported');
            }
        }
    }

    // Optimize form inputs with debouncing
    optimizeFormInputs() {
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        // Add debouncing to search inputs
        document.querySelectorAll('input[type="search"], input[type="text"][name*="search"]').forEach(input => {
            const originalHandler = input.oninput;
            if (originalHandler) {
                input.oninput = debounce(originalHandler, 300);
            }
        });
    }

    // Prefetch important pages
    setupPrefetching() {
        const prefetchPages = [
            'realtor-login.html',
            'enhanced-realtor-dashboard.html'
        ];

        // Only prefetch on good connections
        if (navigator.connection && navigator.connection.effectiveType === '4g') {
            prefetchPages.forEach(page => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = page;
                document.head.appendChild(link);
            });
        }
    }

    // Cache API response with expiry
    cacheSet(key, value, expiryMs = 5 * 60 * 1000) {
        const item = {
            value: value,
            expiry: Date.now() + expiryMs
        };
        this.cache.set(key, item);
        
        // Also save to localStorage for persistence
        try {
            localStorage.setItem(`cache_${key}`, JSON.stringify(item));
        } catch (e) {
            console.warn('Cache storage failed:', e);
        }
    }

    // Get cached value if not expired
    cacheGet(key) {
        // Check memory cache first
        let item = this.cache.get(key);
        
        // Fall back to localStorage
        if (!item) {
            try {
                const stored = localStorage.getItem(`cache_${key}`);
                if (stored) {
                    item = JSON.parse(stored);
                    this.cache.set(key, item); // Restore to memory
                }
            } catch (e) {
                return null;
            }
        }

        if (!item) return null;

        // Check if expired
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            localStorage.removeItem(`cache_${key}`);
            return null;
        }

        return item.value;
    }

    // Clear all caches
    clearCache() {
        this.cache.clear();
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('cache_')) {
                localStorage.removeItem(key);
            }
        });
        console.log('✅ Cache cleared');
    }
}

// Initialize optimizer globally
const appOptimizer = new AppOptimizer();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => appOptimizer.init());
} else {
    appOptimizer.init();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppOptimizer;
}
