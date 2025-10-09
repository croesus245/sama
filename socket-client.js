/**
 * Socket.IO Client Connection for Real-time Features
 */

let socket = null;

function initializeSocketConnection() {
    try {
        // Connect to backend Socket.IO server
        socket = io('http://localhost:5000');
        
        socket.on('connect', () => {
            console.log('🔗 Connected to real-time server');
            showNotification('Real-time features enabled', 'success');
        });
        
        socket.on('disconnect', () => {
            console.log('❌ Disconnected from real-time server');
            showNotification('Real-time features disabled', 'warning');
        });
        
        // Listen for new hostel listings
        socket.on('newHostelListing', (hostel) => {
            console.log('🏠 New hostel listing received:', hostel);
            if (typeof refreshHostelListings === 'function') {
                refreshHostelListings();
            }
        });
        
        // Listen for application updates
        socket.on('applicationUpdate', (update) => {
            console.log('📝 Application update received:', update);
            showNotification(`Application ${update.status}: ${update.message}`, 'info');
        });
        
        // Listen for roommate matches
        socket.on('roommateMatch', (match) => {
            console.log('👥 Roommate match found:', match);
            showNotification('Potential roommate match found!', 'success');
        });
        
    } catch (error) {
        console.warn('Socket.IO not available, running in offline mode:', error);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure other scripts load first
    setTimeout(initializeSocketConnection, 1000);
});

// Export socket for use in other files
window.socket = socket;