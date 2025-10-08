/**
 * Advanced Performance Monitoring & User Experience Enhancement
 * Real-time performance tracking and optimization for MWG Hostels Platform
 */

class AdvancedPerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoad: {},
            userInteractions: [],
            errors: [],
            networkRequests: [],
            memoryUsage: [],
            connectionQuality: 'unknown'
        };
        
        this.thresholds = {
            firstContentfulPaint: 1500, // 1.5s
            largestContentfulPaint: 2500, // 2.5s
            cumulativeLayoutShift: 0.1,
            firstInputDelay: 100 // 100ms
        };
        
        this.init();
    }
    
    init() {
        this.trackPageLoad();
        this.trackUserInteractions();
        this.trackNetworkRequests();
        this.trackMemoryUsage();
        this.detectConnectionQuality();
        this.setupErrorTracking();
        this.monitorWebVitals();
        this.trackAccessibilityUsage();
    }
    
    trackPageLoad() {
        // Performance Observer for detailed metrics
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordMetric(entry.entryType, entry);
                }
            });
            
            observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
        }
        
        // Fallback for older browsers
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            this.metrics.pageLoad = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
                timestamp: Date.now()
            };
            
            this.analyzePageLoadPerformance();
        });
    }
    
    trackUserInteractions() {
        // Track all meaningful user interactions
        const interactionEvents = ['click', 'submit', 'input', 'scroll', 'keydown'];
        
        interactionEvents.forEach(event => {
            document.addEventListener(event, (e) => {
                this.recordInteraction(event, e.target, e);
            }, { passive: true });
        });
        
        // Track form interactions specifically
        this.trackFormInteractions();
        
        // Track hostel browsing behavior
        this.trackHostelBrowsing();
    }
    
    trackNetworkRequests() {
        // Monitor fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            const url = args[0];
            
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                
                this.recordNetworkRequest({
                    url,
                    method: args[1]?.method || 'GET',
                    status: response.status,
                    duration: endTime - startTime,
                    success: response.ok,
                    timestamp: Date.now()
                });
                
                return response;
            } catch (error) {
                const endTime = performance.now();
                
                this.recordNetworkRequest({
                    url,
                    method: args[1]?.method || 'GET',
                    status: 0,
                    duration: endTime - startTime,
                    success: false,
                    error: error.message,
                    timestamp: Date.now()
                });
                
                throw error;
            }
        };
    }
    
    trackMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                this.metrics.memoryUsage.push({
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit,
                    timestamp: Date.now()
                });
                
                // Keep only last 50 measurements
                if (this.metrics.memoryUsage.length > 50) {
                    this.metrics.memoryUsage.shift();
                }
                
                this.checkMemoryThresholds();
            }, 30000); // Every 30 seconds
        }
    }
    
    detectConnectionQuality() {
        // Use Network Information API if available
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.metrics.connectionQuality = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
            
            connection.addEventListener('change', () => {
                this.metrics.connectionQuality = {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData,
                    timestamp: Date.now()
                };
                
                this.adaptToConnectionQuality();
            });
        }
        
        // Fallback: Test connection speed
        this.testConnectionSpeed();
    }
    
    monitorWebVitals() {
        // Core Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.recordWebVital('LCP', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            new PerformanceObserver((entryList) => {
                const firstInput = entryList.getEntries()[0];
                this.recordWebVital('FID', firstInput.processingStart - firstInput.startTime);
            }).observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.recordWebVital('CLS', clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    trackAccessibilityUsage() {
        // Track accessibility feature usage
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.recordAccessibilityUsage('keyboard-navigation');
            }
        });
        
        // Track skip link usage
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', () => {
                this.recordAccessibilityUsage('skip-link');
            });
        }
        
        // Track screen reader indicators
        if (window.speechSynthesis) {
            this.recordAccessibilityUsage('speech-synthesis-available');
        }
    }
    
    trackFormInteractions() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formType = form.id || form.className || 'unknown';
            
            this.recordInteraction('form-submit', form, {
                formType,
                fieldCount: form.querySelectorAll('input, select, textarea').length,
                hasErrors: form.querySelectorAll('.error').length > 0
            });
        });
        
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.recordInteraction('form-input', e.target, {
                    fieldType: e.target.type || e.target.tagName.toLowerCase(),
                    isRequired: e.target.required,
                    hasValue: !!e.target.value
                });
            }
        });
    }
    
    trackHostelBrowsing() {
        // Track hostel card interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.hostel-card')) {
                this.recordInteraction('hostel-view', e.target.closest('.hostel-card'), {
                    hostelName: e.target.closest('.hostel-card').querySelector('h3')?.textContent,
                    action: e.target.classList.contains('btn') ? 'action-click' : 'card-click'
                });
            }
            
            if (e.target.matches('[onclick*="browseWithoutRegistration"]')) {
                this.recordInteraction('browse-without-registration', e.target);
            }
        });
    }
    
    recordMetric(type, entry) {
        if (!this.metrics[type]) {
            this.metrics[type] = [];
        }
        
        this.metrics[type].push({
            ...entry,
            timestamp: Date.now()
        });
        
        // Trigger optimizations based on metrics
        this.triggerOptimizations(type, entry);
    }
    
    recordInteraction(type, element, additionalData = {}) {
        this.metrics.userInteractions.push({
            type,
            element: element.tagName,
            className: element.className,
            id: element.id,
            timestamp: Date.now(),
            ...additionalData
        });
        
        // Keep only last 100 interactions
        if (this.metrics.userInteractions.length > 100) {
            this.metrics.userInteractions.shift();
        }
    }
    
    recordNetworkRequest(requestData) {
        this.metrics.networkRequests.push(requestData);
        
        // Keep only last 50 requests
        if (this.metrics.networkRequests.length > 50) {
            this.metrics.networkRequests.shift();
        }
        
        // Analyze request patterns
        this.analyzeNetworkPatterns();
    }
    
    recordWebVital(metric, value) {
        if (!this.metrics.webVitals) {
            this.metrics.webVitals = {};
        }
        
        this.metrics.webVitals[metric] = {
            value,
            timestamp: Date.now(),
            isGood: this.isGoodWebVital(metric, value)
        };
        
        // Send to analytics if threshold exceeded
        if (!this.isGoodWebVital(metric, value)) {
            this.reportPerformanceIssue(metric, value);
        }
    }
    
    recordAccessibilityUsage(feature) {
        if (!this.metrics.accessibility) {
            this.metrics.accessibility = {};
        }
        
        if (!this.metrics.accessibility[feature]) {
            this.metrics.accessibility[feature] = 0;
        }
        
        this.metrics.accessibility[feature]++;
    }
    
    analyzePageLoadPerformance() {
        const { pageLoad } = this.metrics;
        
        if (pageLoad.totalLoadTime > 3000) {
            this.suggestOptimizations('slow-page-load', {
                loadTime: pageLoad.totalLoadTime,
                suggestions: [
                    'Enable image lazy loading',
                    'Minimize CSS and JavaScript',
                    'Use browser caching',
                    'Optimize images'
                ]
            });
        }
        
        this.generatePerformanceReport();
    }
    
    analyzeNetworkPatterns() {
        const recentRequests = this.metrics.networkRequests.slice(-10);
        const failedRequests = recentRequests.filter(req => !req.success);
        
        if (failedRequests.length > 3) {
            this.handleNetworkIssues(failedRequests);
        }
        
        const averageRequestTime = recentRequests.reduce((sum, req) => sum + req.duration, 0) / recentRequests.length;
        
        if (averageRequestTime > 2000) {
            this.adaptToSlowNetwork();
        }
    }
    
    checkMemoryThresholds() {
        const latest = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
        const usagePercentage = (latest.used / latest.limit) * 100;
        
        if (usagePercentage > 80) {
            this.optimizeMemoryUsage();
        }
    }
    
    adaptToConnectionQuality() {
        const quality = this.metrics.connectionQuality;
        
        if (quality.effectiveType === 'slow-2g' || quality.effectiveType === '2g') {
            this.enableSlowConnectionMode();
        } else if (quality.saveData) {
            this.enableDataSaverMode();
        } else {
            this.enableHighQualityMode();
        }
    }
    
    testConnectionSpeed() {
        const startTime = performance.now();
        const testImage = new Image();
        
        testImage.onload = () => {
            const loadTime = performance.now() - startTime;
            const speed = loadTime < 500 ? 'fast' : loadTime < 1000 ? 'medium' : 'slow';
            
            this.metrics.connectionQuality = {
                estimatedSpeed: speed,
                testLoadTime: loadTime,
                timestamp: Date.now()
            };
            
            this.adaptToConnectionQuality();
        };
        
        testImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }
    
    isGoodWebVital(metric, value) {
        const thresholds = {
            'LCP': 2500,
            'FID': 100,
            'CLS': 0.1
        };
        
        return value <= thresholds[metric];
    }
    
    triggerOptimizations(type, entry) {
        // Implement specific optimizations based on metrics
        if (type === 'paint' && entry.name === 'first-contentful-paint' && entry.startTime > this.thresholds.firstContentfulPaint) {
            this.optimizeRenderPerformance();
        }
    }
    
    enableSlowConnectionMode() {
        console.log('🐌 Enabling slow connection optimizations...');
        
        // Disable non-essential animations
        document.documentElement.style.setProperty('--animation-duration', '0s');
        
        // Reduce image quality
        document.querySelectorAll('img').forEach(img => {
            if (img.src.includes('unsplash.com')) {
                img.src = img.src.replace(/w=\d+/, 'w=400').replace(/q=\d+/, 'q=60');
            }
        });
        
        // Show connection status
        this.showConnectionStatus('slow');
    }
    
    enableDataSaverMode() {
        console.log('💾 Enabling data saver mode...');
        
        // Defer non-critical resources
        this.deferNonCriticalResources();
        
        // Show data saver indicator
        this.showConnectionStatus('data-saver');
    }
    
    enableHighQualityMode() {
        console.log('🚀 Enabling high quality mode...');
        
        // Enable full animations
        document.documentElement.style.removeProperty('--animation-duration');
        
        // Load high-quality images
        this.loadHighQualityImages();
    }
    
    optimizeMemoryUsage() {
        console.log('🧹 Optimizing memory usage...');
        
        // Clear old metrics
        this.metrics.userInteractions = this.metrics.userInteractions.slice(-20);
        this.metrics.networkRequests = this.metrics.networkRequests.slice(-10);
        
        // Trigger garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }
    
    optimizeRenderPerformance() {
        console.log('⚡ Optimizing render performance...');
        
        // Reduce animation complexity
        document.querySelectorAll('.animate').forEach(el => {
            el.style.animation = 'none';
        });
        
        // Simplify visual effects
        document.documentElement.classList.add('reduced-effects');
    }
    
    handleNetworkIssues(failedRequests) {
        console.warn('🌐 Network issues detected, switching to offline mode...');
        
        // Enable offline mode
        document.dispatchEvent(new CustomEvent('networkIssues', {
            detail: { failedRequests }
        }));
        
        // Show offline indicator
        this.showConnectionStatus('offline');
    }
    
    adaptToSlowNetwork() {
        console.log('⏱️ Slow network detected, optimizing...');
        
        // Increase request timeouts
        this.increaseTimeouts();
        
        // Show loading indicators
        this.showSlowNetworkIndicators();
    }
    
    showConnectionStatus(status) {
        const statusIndicator = document.getElementById('connection-status');
        if (statusIndicator) {
            const statusConfig = {
                'slow': { text: '🐌 Slow Connection', class: 'connection-slow' },
                'data-saver': { text: '💾 Data Saver', class: 'connection-data-saver' },
                'offline': { text: '📶 Offline Mode', class: 'connection-offline' },
                'fast': { text: '🚀 Fast Connection', class: 'connection-fast' }
            };
            
            const config = statusConfig[status] || statusConfig['fast'];
            statusIndicator.textContent = config.text;
            statusIndicator.className = `connection-status ${config.class}`;
        }
    }
    
    generatePerformanceReport() {
        const report = {
            timestamp: Date.now(),
            pageLoad: this.metrics.pageLoad,
            webVitals: this.metrics.webVitals,
            userInteractions: this.metrics.userInteractions.length,
            networkRequests: this.metrics.networkRequests.length,
            memoryUsage: this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1],
            connectionQuality: this.metrics.connectionQuality,
            accessibility: this.metrics.accessibility
        };
        
        // Store report for analytics
        this.storePerformanceReport(report);
        
        return report;
    }
    
    storePerformanceReport(report) {
        try {
            const reports = JSON.parse(localStorage.getItem('mwg_performance_reports') || '[]');
            reports.push(report);
            
            // Keep only last 10 reports
            if (reports.length > 10) {
                reports.shift();
            }
            
            localStorage.setItem('mwg_performance_reports', JSON.stringify(reports));
        } catch (error) {
            console.warn('Failed to store performance report:', error);
        }
    }
    
    getPerformanceInsights() {
        const report = this.generatePerformanceReport();
        const insights = [];
        
        // Analyze page load performance
        if (report.pageLoad.totalLoadTime > 3000) {
            insights.push({
                type: 'warning',
                message: 'Page load time is slower than optimal (>3s)',
                suggestion: 'Consider optimizing images and reducing JavaScript bundle size'
            });
        }
        
        // Analyze Web Vitals
        if (report.webVitals?.LCP?.value > 2500) {
            insights.push({
                type: 'error',
                message: 'Largest Contentful Paint is too slow',
                suggestion: 'Optimize largest image or main content loading'
            });
        }
        
        // Analyze memory usage
        if (report.memoryUsage?.used > report.memoryUsage?.limit * 0.8) {
            insights.push({
                type: 'warning',
                message: 'High memory usage detected',
                suggestion: 'Clear old data and optimize JavaScript objects'
            });
        }
        
        // Analyze connection quality
        if (report.connectionQuality?.effectiveType === 'slow-2g') {
            insights.push({
                type: 'info',
                message: 'Slow connection detected',
                suggestion: 'Automatic optimizations have been applied'
            });
        }
        
        return insights;
    }
    
    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.metrics.errors.push({
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                timestamp: Date.now()
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.metrics.errors.push({
                message: event.reason?.message || 'Unhandled Promise Rejection',
                type: 'promise-rejection',
                reason: event.reason,
                timestamp: Date.now()
            });
        });
    }
    
    reportPerformanceIssue(metric, value) {
        console.warn(`❌ Performance issue detected: ${metric} = ${value}`);
        
        // In production, send to analytics
        if (typeof gtag === 'function') {
            gtag('event', 'performance_issue', {
                'metric': metric,
                'value': value,
                'user_agent': navigator.userAgent
            });
        }
    }
}

// Initialize performance monitoring
let performanceMonitor;

document.addEventListener('DOMContentLoaded', () => {
    performanceMonitor = new AdvancedPerformanceMonitor();
    
    // Make available globally for debugging
    window.performanceMonitor = performanceMonitor;
    
    // Log performance insights after 5 seconds
    setTimeout(() => {
        const insights = performanceMonitor.getPerformanceInsights();
        if (insights.length > 0) {
            console.group('📊 Performance Insights');
            insights.forEach(insight => {
                console.log(`${insight.type.toUpperCase()}: ${insight.message}`);
                console.log(`💡 Suggestion: ${insight.suggestion}`);
            });
            console.groupEnd();
        }
    }, 5000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedPerformanceMonitor;
}