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
        
        // Define valid realtor credentials
        const validCredentials = [
            { email: 'admin@mwghostels.com', password: 'sama2024' },
            { email: 'realtor@mwghostels.com', password: 'futarian' },
            { email: 'manager@mwghostels.com', password: 'mwgrealtor' },
            { email: 'sama@mwghostels.com', password: 'sama2024' }
        ];
        
        // Check if credentials match any valid combination
        const isValidLogin = validCredentials.some(cred => 
            cred.email === email && cred.password === password
        );
        
        if (isValidLogin) {
            // Get brand info based on email for demo
            let brandInfo = {};
            if (email === 'admin@mwghostels.com') {
                brandInfo = { brandName: 'MWG Premium Properties', fullName: 'Administrator' };
            } else if (email === 'realtor@mwghostels.com') {
                brandInfo = { brandName: 'FUTA Student Housing Co.', fullName: 'John Smith' };
            } else if (email === 'manager@mwghostels.com') {
                brandInfo = { brandName: 'Campus Living Solutions', fullName: 'Sarah Johnson' };
            } else if (email === 'sama@mwghostels.com') {
                brandInfo = { brandName: 'SAMA Properties', fullName: 'Oluwaseun Great Sama' };
            }
            
            realtorState.isLoggedIn = true;
            realtorState.currentRealtor = {
                name: email.split('@')[0].replace(/[^a-zA-Z ]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                email: email,
                id: 'realtor_' + Date.now(),
                verified: true,
                ...brandInfo
            };
            
            // Save login state
            localStorage.setItem('realtorLoggedIn', 'true');
            localStorage.setItem('realtorData', JSON.stringify(realtorState.currentRealtor));
            
            showDashboard();
            showNotification('Welcome to MWG Realtor Portal! Built by Sama for Futarians.', 'success');
            
            console.log('✅ Login successful');
        } else {
            showNotification('Invalid email or password. Please contact admin for access.', 'error');
        }
    }, 1500);
}

// Load Dashboard
function showDashboard() {
    // Check if we're on the login page
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    // If we have the login/dashboard sections (old format), use them
    if (loginSection && dashboardSection) {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        
        // Load realtor data with error handling
        try {
            const savedRealtor = localStorage.getItem('realtorData');
            if (savedRealtor) {
                realtorState.currentRealtor = JSON.parse(savedRealtor);
            }
            
            const savedListings = localStorage.getItem('realtorListings');
            if (savedListings) {
                realtorState.listings = JSON.parse(savedListings);
            }
        } catch (error) {
            console.warn('Error loading saved data:', error);
            // Clear corrupted data
            localStorage.removeItem('realtorData');
            localStorage.removeItem('realtorListings');
            realtorState.listings = [];
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
    
    // Update brand information if available
    const brandNameElement = document.getElementById('brandName');
    const realNameElement = document.getElementById('realtorRealName');
    const bannerSection = document.getElementById('realtorBanner');
    const bannerImage = document.getElementById('bannerImage');
    
    if (realtorState.currentRealtor) {
        // Show brand name if available
        if (brandNameElement && realtorState.currentRealtor.brandName) {
            brandNameElement.textContent = realtorState.currentRealtor.brandName;
        }
        
        // Show real name if available
        if (realNameElement && realtorState.currentRealtor.fullName) {
            realNameElement.textContent = realtorState.currentRealtor.fullName;
        }
        
        // Show banner if available
        if (bannerSection && realtorState.currentRealtor.bannerUrl) {
            bannerImage.src = realtorState.currentRealtor.bannerUrl;
            bannerImage.onload = function() {
                bannerSection.style.display = 'block';
            };
            bannerImage.onerror = function() {
                console.warn('Banner image failed to load');
                bannerSection.style.display = 'none';
            };
        }
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
                    <button class="listing-share-btn" onclick="shareListingLink('${listing.id}')" title="Share this listing">
                        <i class="fas fa-share-alt"></i>
                        Share
                    </button>
                    <button class="btn btn-danger" onclick="deleteListing('${listing.id}')" title="Delete this listing">
                        <i class="fas fa-trash"></i>
                        Delete
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
            images: [],
            // Add realtor brand information
            realtorInfo: {
                name: realtorState.currentRealtor?.name || 'Unknown',
                fullName: realtorState.currentRealtor?.fullName || realtorState.currentRealtor?.name,
                brandName: realtorState.currentRealtor?.brandName || realtorState.currentRealtor?.name,
                email: realtorState.currentRealtor?.email,
                bannerUrl: realtorState.currentRealtor?.bannerUrl
            }
        };
        
        // Collect amenities
        const amenities = [];
        const amenityCheckboxes = form.querySelectorAll('input[name="amenities"]:checked');
        amenityCheckboxes.forEach(checkbox => {
            amenities.push(checkbox.value);
        });
        hostelData.amenities = amenities;
        
        // Get submit button for loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Handle images - convert uploaded files to displayable URLs
        const imageFiles = formData.getAll('images');
        
        if (imageFiles.length > 0 && imageFiles[0].name) {
            // Show loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Images...';
            submitBtn.disabled = true;
            
            // Process uploaded images
            const imagePromises = Array.from(imageFiles).map(file => {
                return new Promise((resolve) => {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            resolve(e.target.result);
                        };
                        reader.readAsDataURL(file);
                    } else {
                        resolve(null);
                    }
                });
            });
            
            // Wait for all images to be processed
            Promise.all(imagePromises).then(imageUrls => {
                hostelData.images = imageUrls.filter(url => url !== null);
                
                // If no valid images, use placeholders
                if (hostelData.images.length === 0) {
                    hostelData.images = [
                        'https://images.unsplash.com/photo-1555854877-bab0e921b58d?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
                    ];
                }
                
                // Save the hostel with actual images
                saveHostelData(hostelData, form, submitBtn, originalText);
            }).catch(error => {
                console.error('Error processing images:', error);
                // Use placeholders if image processing fails
                hostelData.images = [
                    'https://images.unsplash.com/photo-1555854877-bab0e921b58d?auto=format&fit=crop&w=800&q=80'
                ];
                saveHostelData(hostelData, form, submitBtn, originalText);
            });
        } else {
            // No images uploaded, use placeholders
            hostelData.images = [
                'https://images.unsplash.com/photo-1555854877-bab0e921b58d?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
            ];
            saveHostelData(hostelData, form, submitBtn, originalText);
        }
        
    } catch (error) {
        console.error('❌ Error adding hostel:', error);
        showNotification('Error adding hostel. Please try again.', 'error');
    }
}

// Separate function to save hostel data
function saveHostelData(hostelData, form, submitBtn, originalText) {
    try {
        // Validation
        if (!validateHostelData(hostelData)) {
            // Reset button on validation failure
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Show loading
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
            showNotification('Hostel listing added successfully! Images have been saved.', 'success');
            
            console.log('✅ Hostel added successfully with images:', hostelData.images.length);
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error saving hostel:', error);
        showNotification('Failed to add hostel. Please try again.', 'error');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
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
    
    const listing = realtorState.listings.find(l => l.id === listingId);
    if (!listing) {
        showNotification('Listing not found!', 'error');
        return;
    }
    
    // Create edit modal with current listing data
    showModal('Edit Hostel Listing', `
        <form id="editListingForm" class="edit-listing-form">
            <input type="hidden" id="editListingId" value="${listing.id}">
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editListingName">Hostel Name *</label>
                    <input type="text" id="editListingName" name="name" value="${listing.name}" required>
                </div>
                <div class="form-group">
                    <label for="editListingLocation">Location *</label>
                    <select id="editListingLocation" name="location" required>
                        <option value="">Select Campus Area</option>
                        <option value="north" ${listing.location === 'north' ? 'selected' : ''}>North Gate</option>
                        <option value="south" ${listing.location === 'south' ? 'selected' : ''}>South Gate</option>
                        <option value="west" ${listing.location === 'west' ? 'selected' : ''}>West Gate</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="editListingPrice">Price per Semester (₦) *</label>
                    <input type="number" id="editListingPrice" name="price" value="${listing.price}" min="10000" max="200000" required>
                </div>
                <div class="form-group">
                    <label for="editListingCapacity">Students per Room *</label>
                    <select id="editListingCapacity" name="capacity" required>
                        <option value="">Select Capacity</option>
                        <option value="1" ${listing.capacity == 1 ? 'selected' : ''}>1 per room</option>
                        <option value="2" ${listing.capacity == 2 ? 'selected' : ''}>2 per room</option>
                        <option value="3" ${listing.capacity == 3 ? 'selected' : ''}>3 per room</option>
                        <option value="4" ${listing.capacity == 4 ? 'selected' : ''}>4 per room</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="editListingAddress">Address *</label>
                <input type="text" id="editListingAddress" name="address" value="${listing.address}" required>
            </div>

            <div class="form-group">
                <label for="editListingDescription">Description *</label>
                <textarea id="editListingDescription" name="description" rows="3" required>${listing.description}</textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="editListingPhone">Phone Number *</label>
                    <input type="tel" id="editListingPhone" name="phone" value="${listing.phone}" required>
                </div>
                <div class="form-group">
                    <label for="editListingWhatsapp">WhatsApp (Optional)</label>
                    <input type="tel" id="editListingWhatsapp" name="whatsapp" value="${listing.whatsapp || ''}">
                </div>
            </div>

            <div class="form-group">
                <label>Available Amenities *</label>
                <div class="amenities-grid">
                    ${['wifi', 'power', 'water', 'security', 'parking', 'kitchen', 'laundry', 'study'].map(amenity => `
                        <label class="amenity-checkbox">
                            <input type="checkbox" name="amenities" value="${amenity}" ${listing.amenities.includes(amenity) ? 'checked' : ''}>
                            <span>${amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                        </label>
                    `).join('')}
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Save Changes
                </button>
            </div>
        </form>
    `);
    
    // Handle form submission
    setTimeout(() => {
        const editForm = document.getElementById('editListingForm');
        if (editForm) {
            editForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleEditListing(this);
            });
        }
    }, 100);
}

function handleEditListing(form) {
    const formData = new FormData(form);
    const listingId = formData.get('editListingId') || document.getElementById('editListingId').value;
    
    const updatedData = {
        name: formData.get('name'),
        location: formData.get('location'),
        price: parseInt(formData.get('price')),
        capacity: parseInt(formData.get('capacity')),
        address: formData.get('address'),
        description: formData.get('description'),
        phone: formData.get('phone'),
        whatsapp: formData.get('whatsapp'),
        amenities: formData.getAll('amenities')
    };
    
    // Validation
    const requiredFields = ['name', 'location', 'price', 'capacity', 'address', 'description', 'phone'];
    const missingFields = requiredFields.filter(field => !updatedData[field]);
    
    if (missingFields.length > 0) {
        showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
        return;
    }
    
    if (updatedData.amenities.length === 0) {
        showNotification('Please select at least one amenity', 'error');
        return;
    }
    
    if (updatedData.price < 10000 || updatedData.price > 200000) {
        showNotification('Price must be between ₦10,000 and ₦200,000', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving Changes...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Find and update the listing
        const listingIndex = realtorState.listings.findIndex(l => l.id === listingId);
        if (listingIndex !== -1) {
            // Keep original data that shouldn't change
            const originalListing = realtorState.listings[listingIndex];
            realtorState.listings[listingIndex] = {
                ...originalListing,
                ...updatedData,
                updatedAt: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('realtorListings', JSON.stringify(realtorState.listings));
            
            // Update dashboard
            updateDashboardData();
            loadRealtorListings();
            
            // Show success
            showNotification(`"${updatedData.name}" updated successfully!`, 'success');
            
            // Close modal
            closeModal();
            
            console.log('✅ Listing updated successfully:', updatedData);
        } else {
            showNotification('Error: Listing not found!', 'error');
        }
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function deleteListing(listingId) {
    const listing = realtorState.listings.find(l => l.id === listingId);
    if (!listing) {
        showNotification('Listing not found!', 'error');
        return;
    }
    
    // Show confirmation modal
    showModal('Delete Hostel Listing', `
        <div class="delete-confirmation">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                <h3>Are you sure you want to delete this listing?</h3>
                <p><strong>"${listing.name}"</strong></p>
                <p style="color: var(--gray-600);">This action cannot be undone. All data associated with this listing will be permanently removed.</p>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-outline" onclick="closeModal()">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button type="button" class="btn btn-danger" onclick="confirmDeleteListing('${listingId}')">
                    <i class="fas fa-trash"></i> Delete Permanently
                </button>
            </div>
        </div>
    `);
}

function confirmDeleteListing(listingId) {
    const listing = realtorState.listings.find(l => l.id === listingId);
    if (!listing) {
        showNotification('Listing not found!', 'error');
        return;
    }
    
    // Show loading state in modal
    const modal = document.querySelector('.custom-modal .modal-content');
    if (modal) {
        modal.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-blue); margin-bottom: 1rem;"></i>
                <h3>Deleting "${listing.name}"...</h3>
                <p>Please wait while we remove the listing.</p>
            </div>
        `;
    }
    
    // Simulate deletion process
    setTimeout(() => {
        // Remove from listings array
        const listingIndex = realtorState.listings.findIndex(l => l.id === listingId);
        if (listingIndex !== -1) {
            realtorState.listings.splice(listingIndex, 1);
            
            // Save to localStorage
            localStorage.setItem('realtorListings', JSON.stringify(realtorState.listings));
            
            // Update dashboard
            updateDashboardData();
            loadRealtorListings();
            
            // Close modal
            closeModal();
            
            // Show success
            showNotification(`"${listing.name}" has been deleted successfully`, 'success');
            
            console.log('✅ Listing deleted successfully:', listing.name);
        } else {
            showNotification('Error: Could not delete listing', 'error');
        }
    }, 2000);
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
        <form id="realtorRegistrationForm" class="registration-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="realtorFullName">Full Name *</label>
                    <input type="text" id="realtorFullName" name="fullName" required placeholder="Your real name (will be displayed)">
                    <small>Your real name will always be shown for transparency</small>
                </div>
                <div class="form-group">
                    <label for="realtorBusinessName">Business/Brand Name *</label>
                    <input type="text" id="realtorBusinessName" name="businessName" required placeholder="Your business or brand name">
                    <small>This will be prominently displayed on your listings</small>
                </div>
            </div>
            
            <div class="form-group">
                <label for="businessBanner">Business Logo/Banner *</label>
                <div class="file-upload-area">
                    <input type="file" id="businessBanner" name="banner" accept="image/*" required>
                    <label for="businessBanner" class="file-upload-label">
                        <i class="fas fa-image"></i>
                        <span>Upload Business Logo/Banner</span>
                        <small>Recommended: 1200x300px, max 5MB. Will be displayed on your profile and listings.</small>
                    </label>
                    <div class="banner-preview" id="bannerPreview" style="display: none;">
                        <img id="bannerPreviewImage" src="" alt="Banner Preview" style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 8px;">
                        <button type="button" onclick="removeBanner()" class="remove-banner" title="Remove banner">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="realtorRegEmail">Email Address *</label>
                    <input type="email" id="realtorRegEmail" name="email" required>
                </div>
                <div class="form-group">
                    <label for="realtorPhone">Phone Number *</label>
                    <input type="tel" id="realtorPhone" name="phone" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="realtorAddress">Business Address *</label>
                <textarea id="realtorAddress" name="address" rows="2" required placeholder="Complete business address"></textarea>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="realtorRegPassword">Create Password *</label>
                    <input type="password" id="realtorRegPassword" name="password" required minlength="8">
                </div>
                <div class="form-group">
                    <label for="realtorConfirmPassword">Confirm Password *</label>
                    <input type="password" id="realtorConfirmPassword" name="confirmPassword" required minlength="8">
                </div>
            </div>
            
            <div class="form-group">
                <label for="experienceYears">Years of Experience *</label>
                <select id="experienceYears" name="experience" required>
                    <option value="">Select Experience</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Property Types You Manage *</label>
                <div class="checkbox-grid">
                    <label class="checkbox-item">
                        <input type="checkbox" name="propertyTypes" value="hostels">
                        <span>Student Hostels</span>
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="propertyTypes" value="apartments">
                        <span>Apartments</span>
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="propertyTypes" value="rooms">
                        <span>Single Rooms</span>
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="propertyTypes" value="houses">
                        <span>Houses</span>
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label for="businessLicense">Business Registration Number</label>
                <input type="text" id="businessLicense" name="businessLicense" placeholder="RC Number or Business Registration">
            </div>
            
            <div class="form-group checkbox-group">
                <label class="checkbox-label">
                    <input type="checkbox" name="agreeTerms" required>
                    <span class="checkmark"></span>
                    I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Realtor Guidelines</a>
                </label>
            </div>
            
            <div class="form-group checkbox-group">
                <label class="checkbox-label">
                    <input type="checkbox" name="verifyInfo" required>
                    <span class="checkmark"></span>
                    I confirm that all information provided is accurate and I have the right to list the properties
                </label>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-user-plus"></i> Submit Registration
                </button>
            </div>
        </form>
        
        <div class="registration-note">
            <p><strong>Note:</strong> All realtor accounts are subject to verification. You will receive login credentials via email once approved.</p>
        </div>
    `);
    
    // Handle registration form submission
    setTimeout(() => {
        const regForm = document.getElementById('realtorRegistrationForm');
        if (regForm) {
            regForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleRealtorRegistration(this);
            });
            
            // Add banner upload handler
            const bannerInput = document.getElementById('businessBanner');
            if (bannerInput) {
                bannerInput.addEventListener('change', handleBannerUpload);
            }
        }
    }, 100);
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

// Handle Realtor Registration
function handleRealtorRegistration(form) {
    const formData = new FormData(form);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Validate at least one property type is selected
    const propertyTypes = formData.getAll('propertyTypes');
    if (propertyTypes.length === 0) {
        showNotification('Please select at least one property type you manage.', 'error');
        return;
    }
    
    // Simulate registration process
    showNotification('Processing registration...', 'info');
    
    setTimeout(() => {
        showNotification('Registration submitted successfully! You will receive login credentials via email once your account is verified.', 'success');
        closeModal();
        
        // Clear form
        form.reset();
    }, 2000);
    
    console.log('📝 Realtor registration submitted:', {
        fullName: formData.get('fullName'),
        businessName: formData.get('businessName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        experience: formData.get('experience'),
        propertyTypes: propertyTypes,
        businessLicense: formData.get('businessLicense')
    });
}

// Banner handling functions
function handleBannerUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('bannerPreview');
            const img = document.getElementById('bannerPreviewImage');
            
            img.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function removeBanner() {
    const input = document.getElementById('businessBanner');
    const preview = document.getElementById('bannerPreview');
    
    input.value = '';
    preview.style.display = 'none';
}

// Share listing functionality
function shareListingLink(listingId) {
    const baseUrl = window.location.origin + window.location.pathname.replace('realtor-login.html', '');
    const shareUrl = `${baseUrl}demo.html#listing-${listingId}`;
    
    // Create share modal
    showModal('Share Listing', `
        <div class="share-options">
            <h3>Share this listing</h3>
            <div class="share-url-container">
                <input type="text" id="shareUrl" value="${shareUrl}" readonly class="share-url-input">
                <button class="btn btn-primary" onclick="copyToClipboard('shareUrl')">
                    <i class="fas fa-copy"></i> Copy Link
                </button>
            </div>
            
            <div class="share-buttons">
                <button class="btn btn-social whatsapp" onclick="shareToWhatsApp('${shareUrl}')">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
                <button class="btn btn-social facebook" onclick="shareToFacebook('${shareUrl}')">
                    <i class="fab fa-facebook"></i> Facebook
                </button>
                <button class="btn btn-social twitter" onclick="shareToTwitter('${shareUrl}')">
                    <i class="fab fa-twitter"></i> Twitter
                </button>
                <button class="btn btn-social email" onclick="shareViaEmail('${shareUrl}')">
                    <i class="fas fa-envelope"></i> Email
                </button>
            </div>
        </div>
    `);
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    element.setSelectionRange(0, 99999);
    document.execCommand('copy');
    showNotification('Link copied to clipboard!', 'success');
}

function shareToWhatsApp(url) {
    const text = encodeURIComponent(`Check out this amazing hostel listing: ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareToFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function shareToTwitter(url) {
    const text = encodeURIComponent('Check out this amazing hostel listing!');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
}

function shareViaEmail(url) {
    const subject = encodeURIComponent('Hostel Listing from MWG Hostels');
    const body = encodeURIComponent(`Hi!\n\nI found this great hostel listing that might interest you:\n\n${url}\n\nBest regards`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Ensure all modals close properly
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.querySelectorAll('.custom-modal').forEach(modal => {
        modal.remove();
    });
}

// Add escape key functionality
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// Ensure proper cleanup on page unload
window.addEventListener('beforeunload', function() {
    closeAllModals();
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An unexpected error occurred. Please refresh the page if issues persist.', 'error');
});

// Ensure localStorage works
function testLocalStorage() {
    try {
        const test = 'localStorageTest';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.warn('localStorage not available:', e);
        return false;
    }
}

// Initialize storage check
if (!testLocalStorage()) {
    console.warn('Local storage not available - some features may not work properly');
}

console.log('✅ MWG Realtor Portal JavaScript loaded successfully');