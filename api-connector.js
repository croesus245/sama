/**
 * Frontend-Backend API Connector
 * This file initializes the API connection and provides helper functions
 */

// Initialize API connection
const mwgAPI = new MWGHostelsAPI();

// Helper function to handle API registration
async function registerUserAPI(userData) {
    try {
        const response = await mwgAPI.register(userData);
        if (response.success) {
            localStorage.setItem('userRegistered', 'true');
            localStorage.setItem('userData', JSON.stringify(response.user));
            localStorage.setItem('mwg_token', response.token);
            return response;
        }
    } catch (error) {
        console.error('API Registration failed, using localStorage fallback:', error);
        // Fallback to localStorage for offline mode
        localStorage.setItem('userRegistered', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        return { success: true, user: userData, offline: true };
    }
}

// Helper function to load hostels from API
async function loadHostelsAPI() {
    try {
        const response = await mwgAPI.getProperties();
        if (response.success) {
            return response.properties;
        }
    } catch (error) {
        console.error('API failed, using localStorage fallback:', error);
        // Fallback to localStorage for offline mode
        const savedListings = localStorage.getItem('realtorListings');
        return savedListings ? JSON.parse(savedListings) : [];
    }
}

// Helper function to submit applications via API
async function submitApplicationAPI(applicationData) {
    try {
        const response = await mwgAPI.submitApplication(applicationData);
        if (response.success) {
            return response;
        }
    } catch (error) {
        console.error('API failed, using localStorage fallback:', error);
        // Fallback to localStorage for offline mode
        const applications = JSON.parse(localStorage.getItem('studentApplications') || '[]');
        applications.push(applicationData);
        localStorage.setItem('studentApplications', JSON.stringify(applications));
        return { success: true, application: applicationData, offline: true };
    }
}

// Export for use in other files
window.mwgAPI = mwgAPI;
window.registerUserAPI = registerUserAPI;
window.loadHostelsAPI = loadHostelsAPI;
window.submitApplicationAPI = submitApplicationAPI;

console.log('🔗 API Connector initialized - Hybrid online/offline mode ready');