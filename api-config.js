// API Configuration - Handles both local and production environments
// UPDATED: October 25, 2025 - Production deployment config

const API_CONFIG = {
    // Detect environment
    isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isLocalIP: window.location.hostname.match(/^(192\.168|10\.|172\.)/),
    
    // API Base URLs
    local: 'http://localhost:5000',
    localIP: () => {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        return `${protocol}//${hostname}:5000`;
    },
    // Production Railway backend - UPDATED URL
    production: 'https://sama-production-9e28.up.railway.app',
    
    // Get the correct API URL
    getBaseURL() {
        if (this.isLocalhost) {
            return this.local;
        } else if (this.isLocalIP) {
            return this.localIP();
        }
        return this.production;
    },
    
    // Build complete API endpoint
    endpoint(path) {
        const baseURL = this.getBaseURL();
        // Ensure path starts with /
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${baseURL}${cleanPath}`;
    },
    
    // Common endpoints
    endpoints: {
        health: () => API_CONFIG.endpoint('/api/health'),
        hostels: () => API_CONFIG.endpoint('/api/hostels'),
        hostel: (id) => API_CONFIG.endpoint(`/api/hostels/${id}`),
        applications: () => API_CONFIG.endpoint('/api/applications'),
        submitApplication: () => API_CONFIG.endpoint('/api/applications/submit'),
        studentApplications: (email) => API_CONFIG.endpoint(`/api/applications/student/${encodeURIComponent(email)}`),
        realtorAuth: () => API_CONFIG.endpoint('/api/realtor-auth'),
        realtorLogin: () => API_CONFIG.endpoint('/api/realtor-auth/login'),
        realtorRegister: () => API_CONFIG.endpoint('/api/realtor-auth/register'),
        realtorVerify: () => API_CONFIG.endpoint('/api/realtor-auth/verify'),
        realtorProfile: () => API_CONFIG.endpoint('/api/realtor-auth/profile'),
        studentRegister: () => API_CONFIG.endpoint('/api/students/register'),
        studentLogin: () => API_CONFIG.endpoint('/api/students/login'),
        uploadImage: () => API_CONFIG.endpoint('/api/upload/image'),
        uploadMultiple: () => API_CONFIG.endpoint('/api/upload/multiple')
    }
};

// Fetch wrapper with better error handling and timeout
async function apiFetch(url, options = {}) {
    try {
        // Add default headers
        const defaultHeaders = {
            'Content-Type': 'application/json'
        };
        
        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...(options.headers || {})
            },
            mode: 'cors',
            credentials: 'omit',
            timeout: 30000 // 30 second timeout
        };
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(url, {
            ...config,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error(`❌ API Error (${url}):`, error);
        throw error;
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
    window.apiFetch = apiFetch;
    
    // Log configuration on page load (for debugging)
    console.log('🔗 API Configuration loaded:', {
        baseURL: API_CONFIG.getBaseURL(),
        environment: API_CONFIG.isLocalhost ? 'LOCAL' : 'PRODUCTION',
        hostname: window.location.hostname
    });
}