// Realtor Portal JavaScript
console.log('🏢 MWG Realtor Portal - Initializing...');

// Global state
const realtorState = {
    isLoggedIn: false,
    currentRealtor: null,
    listings: [],
    stats: {
        totalListings: 0,
        totalViews: 0,
        totalInquiries: 0
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeRealtorPortal();
});

// Initialize Portal
function initializeRealtorPortal() {
    console.log('🚀 Initializing Realtor Portal...');
    
    // Check if already logged in (for demo purposes)
    const savedLogin = localStorage.getItem('realtorLoggedIn');
    if (savedLogin === 'true') {
        showDashboard();
    }
    
    // Initialize forms
    initializeLoginForm();
    initializeAddHostelForm();
    
    console.log('✅ Realtor Portal initialized');
}

// Login Form
function initializeLoginForm() {
    const loginForm = document.getElementById('realtorLoginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(this);
        });
    }
}

// Handle Login
function handleLogin(form) {
    console.log('🔐 Processing realtor login...');
    
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    // Simulate login process
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Check for specific realtor password
        if (password === 'sama2024' || password === 'futarian' || password === 'mwgrealtor') {
            realtorState.isLoggedIn = true;
            realtorState.currentRealtor = {
                name: email.split('@')[0].replace(/[^a-zA-Z ]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                email: email,
                id: 'realtor_' + Date.now(),
                verified: true
            };
            
            // Save login state
            localStorage.setItem('realtorLoggedIn', 'true');
            localStorage.setItem('realtorData', JSON.stringify(realtorState.currentRealtor));
            
            showDashboard();
            showNotification('Welcome to MWG Realtor Portal! Built by Sama for Futarians.', 'success');
            
            console.log('✅ Login successful');
        } else {
            showNotification('Invalid credentials. Use password: sama2024, futarian, or mwgrealtor', 'error');
        }
    }, 1500);
}

// Show Dashboard
function showDashboard() {
    // Check if we're on the login page
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    // If we have the login/dashboard sections (old format), use them
    if (loginSection && dashboardSection) {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        
        // Load realtor data
        const savedRealtor = localStorage.getItem('realtorData');
        if (savedRealtor) {
            realtorState.currentRealtor = JSON.parse(savedRealtor);
        }
        
        // Update dashboard
        updateDashboardData();
        loadRealtorListings();
    } else {
        // Redirect to the new dashboard page
        window.location.href = 'realtor-dashboard.html';
    }
}

// Update Dashboard Data
function updateDashboardData() {
    // Update realtor name
    const nameElement = document.getElementById('realtorName');
    if (nameElement && realtorState.currentRealtor) {
        nameElement.textContent = realtorState.currentRealtor.name;
    }
    
    // Load saved listings and update stats
    const savedListings = localStorage.getItem('realtorListings');
    if (savedListings) {
        realtorState.listings = JSON.parse(savedListings);
    }
    
    // Update stats
    realtorState.stats.totalListings = realtorState.listings.length;
    realtorState.stats.totalViews = realtorState.listings.reduce((sum, listing) => sum + (listing.views || 0), 0);
    realtorState.stats.totalInquiries = realtorState.listings.reduce((sum, listing) => sum + (listing.inquiries || 0), 0);
    
    // Update stat displays
    document.getElementById('totalListings').textContent = realtorState.stats.totalListings;
    document.getElementById('totalViews').textContent = realtorState.stats.totalViews;
    document.getElementById('totalInquiries').textContent = realtorState.stats.totalInquiries;
    
    console.log('📊 Dashboard data updated');
}

// Load Realtor Listings
function loadRealtorListings() {
    const listingsGrid = document.getElementById('listingsGrid');
    
    if (!listingsGrid) return;
    
    if (realtorState.listings.length === 0) {
        listingsGrid.innerHTML = `
            <div class="empty-listings">
                <i class="fas fa-home"></i>
                <h3>No listings yet</h3>
                <p>Start by adding your first hostel listing to attract students.</p>
                <button class="btn btn-primary" onclick="showAddHostelForm()">
                    <i class="fas fa-plus"></i>
                    Add Your First Hostel
                </button>
            </div>
        `;
        return;
    }
    
    listingsGrid.innerHTML = realtorState.listings.map(listing => `
        <div class="listing-card" data-id="${listing.id}">
            <div class="listing-image">
                <img src="${listing.images[0] || 'https://images.unsplash.com/photo-1555854877-bab0e921b58d?auto=format&fit=crop&w=800&q=80'}" alt="${listing.name}">
                <div class="listing-status ${listing.status || 'active'}">${(listing.status || 'active').toUpperCase()}</div>
            </div>
            
            <div class="listing-content">
                <div class="listing-header">
                    <h4>${listing.name}</h4>
                    <div class="listing-price">₦${listing.price.toLocaleString()}</div>
                </div>
                
                <div class="listing-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${listing.location.charAt(0).toUpperCase() + listing.location.slice(1)} Campus</span>
                </div>
                
                <div class="listing-stats">
                    <div class="listing-stat">
                        <span class="listing-stat-number">${listing.views || 0}</span>
                        <span class="listing-stat-label">Views</span>
                    </div>
                    <div class="listing-stat">
                        <span class="listing-stat-number">${listing.inquiries || 0}</span>
                        <span class="listing-stat-label">Inquiries</span>
                    </div>
                    <div class="listing-stat">
                        <span class="listing-stat-number">${listing.capacity}</span>
                        <span class="listing-stat-label">Capacity</span>
                    </div>
                </div>
                
                <div class="listing-actions">
                    <button class="btn btn-outline" onclick="editListing('${listing.id}')">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn btn-primary" onclick="viewListingDetails('${listing.id}')">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log(`📋 Loaded ${realtorState.listings.length} listings`);
}

// Add Hostel Form
function initializeAddHostelForm() {
    const addHostelForm = document.getElementById('addHostelForm');
    const imageInput = document.getElementById('hostelImages');
    
    if (addHostelForm) {
        addHostelForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddHostel(this);
        });
    }
    
    if (imageInput) {
        imageInput.addEventListener('change', handleImagePreview);
    }
}

// Handle Image Preview
function handleImagePreview(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById('imagePreviews');
    
    if (!previewContainer || !files.length) return;
    
    previewContainer.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewDiv = document.createElement('div');
                previewDiv.className = 'image-preview';
                previewDiv.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button type="button" class="image-preview-remove" onclick="removeImagePreview(this)">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                previewContainer.appendChild(previewDiv);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Remove Image Preview
function removeImagePreview(button) {
    button.parentElement.remove();
}

// Show Add Hostel Form
function showAddHostelForm() {
    const modal = document.getElementById('addHostelModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Add Hostel Modal
function closeAddHostelModal() {
    const modal = document.getElementById('addHostelModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form
        const form = document.getElementById('addHostelForm');
        if (form) {
            form.reset();
            document.getElementById('imagePreviews').innerHTML = '';
        }
    }
}

// Handle Add Hostel
function handleAddHostel(form) {
    console.log('🏠 Adding new hostel...');
    
    try {
        const formData = new FormData(form);
        
        // Collect form data
        const hostelData = {
            id: 'hostel_' + Date.now(),
            name: formData.get('name'),
            location: formData.get('location'),
            price: parseInt(formData.get('price')),
            capacity: parseInt(formData.get('capacity')),
            address: formData.get('address'),
            description: formData.get('description'),
            phone: formData.get('phone'),
            whatsapp: formData.get('whatsapp'),
            status: 'active',
            createdAt: new Date().toISOString(),
            views: Math.floor(Math.random() * 50), // Mock data
            inquiries: Math.floor(Math.random() * 10), // Mock data
            images: []
        };
        
        // Collect amenities
        const amenities = [];
        const amenityCheckboxes = form.querySelectorAll('input[name="amenities"]:checked');
        amenityCheckboxes.forEach(checkbox => {
            amenities.push(checkbox.value);
        });
        hostelData.amenities = amenities;
        
        // Handle images (for demo, use placeholder URLs)
        const imageFiles = formData.getAll('images');
        if (imageFiles.length > 0) {
            // In a real app, you'd upload these to a server
            // For demo, we'll use placeholder URLs
            hostelData.images = [
                'https://images.unsplash.com/photo-1555854877-bab0e921b58d?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            ];
        }
        
        // Validation
        if (!validateHostelData(hostelData)) {
            return;
        }
        
        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Hostel...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Add to listings
            realtorState.listings.push(hostelData);
            
            // Save to localStorage
            localStorage.setItem('realtorListings', JSON.stringify(realtorState.listings));
            
            // Update dashboard
            updateDashboardData();
            loadRealtorListings();
            
            // Close modal
            closeAddHostelModal();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success
            showNotification('Hostel listing added successfully!', 'success');
            
            console.log('✅ Hostel added successfully');
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error adding hostel:', error);
        showNotification('Failed to add hostel. Please try again.', 'error');
    }
}

// Validate Hostel Data
function validateHostelData(data) {
    const requiredFields = ['name', 'location', 'price', 'capacity', 'address', 'description', 'phone'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
        return false;
    }
    
    if (data.price < 10000 || data.price > 200000) {
        showNotification('Price must be between ₦10,000 and ₦200,000', 'error');
        return false;
    }
    
    if (data.amenities.length === 0) {
        showNotification('Please select at least one amenity', 'error');
        return false;
    }
    
    if (data.images.length === 0) {
        showNotification('Please upload at least one image', 'error');
        return false;
    }
    
    return true;
}

// Listing Actions
function editListing(listingId) {
    console.log(`✏️ Editing listing: ${listingId}`);
    showNotification('Edit functionality coming soon!', 'info');
}

function viewListingDetails(listingId) {
    const listing = realtorState.listings.find(l => l.id === listingId);
    if (!listing) return;
    
    console.log(`👁️ Viewing listing: ${listing.name}`);
    
    showModal('Listing Details', `
        <div class="listing-details">
            <img src="${listing.images[0]}" alt="${listing.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
            <h3>${listing.name}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${listing.location.charAt(0).toUpperCase() + listing.location.slice(1)} Campus</p>
            <p><strong>Price:</strong> ₦${listing.price.toLocaleString()} per semester</p>
            <p><strong>Capacity:</strong> ${listing.capacity} students per room</p>
            <p><strong>Address:</strong> ${listing.address}</p>
            <p><strong>Description:</strong> ${listing.description}</p>
            <p><strong>Amenities:</strong> ${listing.amenities.join(', ')}</p>
            <p><strong>Contact:</strong> ${listing.phone}</p>
            ${listing.whatsapp ? `<p><strong>WhatsApp:</strong> ${listing.whatsapp}</p>` : ''}
            <div style="margin-top: 1rem; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                <h4>Statistics</h4>
                <p>Views: ${listing.views || 0} | Inquiries: ${listing.inquiries || 0}</p>
            </div>
        </div>
    `);
}

// Dashboard Actions
function refreshDashboard() {
    console.log('🔄 Refreshing dashboard...');
    updateDashboardData();
    loadRealtorListings();
    showNotification('Dashboard refreshed!', 'success');
}

function logout() {
    console.log('🚪 Logging out...');
    
    // Clear state
    realtorState.isLoggedIn = false;
    realtorState.currentRealtor = null;
    
    // Clear localStorage
    localStorage.removeItem('realtorLoggedIn');
    localStorage.removeItem('realtorData');
    
    // Show login section
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    if (loginSection && dashboardSection) {
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
    }
    
    showNotification('Logged out successfully', 'success');
}

// Registration Form (placeholder)
function showRegistrationForm() {
    showModal('Realtor Registration', `
        <div class="registration-info">
            <h3>Register as a Verified Realtor</h3>
            <p>To become a verified realtor on MWG Hostels, please contact our admin team:</p>
            <div style="text-align: left; margin: 1rem 0;">
                <p><i class="fas fa-envelope"></i> <strong>Email:</strong> admin@mwghostels.com</p>
                <p><i class="fas fa-phone"></i> <strong>Phone:</strong> +234 800 MWG HOSTELS</p>
                <p><i class="fas fa-whatsapp"></i> <strong>WhatsApp:</strong> +234 800 694 4678</p>
            </div>
            <p><strong>Requirements:</strong></p>
            <ul style="text-align: left; margin: 1rem 0;">
                <li>Valid business registration</li>
                <li>Property ownership/management documents</li>
                <li>Identity verification</li>
                <li>Safety compliance certificates</li>
            </ul>
            <button class="btn btn-primary" onclick="window.open('https://wa.me/2348006944678?text=Hi, I want to register as a verified realtor on MWG Hostels', '_blank'); closeModal();">
                <i class="fab fa-whatsapp"></i> Contact on WhatsApp
            </button>
        </div>
    `);
}

// Utility Functions
function showNotification(message, type = 'info') {
    console.log(`📢 Notification (${type}): ${message}`);
    
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'error' ? '#fee2e2' : type === 'success' ? '#d1fae5' : '#dbeafe'};
        color: ${type === 'error' ? '#991b1b' : type === 'success' ? '#065f46' : '#1e40af'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border-left: 4px solid ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function showModal(title, content) {
    // Remove existing modals
    document.querySelectorAll('.custom-modal').forEach(m => m.remove());
    
    const modal = document.createElement('div');
    modal.className = 'modal custom-modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="margin: 0;">${title}</h3>
                <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--gray-500);">&times;</button>
            </div>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    document.querySelectorAll('.custom-modal').forEach(m => m.remove());
}

console.log('✅ MWG Realtor Portal JavaScript loaded successfully');