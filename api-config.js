// API Configuration - Handles both local and production environments
const API_CONFIG = {
    // Detect environment
    isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    // API Base URLs
    local: 'http://localhost:5000',
    production: 'https://mwg-hostels-api.herokuapp.com',
    
    // Get the correct API URL
    getBaseURL() {
        return this.isLocalhost ? this.local : this.production;
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
        realtorRegister: () => API_CONFIG.endpoint('/api/realtor-auth/register')
    }
};

// Fetch wrapper with better error handling
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
            }
        };
        
        console.log(`🔌 API Request: ${url}`);
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ API Response:`, data);
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
}

console.log(`📡 API Config loaded - Environment: ${API_CONFIG.isLocalhost ? 'LOCAL' : 'PRODUCTION'}`);
console.log(`🌐 Base URL: ${API_CONFIG.getBaseURL()}`);
