/**
 * MWG Hostels Frontend API Integration
 * Connects the frontend with the backend API
 */

class MWGHostelsAPI {
    constructor() {
        this.baseURL = this.getBaseURL();
        this.token = localStorage.getItem('mwg_token');
        this.refreshToken = localStorage.getItem('mwg_refresh_token');
    }

    getBaseURL() {
        // Detect environment and set appropriate API URL
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:5001/api';
        } else if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
            // For production deployment, update with your actual backend URL
            return 'https://your-backend-api.herokuapp.com/api';
        } else {
            // For custom domain
            return 'https://api.mwghostels.com/api';
        }
    }

    // Set authentication token
    setToken(token, refreshToken = null) {
        this.token = token;
        if (token) {
            localStorage.setItem('mwg_token', token);
        } else {
            localStorage.removeItem('mwg_token');
        }

        if (refreshToken) {
            this.refreshToken = refreshToken;
            localStorage.setItem('mwg_refresh_token', refreshToken);
        }
    }

    // Get authentication headers
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Make API request with error handling
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getAuthHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            // Handle token expiration
            if (response.status === 401 && data.message?.includes('expired')) {
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    // Retry the original request with new token
                    config.headers = this.getAuthHeaders();
                    const retryResponse = await fetch(url, config);
                    return await retryResponse.json();
                } else {
                    // Redirect to login
                    this.handleAuthFailure();
                    return null;
                }
            }

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;

        } catch (error) {
            console.error('API Request failed:', error);
            
            // Show user-friendly error message
            if (error.message.includes('Failed to fetch')) {
                this.showNotification('Connection error. Please check your internet connection.', 'error');
            } else {
                this.showNotification(error.message, 'error');
            }
            
            throw error;
        }
    }

    // Refresh access token
    async refreshAccessToken() {
        if (!this.refreshToken) return false;

        try {
            const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: this.refreshToken })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.setToken(data.data.token, data.data.refreshToken);
                return true;
            }

            return false;

        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    // Handle authentication failure
    handleAuthFailure() {
        this.setToken(null);
        localStorage.removeItem('mwg_refresh_token');
        
        // Redirect to login page if not already there
        if (!window.location.pathname.includes('login')) {
            window.location.href = '/realtor-login.html';
        }
    }

    // Show notification to user
    showNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback to alert if no notification system
            alert(message);
        }
    }

    // ==================== AUTH ENDPOINTS ====================

    async register(userData) {
        return await this.makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(email, password, rememberMe = false) {
        const response = await this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, rememberMe })
        });

        if (response?.success) {
            this.setToken(response.data.token, response.data.refreshToken);
        }

        return response;
    }

    async logout() {
        const response = await this.makeRequest('/auth/logout', {
            method: 'POST'
        });

        this.setToken(null);
        localStorage.removeItem('mwg_refresh_token');
        
        return response;
    }

    async getCurrentUser() {
        return await this.makeRequest('/auth/me');
    }

    async forgotPassword(email) {
        return await this.makeRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    async verifyEmail(token) {
        return await this.makeRequest(`/auth/verify-email/${token}`);
    }

    // ==================== USER ENDPOINTS ====================

    async updateProfile(userData) {
        return await this.makeRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);

        return await this.makeRequest('/users/avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}` // Don't set Content-Type for FormData
            },
            body: formData
        });
    }

    async updatePreferences(preferences) {
        return await this.makeRequest('/users/preferences', {
            method: 'PUT',
            body: JSON.stringify(preferences)
        });
    }

    // ==================== PROPERTY ENDPOINTS ====================

    async getProperties(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return await this.makeRequest(`/properties${queryString ? `?${queryString}` : ''}`);
    }

    async getProperty(propertyId) {
        return await this.makeRequest(`/properties/${propertyId}`);
    }

    async createProperty(propertyData) {
        return await this.makeRequest('/properties', {
            method: 'POST',
            body: JSON.stringify(propertyData)
        });
    }

    async updateProperty(propertyId, propertyData) {
        return await this.makeRequest(`/properties/${propertyId}`, {
            method: 'PUT',
            body: JSON.stringify(propertyData)
        });
    }

    async deleteProperty(propertyId) {
        return await this.makeRequest(`/properties/${propertyId}`, {
            method: 'DELETE'
        });
    }

    async saveProperty(propertyId) {
        return await this.makeRequest(`/properties/${propertyId}/save`, {
            method: 'POST'
        });
    }

    async unsaveProperty(propertyId) {
        return await this.makeRequest(`/properties/${propertyId}/unsave`, {
            method: 'DELETE'
        });
    }

    // ==================== ROOMMATE ENDPOINTS ====================

    async findRoommates(preferences = {}) {
        const queryString = new URLSearchParams(preferences).toString();
        return await this.makeRequest(`/roommates${queryString ? `?${queryString}` : ''}`);
    }

    async sendRoommateRequest(userId) {
        return await this.makeRequest('/roommates/request', {
            method: 'POST',
            body: JSON.stringify({ userId })
        });
    }

    async respondToRoommateRequest(requestId, action) {
        return await this.makeRequest(`/roommates/request/${requestId}`, {
            method: 'PUT',
            body: JSON.stringify({ action }) // 'accept' or 'reject'
        });
    }

    // ==================== BOOKING ENDPOINTS ====================

    async createBooking(propertyId, bookingData) {
        return await this.makeRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify({ propertyId, ...bookingData })
        });
    }

    async getMyBookings() {
        return await this.makeRequest('/bookings/my-bookings');
    }

    async getBooking(bookingId) {
        return await this.makeRequest(`/bookings/${bookingId}`);
    }

    async cancelBooking(bookingId) {
        return await this.makeRequest(`/bookings/${bookingId}/cancel`, {
            method: 'PUT'
        });
    }

    // ==================== REVIEW ENDPOINTS ====================

    async createReview(propertyId, reviewData) {
        return await this.makeRequest('/reviews', {
            method: 'POST',
            body: JSON.stringify({ propertyId, ...reviewData })
        });
    }

    async getPropertyReviews(propertyId) {
        return await this.makeRequest(`/reviews/property/${propertyId}`);
    }

    async updateReview(reviewId, reviewData) {
        return await this.makeRequest(`/reviews/${reviewId}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData)
        });
    }

    async deleteReview(reviewId) {
        return await this.makeRequest(`/reviews/${reviewId}`, {
            method: 'DELETE'
        });
    }

    // ==================== UTILITY METHODS ====================

    isAuthenticated() {
        return !!this.token;
    }

    async checkBackendConnection() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            const data = await response.json();
            return response.ok && data.status === 'success';
        } catch (error) {
            console.error('Backend connection check failed:', error);
            return false;
        }
    }

    // Get API status
    async getAPIStatus() {
        return await this.makeRequest('/health');
    }
}

// Create global API instance
window.MWGHostelsAPI = new MWGHostelsAPI();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MWGHostelsAPI;
}

// ==================== HELPER FUNCTIONS ====================

// Initialize API integration when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🔌 MWG Hostels API Integration loaded');
    
    // Check backend connection
    const isConnected = await window.MWGHostelsAPI.checkBackendConnection();
    
    if (isConnected) {
        console.log('✅ Backend API connection successful');
    } else {
        console.warn('⚠️ Backend API not available. Some features may not work.');
        
        // Show user notification if in production
        if (window.location.hostname !== 'localhost') {
            setTimeout(() => {
                showNotification('Some features may be temporarily unavailable. Please try again later.', 'warning');
            }, 2000);
        }
    }

    // Auto-refresh token if user is logged in
    if (window.MWGHostelsAPI.isAuthenticated()) {
        try {
            const user = await window.MWGHostelsAPI.getCurrentUser();
            if (user?.success) {
                console.log('👤 User authenticated:', user.data.user.firstName);
            }
        } catch (error) {
            console.log('⚠️ Authentication check failed');
        }
    }
});

// Add global error handler for API errors
window.addEventListener('unhandledrejection', function(event) {
    if (event.reason?.message?.includes('API Request failed')) {
        // Prevent the default error popup
        event.preventDefault();
        console.error('Unhandled API error:', event.reason);
    }
});