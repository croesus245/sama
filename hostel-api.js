// MWG Hostels API Connector - Enhanced Version
// Handles all API calls to the backend with retry logic and error handling

// Auto-detect environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'  // Local development
    : 'https://sama-production-9e28.up.railway.app/api';  // Production (Railway)

// Retry configuration
const RETRY_CONFIG = {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    timeout: 15000 // 15 seconds
};

// Enhanced fetch with retry logic
async function fetchWithRetry(url, options = {}, retries = RETRY_CONFIG.maxRetries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok && retries > 0 && response.status >= 500) {
            // Retry on server errors
            console.warn(`⚠️ Request failed (${response.status}), retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.retryDelay));
            return fetchWithRetry(url, options, retries - 1);
        }
        
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (retries > 0 && (error.name === 'AbortError' || error.message.includes('fetch'))) {
            console.warn(`⚠️ Request timeout/error, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.retryDelay));
            return fetchWithRetry(url, options, retries - 1);
        }
        
        throw error;
    }
}

const HostelAPI = {
    // Helper function to get auth headers
    getAuthHeaders() {
        const token = localStorage.getItem('realtorToken');
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    },
    
    // Get all hostels with caching
    async getAllHostels() {
        try {
            // Check cache first
            if (window.appOptimizer) {
                const cached = window.appOptimizer.cacheGet('hostels_all');
                if (cached) {
                    console.log('📦 Using cached hostels');
                    return cached;
                }
            }

            const response = await fetchWithRetry(`${API_BASE_URL}/hostels`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Cache the result
            if (window.appOptimizer && data.data) {
                window.appOptimizer.cacheSet('hostels_all', data.data, 5 * 60 * 1000); // 5 minutes
            }
            
            return data.data; // Return the array of hostels
        } catch (error) {
            console.error('Error fetching hostels:', error);
            
            // Try to return cached data even if expired
            if (window.appOptimizer) {
                const cached = localStorage.getItem('cache_hostels_all');
                if (cached) {
                    console.warn('⚠️ API failed, using stale cache');
                    try {
                        const parsed = JSON.parse(cached);
                        return parsed.value;
                    } catch (e) {
                        // Cache invalid
                    }
                }
            }
            
            throw error;
        }
    },

    // Get hostels by realtor ID
    async getRealtorHostels(realtorId) {
        try {
            const cacheKey = `hostels_realtor_${realtorId}`;
            
            // Check cache
            if (window.appOptimizer) {
                const cached = window.appOptimizer.cacheGet(cacheKey);
                if (cached) {
                    console.log('📦 Using cached realtor hostels');
                    return cached;
                }
            }

            const response = await fetchWithRetry(`${API_BASE_URL}/hostels/realtor/${realtorId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Cache the result
            if (window.appOptimizer && data.data) {
                window.appOptimizer.cacheSet(cacheKey, data.data, 2 * 60 * 1000); // 2 minutes
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching realtor hostels:', error);
            throw error;
        }
    },

    // Get single hostel by ID
    async getHostelById(hostelId) {
        try {
            const response = await fetchWithRetry(`${API_BASE_URL}/hostels/${hostelId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching hostel:', error);
            throw error;
        }
    },

    // Create new hostel
    async createHostel(hostelData) {
        try {
            const response = await fetchWithRetry(`${API_BASE_URL}/hostels`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(hostelData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Clear cache
            if (window.appOptimizer) {
                window.appOptimizer.clearCache();
            }
            
            return data.data;
        } catch (error) {
            console.error('Error creating hostel:', error);
            throw error;
        }
    },

    // Update hostel
    async updateHostel(hostelId, hostelData) {
        try {
            const response = await fetchWithRetry(`${API_BASE_URL}/hostels/${hostelId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(hostelData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Clear cache
            if (window.appOptimizer) {
                window.appOptimizer.clearCache();
            }
            
            return data.data;
        } catch (error) {
            console.error('Error updating hostel:', error);
            throw error;
        }
    },

    // Delete hostel
    async deleteHostel(hostelId) {
        try {
            const response = await fetchWithRetry(`${API_BASE_URL}/hostels/${hostelId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Clear cache
            if (window.appOptimizer) {
                window.appOptimizer.clearCache();
            }
            
            return data.data;
        } catch (error) {
            console.error('Error deleting hostel:', error);
            throw error;
        }
    },

    // Toggle hostel availability
    async toggleAvailability(hostelId) {
        try {
            const response = await fetchWithRetry(`${API_BASE_URL}/hostels/${hostelId}/availability`, {
                method: 'PATCH',
                headers: this.getAuthHeaders()
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Clear cache
            if (window.appOptimizer) {
                window.appOptimizer.clearCache();
            }
            
            return data.data;
        } catch (error) {
            console.error('Error toggling availability:', error);
            throw error;
        }
    },

    // Increment application count
    async incrementApplications(hostelId) {
        try {
            const response = await fetchWithRetry(`${API_BASE_URL}/hostels/${hostelId}/apply`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error incrementing applications:', error);
            throw error;
        }
    },

    // Test API connection
    async testConnection() {
        try {
            const response = await fetchWithRetry(`${API_BASE_URL}/health`, {}, 1); // Only 1 retry for health check
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('✅ API Connection successful');
            return data;
        } catch (error) {
            console.error('❌ API Connection failed:', error);
            throw error;
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HostelAPI;
}
