// Global Performance Configuration
const PerformanceConfig = {
    // API Configuration
    api: {
        timeout: 15000, // 15 seconds
        retryAttempts: 3,
        retryDelay: 1000, // 1 second
        cacheExpiry: 5 * 60 * 1000 // 5 minutes
    },

    // Image Optimization
    images: {
        lazyLoadOffset: 100, // pixels
        placeholderQuality: 20,
        compressionQuality: 85,
        maxWidth: 1200,
        thumbnailWidth: 400
    },

    // Storage Management
    storage: {
        maxTokenAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        cleanupInterval: 24 * 60 * 60 * 1000, // Daily
        maxCacheSize: 50 * 1024 * 1024 // 50MB
    },

    // Mobile Optimization
    mobile: {
        syncDelay: 12000, // 12 seconds for mobile
        minTouchTarget: 44, // pixels
        swipeThreshold: 50, // pixels
        doubleTapDelay: 300 // milliseconds
    },

    // Animation Settings
    animations: {
        duration: 300, // milliseconds
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    },

    // Network Detection
    network: {
        slowConnectionThreshold: 1000, // 1 second response time
        offlineCheckInterval: 5000 // 5 seconds
    }
};

// Network Quality Detection
class NetworkMonitor {
    constructor() {
        this.quality = 'good';
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.notifyStatusChange('online');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.quality = 'offline';
            this.notifyStatusChange('offline');
        });

        // Test connection quality periodically
        if (navigator.connection) {
            this.updateConnectionInfo();
            navigator.connection.addEventListener('change', () => this.updateConnectionInfo());
        }
    }

    updateConnectionInfo() {
        const conn = navigator.connection;
        if (!conn) return;

        if (conn.effectiveType === '4g') {
            this.quality = 'excellent';
        } else if (conn.effectiveType === '3g') {
            this.quality = 'good';
        } else if (conn.effectiveType === '2g') {
            this.quality = 'slow';
        } else {
            this.quality = 'poor';
        }

        this.notifyStatusChange('quality-change');
    }

    notifyStatusChange(type) {
        window.dispatchEvent(new CustomEvent('network-status-change', {
            detail: { type, quality: this.quality, isOnline: this.isOnline }
        }));
    }

    getQuality() {
        return this.quality;
    }

    isGoodConnection() {
        return this.isOnline && ['excellent', 'good'].includes(this.quality);
    }
}

// Initialize network monitor
const networkMonitor = new NetworkMonitor();

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceConfig, NetworkMonitor };
}
