// Safe localStorage wrapper with quota handling

const SafeStorage = {
    set(key, value) {
        try {
            const serialized = JSON.stringify(value);
            const sizeKB = new Blob([serialized]).size / 1024;
            
            if (sizeKB > 4000) { // Warn if approaching 4MB
                console.warn(`⚠️ Large data: ${sizeKB.toFixed(2)}KB. Consider using IndexedDB`);
            }
            
            localStorage.setItem(key, serialized);
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                this.handleQuotaExceeded(key);
            }
            console.error('Storage error:', e);
            return false;
        }
    },
    
    handleQuotaExceeded(key) {
        // Clear old data
        const oldKeys = ['cachedImages', 'oldListings', 'tempData'];
        oldKeys.forEach(k => localStorage.removeItem(k));
        
        alert('Storage full! Old data cleared. Please reduce image sizes or use fewer images.');
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Parse error:', e);
            return defaultValue;
        }
    }
};

// Replace all localStorage calls with SafeStorage
window.localStorage = SafeStorage;