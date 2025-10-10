// MWG Hostels API Connector
// Handles all API calls to the backend

// Auto-detect environment and use appropriate API URL
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'  // Local development
    : 'https://sama-production-9e28.up.railway.app/api';  // Production (Railway)

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
    
    // Get all hostels
    async getAllHostels() {
        try {
            const response = await fetch(`${API_BASE_URL}/hostels`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.data; // Return the array of hostels
        } catch (error) {
            console.error('Error fetching hostels:', error);
            throw error;
        }
    },

    // Get hostels by realtor ID
    async getRealtorHostels(realtorId) {
        try {
            const response = await fetch(`${API_BASE_URL}/hostels/realtor/${realtorId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching realtor hostels:', error);
            throw error;
        }
    },

    // Get single hostel by ID
    async getHostelById(hostelId) {
        try {
            const response = await fetch(`${API_BASE_URL}/hostels/${hostelId}`);
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
            const response = await fetch(`${API_BASE_URL}/hostels`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(hostelData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error creating hostel:', error);
            throw error;
        }
    },

    // Update hostel
    async updateHostel(hostelId, hostelData) {
        try {
            const response = await fetch(`${API_BASE_URL}/hostels/${hostelId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(hostelData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error updating hostel:', error);
            throw error;
        }
    },

    // Delete hostel
    async deleteHostel(hostelId) {
        try {
            const response = await fetch(`${API_BASE_URL}/hostels/${hostelId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error deleting hostel:', error);
            throw error;
        }
    },

    // Toggle hostel availability
    async toggleAvailability(hostelId) {
        try {
            const response = await fetch(`${API_BASE_URL}/hostels/${hostelId}/availability`, {
                method: 'PATCH',
                headers: this.getAuthHeaders()
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error toggling availability:', error);
            throw error;
        }
    },

    // Increment application count
    async incrementApplications(hostelId) {
        try {
            const response = await fetch(`${API_BASE_URL}/hostels/${hostelId}/apply`, {
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
            const response = await fetch(`${API_BASE_URL}/health`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error testing API connection:', error);
            throw error;
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HostelAPI;
}
