// MWG Hostel Finder - Main JavaScript
console.log('🏠 MWG Hostel Finder - Initializing...');

// Global state
const state = {
    hostels: [],
    filteredHostels: [],
    currentFilter: 'all',
    isLoading: false,
    fabMenuOpen: false,
    registeredUsers: [],
    roommateRequests: []
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    console.log('🚀 Initializing MWG Hostel Finder...');
    
    // Initialize components
    initializeNavigation();
    initializeFAB();
    initializeRegistrationForm();
    initializeFilterTabs();
    loadHostels();
    updateLiveStats();
    
    console.log('✅ App initialized successfully');
}

// Navigation Functionality
function initializeNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    console.log('✅ Navigation initialized');
}

// Floating Action Button
function initializeFAB() {
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    
    if (fabMain && fabMenu) {
        fabMain.addEventListener('click', () => {
            state.fabMenuOpen = !state.fabMenuOpen;
            fabMain.classList.toggle('active');
            fabMenu.classList.toggle('active');
        });
        
        // Handle FAB options
        fabMenu.querySelectorAll('.fab-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                handleFABAction(action);
                
                // Close FAB menu
                state.fabMenuOpen = false;
                fabMain.classList.remove('active');
                fabMenu.classList.remove('active');
            });
        });
        
        // Close FAB menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!fabMain.contains(e.target) && !fabMenu.contains(e.target)) {
                state.fabMenuOpen = false;
                fabMain.classList.remove('active');
                fabMenu.classList.remove('active');
            }
        });
    }
    
    console.log('✅ FAB initialized');
}

// Handle FAB Actions
function handleFABAction(action) {
    console.log(`🎯 FAB action: ${action}`);
    
    switch (action) {
        case 'need-room':
            scrollToSection('register');
            showNotification('Register to find your perfect hostel!', 'info');
            break;
        case 'have-room':
            window.open('realtor-login.html', '_blank');
            break;
        default:
            console.warn('Unknown FAB action:', action);
    }
}

// Registration Form - Updated for Open Access
function initializeRegistrationForm() {
    // Student registration no longer required - platform has open access
    console.log('✅ Platform open access - no student registration needed');
    
    // Check if any realtor forms need initialization
    const realtorForm = document.getElementById('realtorRegistrationForm');
    if (realtorForm) {
        console.log('🏢 Initializing realtor registration form...');
        // Realtor registration still available
    }
}

// Handle Registration
function handleRegistration(form) {
    console.log('📝 Processing registration...');
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            matricNumber: formData.get('matricNumber'),
            department: formData.get('department'),
            yearOfStudy: formData.get('yearOfStudy'),
            gender: formData.get('gender'),
            preferredGate: formData.get('preferredGate'),
            accommodationPreference: formData.get('accommodationPreference'),
            profilePhoto: formData.get('profilePhoto'),
            priceRange: formData.get('priceRange'),
            specialRequests: formData.get('specialRequests'),
            agreeTerms: formData.get('agreeTerms'),
            allowNotifications: formData.get('allowNotifications')
        };
        
        console.log('📊 Registration data:', data);
        
        // Validation
        if (!validateRegistrationData(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Save registration status
            localStorage.setItem('userRegistered', 'true');
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userFullName', `${data.firstName} ${data.lastName}`);
            
            // Show success
            showSuccessModal(data);
            form.reset();
            const imagePreview = document.getElementById('imagePreview');
            if (imagePreview) {
                imagePreview.innerHTML = '';
            }
            
            // Close registration modal
            closeRegistrationModal();
            
            console.log('✅ Registration successful');
        }, 2000);
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    }
}

// Validate Registration Data - Updated for Open Access
function validateRegistrationData(data) {
    // Platform now has open access - minimal validation needed
    console.log('✅ Platform open access - minimal validation applied');
    return true;
}

// Filter Tabs
function initializeFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');
            setActiveFilter(filter);
            filterHostels(filter);
        });
    });
    
    console.log('✅ Filter tabs initialized');
}

// Set Active Filter
function setActiveFilter(filter) {
    state.currentFilter = filter;
    
    // Update tab active state
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
}

// Load Hostels from Realtor Listings
function loadHostels() {
    console.log('🏠 Loading hostels from realtor listings...');
    
    // Load hostels from localStorage (uploaded by realtors)
    // Check both 'realtorHostels' (new format) and 'realtorListings' (old format)
    const savedHostels = localStorage.getItem('realtorHostels');
    const savedListings = localStorage.getItem('realtorListings');
    let realtorHostels = [];
    
    // Try to load from new format first
    if (savedHostels) {
        try {
            const hostels = JSON.parse(savedHostels);
            console.log('📋 Found hostels in new format:', hostels.length);
            
            // Convert to display format
            realtorHostels = hostels.map(hostel => ({
                id: hostel.id,
                name: hostel.name,
                location: hostel.location,
                price: `₦${parseInt(hostel.price).toLocaleString()}`,
                period: `per ${hostel.pricePeriod || 'semester'}`,
                image: hostel.images && hostel.images.length > 0 ? hostel.images[0] : "https://images.unsplash.com/photo-1555854877-bab0e921b58d?auto=format&fit=crop&w=800&q=80",
                realtor: hostel.realtorInfo?.brandName || hostel.realtorInfo?.fullName || "Verified Realtor",
                realtorFullName: hostel.realtorInfo?.fullName || "Verified Realtor",
                realtorBrandName: hostel.realtorInfo?.brandName || "Verified Realtor",
                realtorContact: hostel.phone,
                whatsapp: hostel.whatsapp,
                rating: (4.5 + Math.random() * 0.5).toFixed(1), // Generate realistic ratings 4.5-5.0
                available: hostel.status !== 'allocated',
                verified: true,
                capacity: hostel.capacity,
                roomType: hostel.capacity == 1 ? "private" : "shared",
                description: hostel.description,
                amenities: hostel.amenities || [],
                address: hostel.address,
                views: hostel.views || 0,
                inquiries: hostel.inquiries || 0,
                images: hostel.images || [],
                dateAdded: hostel.dateAdded,
                lastUpdated: hostel.lastUpdated
            }));
        } catch (error) {
            console.error('Error parsing realtor hostels:', error);
            realtorHostels = [];
        }
    }
    // Fallback to old format if new format is empty
    else if (savedListings) {
        try {
            const allListings = JSON.parse(savedListings);
            console.log('📋 Found hostels in old format:', allListings.length);
            
            // Convert realtor listings to hostel format
            realtorHostels = allListings.map(listing => ({
                id: listing.id,
                name: listing.name,
                location: listing.location,
                price: `₦${listing.price.toLocaleString()}`,
                period: "per session",
                image: listing.images && listing.images.length > 0 ? listing.images[0] : "https://images.unsplash.com/photo-1555854877-bab0e921b58d?auto=format&fit=crop&w=800&q=80",
                realtor: listing.realtorInfo?.brandName || listing.realtorInfo?.fullName || listing.realtorInfo?.name || "Verified Realtor",
                realtorFullName: listing.realtorInfo?.fullName || listing.realtorInfo?.name || "Verified Realtor",
                realtorBrandName: listing.realtorInfo?.brandName || listing.realtorInfo?.name || "Verified Realtor",
                realtorContact: listing.phone,
                whatsapp: listing.whatsapp,
                rating: (4.5 + Math.random() * 0.5).toFixed(1),
                available: listing.status === 'active',
                verified: true,
                capacity: listing.capacity,
                roomType: listing.capacity === 1 ? "private" : "shared",
                description: listing.description,
                amenities: listing.amenities || [],
                address: listing.address,
                views: listing.views || 0,
                inquiries: listing.inquiries || 0,
                images: listing.images || [],
                bannerUrl: listing.realtorInfo?.bannerUrl
            }));
        } catch (error) {
            console.error('Error parsing realtor listings:', error);
            realtorHostels = [];
        }
    }
    
    // If no realtor hostels available, show empty state
    if (realtorHostels.length === 0) {
        console.log('📭 No realtor hostels found - showing empty state');
    } else {
        console.log(`✅ Loaded ${realtorHostels.length} realtor hostels`);
    }
    
    state.hostels = realtorHostels;
    state.filteredHostels = realtorHostels;
    renderHostels(realtorHostels);
    updateLiveStats();
}

// Update Live Statistics
function updateLiveStats() {
    const totalHostels = state.hostels.length;
    
    // Update hero stats
    const heroCountElement = document.getElementById('totalHostelsCount');
    if (heroCountElement) {
        heroCountElement.textContent = totalHostels;
    }
    
    // Update CTA stats
    const ctaCountElement = document.getElementById('ctaHostelsCount');
    if (ctaCountElement) {
        ctaCountElement.textContent = totalHostels + '+';
    }
    
    // Update location counts in campus cards
    const locations = ['north', 'south', 'west'];
    locations.forEach(location => {
        const count = state.hostels.filter(h => h.location === location).length;
        const cardElement = document.querySelector(`[data-location="${location}"] .campus-stats span:first-child`);
        if (cardElement) {
            cardElement.innerHTML = `<i class="fas fa-home"></i> ${count} Available`;
        }
    });
    
    console.log(`📊 Updated stats: ${totalHostels} total hostels`);
}

// Render Hostels
function renderHostels(hostels) {
    const grid = document.getElementById('hostelsGrid');
    
    if (!grid) return;
    
    if (hostels.length === 0) {
        grid.innerHTML = `
            <div class="no-hostels">
                <i class="fas fa-home" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                <h3>No hostels available yet</h3>
                <p>Our verified realtors are working to bring you the best accommodation options. Check back soon!</p>
                <div style="margin-top: 2rem;">
                    <a href="realtor-login.html" class="btn btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-building"></i>
                        Are you a realtor? List your hostels here
                    </a>
                </div>
                <div style="margin-top: 1rem;">
                    <button class="btn btn-outline" onclick="location.reload()">
                        <i class="fas fa-refresh"></i>
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    // Use enhanced hostel cards with uniform sizing
    grid.innerHTML = hostels.map(hostel => generateEnhancedHostelCard(hostel)).join('');
    
    // Update gate counts after rendering
    updateGateCounts();
}

// Update gate availability counts
function updateGateCounts() {
    const northCount = state.hostels.filter(h => 
        h.location && h.location.toLowerCase().includes('north') && h.available !== false
    ).length;
    const southCount = state.hostels.filter(h => 
        h.location && h.location.toLowerCase().includes('south') && h.available !== false
    ).length;
    const westCount = state.hostels.filter(h => 
        h.location && h.location.toLowerCase().includes('west') && h.available !== false
    ).length;
    
    const northElement = document.getElementById('northGateCount');
    const southElement = document.getElementById('southGateCount');
    const westElement = document.getElementById('westGateCount');
    
    if (northElement) northElement.textContent = northCount;
    if (southElement) southElement.textContent = southCount;
    if (westElement) westElement.textContent = westCount;
}

// Filter Hostels
function filterHostels(location) {
    console.log(`🔍 Filtering hostels by: ${location}`);
    
    if (location === 'all') {
        state.filteredHostels = state.hostels;
    } else {
        state.filteredHostels = state.hostels.filter(hostel => hostel.location === location);
    }
    
    renderHostels(state.filteredHostels);
}

// Filter Hostels by Location (called from location cards)
function filterHostelsByLocation(location) {
    console.log(`📍 Location card clicked: ${location}`);
    
    // Update filter tab
    setActiveFilter(location);
    
    // Filter and render
    filterHostels(location);
    
    // Scroll to hostels section
    scrollToSection('hostels');
    
    // Show notification
    const count = state.hostels.filter(h => h.location === location).length;
    showNotification(`Found ${count} hostels in ${location.charAt(0).toUpperCase() + location.slice(1)}`, 'success');
}

// Hostel Actions
function viewHostelDetails(hostelId) {
    const hostel = state.hostels.find(h => h.id === hostelId);
    if (!hostel) return;
    
    console.log(`👁️ Viewing details for: ${hostel.name}`);
    
    showModal('Hostel Details', `
        <div class="hostel-details">
            <div class="hostel-images-gallery">
                ${hostel.images && hostel.images.length > 1 ? 
                    `<div class="images-carousel">
                        ${hostel.images.map((img, index) => 
                            `<img src="${img}" alt="${hostel.name} ${index + 1}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 0.5rem; ${index > 0 ? 'display: none;' : ''}" class="carousel-image">`
                        ).join('')}
                        ${hostel.images.length > 1 ? `
                            <div class="carousel-controls" style="text-align: center; margin-top: 1rem;">
                                <button onclick="previousImage()" class="btn btn-outline">← Previous</button>
                                <span style="margin: 0 1rem;">1 of ${hostel.images.length}</span>
                                <button onclick="nextImage()" class="btn btn-outline">Next →</button>
                            </div>
                        ` : ''}
                    </div>` : 
                    `<img src="${hostel.image}" alt="${hostel.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">`
                }
            </div>
            
            <h3>${hostel.name}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${hostel.location.charAt(0).toUpperCase() + hostel.location.slice(1)} Gate</p>
            <p><strong>Address:</strong> ${hostel.address || 'Contact realtor for exact address'}</p>
            <p><strong>Price:</strong> ${hostel.price} ${hostel.period}</p>
            <p><strong>Capacity:</strong> ${hostel.capacity} student${hostel.capacity > 1 ? 's' : ''} per room</p>
            <p><strong>Room Type:</strong> ${hostel.roomType.charAt(0).toUpperCase() + hostel.roomType.slice(1)}</p>
            <p><strong>Rating:</strong> <i class="fas fa-star" style="color: gold;"></i> ${hostel.rating}/5</p>
            
            ${hostel.amenities && hostel.amenities.length > 0 ? `
                <div style="margin: 1rem 0;">
                    <strong>Amenities:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                        ${hostel.amenities.map(amenity => 
                            `<span style="background: var(--light-blue); color: var(--primary-blue); padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.8rem;">${amenity}</span>`
                        ).join('')}
                    </div>
                </div>
            ` : ''}
            
            <p><strong>Description:</strong> ${hostel.description}</p>
            
            <div style="background: var(--gray-50); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h4 style="margin: 0 0 0.5rem 0;">Managed by:</h4>
                <div><strong>${hostel.realtorBrandName || hostel.realtor}</strong></div>
                ${hostel.realtorFullName && hostel.realtorFullName !== hostel.realtorBrandName ? 
                    `<div style="color: var(--gray-600); font-size: 0.9rem;">by ${hostel.realtorFullName}</div>` : ''
                }
                ${hostel.bannerUrl ? `
                    <img src="${hostel.bannerUrl}" alt="Realtor Banner" style="width: 100%; height: 60px; object-fit: cover; border-radius: 8px; margin-top: 0.5rem;">
                ` : ''}
            </div>
            
            <div style="background: var(--light-blue); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--primary-blue);">Property Stats:</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 1rem; text-align: center;">
                    <div>
                        <div style="font-weight: bold; color: var(--primary-blue);">${hostel.views}</div>
                        <div style="font-size: 0.8rem; color: var(--gray-600);">Views</div>
                    </div>
                    <div>
                        <div style="font-weight: bold; color: var(--primary-blue);">${hostel.inquiries}</div>
                        <div style="font-size: 0.8rem; color: var(--gray-600);">Inquiries</div>
                    </div>
                    <div>
                        <div style="font-weight: bold; color: var(--primary-blue);">${hostel.rating}</div>
                        <div style="font-size: 0.8rem; color: var(--gray-600);">Rating</div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 1rem;">
                <button class="btn btn-primary" onclick="contactRealtor('${hostel.id}'); closeModal();">
                    <i class="fas fa-phone"></i> Contact Realtor
                </button>
            </div>
        </div>
    `);
    
    // Add image carousel functionality
    window.currentImageIndex = 0;
    window.totalImages = hostel.images ? hostel.images.length : 1;
    
    window.nextImage = function() {
        if (window.totalImages <= 1) return;
        const images = document.querySelectorAll('.carousel-image');
        images[window.currentImageIndex].style.display = 'none';
        window.currentImageIndex = (window.currentImageIndex + 1) % window.totalImages;
        images[window.currentImageIndex].style.display = 'block';
        updateCarouselCounter();
    };
    
    window.previousImage = function() {
        if (window.totalImages <= 1) return;
        const images = document.querySelectorAll('.carousel-image');
        images[window.currentImageIndex].style.display = 'none';
        window.currentImageIndex = window.currentImageIndex === 0 ? window.totalImages - 1 : window.currentImageIndex - 1;
        images[window.currentImageIndex].style.display = 'block';
        updateCarouselCounter();
    };
    
    window.updateCarouselCounter = function() {
        const counter = document.querySelector('.carousel-controls span');
        if (counter) {
            counter.textContent = `${window.currentImageIndex + 1} of ${window.totalImages}`;
        }
    };
}

function contactRealtor(hostelId) {
    console.log('🔍 contactRealtor called with ID:', hostelId);
    console.log('🔍 Current state.hostels:', state.hostels?.length || 0, 'hostels');
    
    const hostel = state.hostels.find(h => h.id === hostelId);
    if (!hostel) {
        console.error('❌ Hostel not found for ID:', hostelId);
        console.log('Available hostel IDs:', state.hostels.map(h => h.id));
        showNotification('Hostel not found. Please try again.', 'error');
        return;
    }
    
    console.log(`📞 Showing inquiry form for: ${hostel.name}`);
    
    // Show inquiry form instead of direct contact
    showModal('Contact Realtor', `
        <div class="inquiry-form">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <h3>${hostel.name}</h3>
                <p style="color: var(--gray-600);">Managed by ${hostel.realtorBrandName || hostel.realtor}</p>
                <p style="color: var(--primary-blue); font-weight: 600;">₦${hostel.price} per ${hostel.period}</p>
            </div>
            
            <form id="inquiryForm" onsubmit="submitInquiry(event, '${hostelId}')">
                <div style="display: grid; gap: 1rem;">
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Your Name *</label>
                        <input type="text" name="studentName" required 
                               style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px;" 
                               placeholder="Enter your full name">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Phone Number *</label>
                        <input type="tel" name="studentPhone" required 
                               style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px;" 
                               placeholder="e.g., 08012345678">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Email Address *</label>
                        <input type="email" name="studentEmail" required 
                               style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px;" 
                               placeholder="your.email@example.com">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Course/Department</label>
                        <input type="text" name="studentCourse" 
                               style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px;" 
                               placeholder="e.g., Computer Science, Mechanical Engineering">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Level</label>
                        <select name="studentLevel" 
                                style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px;">
                            <option value="">Select your level</option>
                            <option value="100L">100 Level</option>
                            <option value="200L">200 Level</option>
                            <option value="300L">300 Level</option>
                            <option value="400L">400 Level</option>
                            <option value="500L">500 Level</option>
                            <option value="Graduate">Graduate Student</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Message/Questions</label>
                        <textarea name="inquiryMessage" rows="4" 
                                  style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; resize: vertical;" 
                                  placeholder="Ask about availability, facilities, payment terms, or any other questions..."></textarea>
                    </div>
                </div>
                
                <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                    <button type="button" onclick="closeModal()" 
                            style="flex: 1; padding: 0.75rem; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;">
                        Cancel
                    </button>
                    <button type="submit" 
                            style="flex: 2; padding: 0.75rem; background: var(--primary-blue); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-paper-plane"></i> Send Inquiry
                    </button>
                </div>
            </form>
            
            <div style="text-align: center; margin-top: 1rem; padding: 1rem; background: var(--light-blue); border-radius: 8px;">
                <p style="margin: 0; font-size: 0.9rem; color: var(--primary-blue);">
                    <i class="fas fa-shield-check"></i> 
                    Your information will be shared with the realtor for this inquiry only
                </p>
            </div>
        </div>
    `);
}

// Function to handle inquiry form submission
function submitInquiry(event, hostelId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const hostel = state.hostels.find(h => h.id === hostelId);
    
    const inquiryData = {
        id: 'inquiry_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        hostelId: hostelId,
        hostelName: hostel?.name,
        realtorContact: hostel?.realtorContact,
        realtorWhatsApp: hostel?.whatsapp,
        studentName: formData.get('studentName'),
        studentPhone: formData.get('studentPhone'),
        studentEmail: formData.get('studentEmail'),
        studentCourse: formData.get('studentCourse'),
        studentLevel: formData.get('studentLevel'),
        inquiryMessage: formData.get('inquiryMessage'),
        timestamp: new Date().toISOString(),
        status: 'new'
    };
    
    // Save inquiry to localStorage
    try {
        const existingInquiries = JSON.parse(localStorage.getItem('studentInquiries') || '[]');
        existingInquiries.push(inquiryData);
        localStorage.setItem('studentInquiries', JSON.stringify(existingInquiries));
        
        console.log('✅ Inquiry saved:', inquiryData);
        
        // Show success message with contact details
        const phoneNumber = hostel?.realtorContact || '+234 806 992 8533';
        const whatsappNumber = hostel?.whatsapp || phoneNumber;
        const defaultMessage = `Hi! I just submitted an inquiry for "${hostel?.name}" through MWG Hostels. My name is ${inquiryData.studentName}. ${inquiryData.inquiryMessage || 'I\'m interested in learning more about this accommodation.'}`;
        
        closeModal();
        
        showModal('Inquiry Submitted Successfully! 🎉', `
            <div style="text-align: center;">
                <div style="color: #10b981; font-size: 3rem; margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i>
                </div>
                
                <h3 style="color: #10b981; margin-bottom: 1rem;">Thank you, ${inquiryData.studentName}!</h3>
                
                <p style="margin-bottom: 1.5rem; color: var(--gray-600);">
                    Your inquiry for <strong>${hostel?.name}</strong> has been submitted successfully.
                </p>
                
                <div style="background: var(--light-blue); padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
                    <h4 style="margin-bottom: 1rem; color: var(--primary-blue);">Contact the Realtor Directly:</h4>
                    
                    <div style="display: grid; gap: 1rem;">
                        <button onclick="window.open('tel:${phoneNumber}', '_self'); closeModal();" 
                                style="width: 100%; padding: 0.75rem; background: white; border: 2px solid var(--primary-blue); color: var(--primary-blue); border-radius: 6px; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-phone"></i> Call: ${phoneNumber}
                        </button>
                        
                        <button onclick="window.open('https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMessage)}', '_blank'); closeModal();" 
                                style="width: 100%; padding: 0.75rem; background: #25D366; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            <i class="fab fa-whatsapp"></i> WhatsApp: ${whatsappNumber}
                        </button>
                    </div>
                </div>
                
                <div style="background: #fef3c7; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                    <p style="margin: 0; font-size: 0.9rem; color: #92400e;">
                        <i class="fas fa-lightbulb"></i> 
                        <strong>Tip:</strong> For faster response, contact the realtor directly via WhatsApp or phone.
                    </p>
                </div>
                
                <button onclick="closeModal()" 
                        style="width: 100%; padding: 0.75rem; background: var(--primary-blue); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 1rem;">
                    Continue Browsing
                </button>
            </div>
        `);
        
        // Update hostel inquiry count
        if (hostel) {
            hostel.inquiries = (hostel.inquiries || 0) + 1;
            // Update localStorage if hostels are stored there
            const storedHostels = localStorage.getItem('realtorHostels');
            if (storedHostels) {
                const hostels = JSON.parse(storedHostels);
                const hostelIndex = hostels.findIndex(h => h.id === hostelId);
                if (hostelIndex !== -1) {
                    hostels[hostelIndex].inquiries = hostel.inquiries;
                    localStorage.setItem('realtorHostels', JSON.stringify(hostels));
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Error saving inquiry:', error);
        showNotification('Error submitting inquiry. Please try contacting the realtor directly.', 'error');
    }
}

// Make contactRealtor globally accessible
window.contactRealtor = contactRealtor;

// Debug function for testing
function testContactButton() {
    console.log('🧪 Test contact button clicked');
    alert('Contact button is working! contactRealtor function is accessible.');
}
window.testContactButton = testContactButton;

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

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

function showSuccessModal(data) {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        
        // Update modal content with user data
        const modalContent = modal.querySelector('.modal-content');
        modalContent.querySelector('h3').textContent = `Welcome ${data.firstName} ${data.lastName}!`;
        modalContent.querySelector('p').innerHTML = `
            Your account has been created successfully.<br>
            <small style="color: var(--gray-600);">
                Department: ${data.department}<br>
                Preferred Gate: ${data.preferredGate.charAt(0).toUpperCase() + data.preferredGate.slice(1)} Gate<br>
                Level: ${data.yearOfStudy}<br>
                Accommodation: ${data.accommodationPreference}
            </small>
        `;
    }
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

function closeModal(modalId = null) {
    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    } else {
        // Close custom modals
        document.querySelectorAll('.custom-modal').forEach(m => m.remove());
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .hostel-card {
        background: var(--white);
        border-radius: var(--radius-xl);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: all var(--transition-base);
        border: 2px solid transparent;
    }
    
    .hostel-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-xl);
        border-color: var(--primary-blue);
    }
    
    .hostel-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }
    
    .hostel-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-base);
    }
    
    .hostel-card:hover .hostel-image img {
        transform: scale(1.05);
    }
    
    .hostel-badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: var(--primary-blue);
        color: var(--white);
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-full);
        font-size: var(--font-size-xs);
        font-weight: 600;
    }
    
    .hostel-status {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-full);
        font-size: var(--font-size-xs);
        font-weight: 600;
    }
    
    .hostel-status.available {
        background: #10b981;
        color: var(--white);
    }
    
    .hostel-status.unavailable {
        background: #ef4444;
        color: var(--white);
    }
    
    .hostel-content {
        padding: var(--space-lg);
    }
    
    .hostel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-md);
    }
    
    .hostel-header h3 {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--gray-900);
        margin: 0;
    }
    
    .hostel-rating {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: #fbbf24;
        font-weight: 600;
    }
    
    .hostel-location {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--gray-600);
        margin-bottom: var(--space-md);
    }
    
    .hostel-price {
        margin-bottom: var(--space-md);
    }
    
    .hostel-price .price {
        font-size: var(--font-size-xl);
        font-weight: 700;
        color: var(--primary-blue);
    }
    
    .hostel-price .period {
        color: var(--gray-600);
        font-size: var(--font-size-sm);
    }
    
    .hostel-features {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: var(--space-md);
    }
    
    .feature-tag {
        background: var(--light-blue);
        color: var(--primary-blue);
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-full);
        font-size: var(--font-size-xs);
        font-weight: 500;
    }
    
    .hostel-realtor {
        margin-bottom: var(--space-lg);
        padding-bottom: var(--space-md);
        border-bottom: 1px solid var(--gray-200);
    }
    
    .realtor-info {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        color: var(--gray-600);
        font-size: var(--font-size-sm);
    }
    
    .realtor-details {
        flex: 1;
    }
    
    .realtor-brand {
        font-weight: 600;
        color: var(--primary-blue);
        margin-bottom: 0.25rem;
    }
    
    .realtor-name {
        font-size: 0.8rem;
        color: var(--gray-500);
        font-style: italic;
    }
    
    .realtor-banner {
        margin-top: 0.5rem;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .hostel-actions {
        display: flex;
        gap: var(--space-md);
    }
    
    .hostel-actions .btn {
        flex: 1;
        justify-content: center;
        padding: var(--space-sm) var(--space-md);
        font-size: var(--font-size-sm);
    }
    
    .no-hostels {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--space-3xl);
        color: var(--gray-500);
    }
    
    .no-hostels h3 {
        margin-bottom: var(--space-md);
        color: var(--gray-700);
    }
`;
document.head.appendChild(style);

// ===========================================
// ENHANCED IMAGE VIEWING & UNIFORM SIZING
// ===========================================

// Gate Image Full-Size Modal
function showGateFullSize(imageSrc, gateTitle) {
    const modal = document.createElement('div');
    modal.className = 'gate-modal active';
    modal.innerHTML = `
        <div class="gate-modal-content">
            <button class="gate-modal-close" onclick="closeGateModal(this)">
                <i class="fas fa-times"></i>
            </button>
            <img src="${imageSrc}" alt="${gateTitle}" loading="lazy">
            <div style="padding: 1rem; text-align: center; background: white;">
                <h3 style="margin: 0; color: var(--primary-blue);">${gateTitle}</h3>
                <p style="margin: 0.5rem 0 0 0; color: var(--gray-600);">FUTA Campus Gate - Real Photo</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeGateModal(modal.querySelector('.gate-modal-close'));
        }
    });
}

function closeGateModal(closeBtn) {
    const modal = closeBtn.closest('.gate-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Enhanced Hostel Card with Uniform Image Sizing
function generateEnhancedHostelCard(hostel) {
    const imageUrl = hostel.images && hostel.images.length > 0 
        ? hostel.images[0] 
        : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
    
    return `
        <div class="hostel-card enhanced" data-id="${hostel.id}">
            <div class="hostel-image-container">
                <img src="${imageUrl}" 
                     alt="${hostel.name}" 
                     loading="lazy" 
                     onclick="showHostelImageFullSize('${imageUrl}', '${hostel.name}')"
                     onerror="this.src='https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'">
                <div class="availability-badge ${hostel.available !== false ? 'available' : 'not-available'}">
                    <i class="fas ${hostel.available !== false ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${hostel.available !== false ? 'Available' : 'Not Available'}
                </div>
                <div class="image-count-badge" onclick="showHostelGallery('${hostel.id}')">
                    <i class="fas fa-images"></i>
                    ${hostel.images ? hostel.images.length : 1}
                </div>
            </div>
            
            <div class="hostel-content">
                <div class="hostel-header">
                    <h3>${hostel.name}</h3>
                    <div class="price-range">
                        <span class="price">₦${typeof hostel.price === 'object' ? `${hostel.price.min?.toLocaleString() || '50,000'} - ₦${hostel.price.max?.toLocaleString() || '150,000'}` : (hostel.price?.toLocaleString() || '80,000')}</span>
                        <span class="period">/semester</span>
                    </div>
                </div>
                
                <div class="hostel-meta">
                    <span class="location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${hostel.location || 'FUTA Campus Area'}
                    </span>
                    <span class="realtor">
                        <i class="fas fa-user-tie"></i>
                        ${hostel.realtorBrandName || hostel.realtor || 'Verified Realtor'}
                    </span>
                </div>
                
                <div class="amenities-preview">
                    ${(hostel.amenities || ['WiFi', 'Security', 'Water']).slice(0, 3).map(amenity => 
                        `<span class="amenity-tag"><i class="fas fa-check"></i> ${amenity}</span>`
                    ).join('')}
                    ${(hostel.amenities || []).length > 3 ? `<span class="more-amenities">+${(hostel.amenities || []).length - 3} more</span>` : ''}
                </div>
                
                <div class="rating-section">
                    <div class="rating-stars">
                        ${Array.from({length: 5}, (_, i) => 
                            `<i class="fas fa-star ${i < Math.floor(hostel.rating || 4.2) ? 'filled' : ''}"></i>`
                        ).join('')}
                        <span class="rating-value">${hostel.rating || '4.2'}</span>
                    </div>
                    <span class="review-count">(${hostel.reviewCount || Math.floor(Math.random() * 50) + 10} reviews)</span>
                </div>
                
                <div class="hostel-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewHostelDetails('${hostel.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-success btn-sm" data-action="apply-hostel" data-hostel-id="${hostel.id}">
                        <i class="fas fa-paper-plane"></i> Apply Now
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="try { console.log('Button clicked for hostel:', '${hostel.id}'); contactRealtor('${hostel.id}'); } catch(e) { console.error('Contact error:', e); alert('Error: ' + e.message); }">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="alert('Test button clicked! Hostel ID: ${hostel.id}. Contact function exists: ' + (typeof contactRealtor !== 'undefined'))">
                        <i class="fas fa-bug"></i> Test
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Hostel Image Full-Size Modal
function showHostelImageFullSize(imageSrc, hostelName) {
    const modal = document.createElement('div');
    modal.className = 'gate-modal active';
    modal.innerHTML = `
        <div class="gate-modal-content">
            <button class="gate-modal-close" onclick="closeGateModal(this)">
                <i class="fas fa-times"></i>
            </button>
            <img src="${imageSrc}" alt="${hostelName}" loading="lazy">
            <div style="padding: 1rem; text-align: center; background: white;">
                <h3 style="margin: 0; color: var(--primary-blue);">${hostelName}</h3>
                <p style="margin: 0.5rem 0 0 0; color: var(--gray-600);">Hostel Image - Click for gallery</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeGateModal(modal.querySelector('.gate-modal-close'));
        }
    });
}

// Hostel Image Gallery
function showHostelGallery(hostelId) {
    const hostel = state.hostels.find(h => h.id === hostelId);
    if (!hostel) return;
    
    const images = hostel.images || ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'];
    
    showModal('Hostel Gallery', `
        <div class="hostel-gallery">
            <div class="gallery-header">
                <h3>${hostel.name}</h3>
                <p>${images.length} image${images.length > 1 ? 's' : ''}</p>
            </div>
            <div class="gallery-grid">
                ${images.map((img, index) => `
                    <div class="gallery-item" onclick="showHostelImageFullSize('${img}', '${hostel.name} - Image ${index + 1}')">
                        <img src="${img}" alt="${hostel.name} - Image ${index + 1}" loading="lazy">
                        <div class="gallery-overlay">
                            <i class="fas fa-expand"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `);
}

// ===========================================
// MANDATORY REGISTRATION SYSTEM
// ===========================================

// Removed old checkLoginAndContact function - no login required for contacting realtors

function checkLoginAndApply(hostelId) {
    const userRegistered = localStorage.getItem('userRegistered');
    const userData = localStorage.getItem('userData');
    if (!userRegistered || userRegistered !== 'true') {
        showRegistrationRequiredModal('apply for this hostel');
        return;
    }
    // Call the student application system
    if (typeof studentApplicationSystem !== 'undefined' && studentApplicationSystem.showApplicationForm) {
        studentApplicationSystem.showApplicationForm(hostelId);
    } else {
        showNotification('Application system is loading. Please try again in a moment.', 'info');
    }
}

function checkLoginAndAddRoommate() {
    const userRegistered = localStorage.getItem('userRegistered');
    const userData = localStorage.getItem('userData');
    if (!userRegistered || userRegistered !== 'true') {
        showRegistrationRequiredModal('add a roommate request');
        return;
    }
    showRoommateModal();
}

function showRegistrationRequiredModal(action) {
    showModal('Registration Required', `
        <div class="registration-required">
            <div style="text-align: center; margin-bottom: 2rem;">
                <i class="fas fa-user-lock" style="font-size: 3rem; color: var(--primary-blue); margin-bottom: 1rem;"></i>
                <h3>Registration Required</h3>
                <p style="margin: 1rem 0; color: var(--gray-600);">
                    You need to register or login to ${action}. This helps us protect users and maintain platform security.
                </p>
            </div>
            
            <div class="auth-benefits">
                <h4 style="margin-bottom: 1rem; color: var(--gray-700);">Why register?</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="padding: 0.5rem 0; color: var(--gray-600);">
                        <i class="fas fa-shield-check" style="color: var(--primary-blue); margin-right: 0.5rem;"></i>
                        Secure communication with verified realtors
                    </li>
                    <li style="padding: 0.5rem 0; color: var(--gray-600);">
                        <i class="fas fa-star" style="color: var(--primary-blue); margin-right: 0.5rem;"></i>
                        Save favorites and track applications
                    </li>
                    <li style="padding: 0.5rem 0; color: var(--gray-600);">
                        <i class="fas fa-users" style="color: var(--primary-blue); margin-right: 0.5rem;"></i>
                        Connect with potential roommates
                    </li>
                    <li style="padding: 0.5rem 0; color: var(--gray-600);">
                        <i class="fas fa-bell" style="color: var(--primary-blue); margin-right: 0.5rem;"></i>
                        Get notified about new listings
                    </li>
                </ul>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 2rem;">
                <button class="btn btn-outline" onclick="closeModal(); showLoginModal();">
                    <i class="fas fa-sign-in-alt"></i> Login (Optional)
                </button>
                <button class="btn btn-primary" onclick="closeModal(); showNotification('Browse all hostels freely!', 'success');">
                    <i class="fas fa-eye"></i> Continue Browsing
                </button>
            </div>
        </div>
    `);
}

// ===========================================
// REALTOR AVAILABILITY TOGGLE SYSTEM
// ===========================================

// Open Access Functions - No registration required
function showRegistrationModal() {
    console.log('🎯 Platform open access - no registration needed');
    // Show notification that registration is not required
    showNotification('No registration required! Browse all hostels freely.', 'success');
}

function closeRegistrationModal() {
    console.log('✅ Platform open access active');
    // No action needed since no modal to close
}

// Hostel Modal Functions
function closeHostelModal() {
    console.log('🔒 Closing hostel modal...');
    const modal = document.getElementById('hostelModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Gate Hostel Functions
function showCampusHostels(location) {
    console.log(`🏫 Showing hostels for ${location} gate...`);
    
    // Update location filter
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.value = location;
    }
    
    // Apply filter
    filterHostels();
    
    // Scroll to hostels section
    const hostelsSection = document.querySelector('.hostels-section');
    if (hostelsSection) {
        hostelsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show notification
    showNotification(`Showing hostels near ${location.charAt(0).toUpperCase() + location.slice(1)} Gate`, 'info');
}

// Filter Functions
function clearFilters() {
    console.log('🧹 Clearing all filters...');
    
    // Reset all filter dropdowns
    const filters = ['locationFilter', 'priceFilter'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) filter.value = '';
    });
    
    // Reset and reload hostels
    state.filteredHostels = [...state.hostels];
    renderHostels(state.filteredHostels);
    
    showNotification('Filters cleared!', 'success');
}

function loadMoreHostels() {
    console.log('📦 Checking for more hostels...');
    
    // In the real system, this would fetch more hostels from the API
    // For now, we just reload the current listings
    loadHostels();
    
    if (state.hostels.length === 0) {
        showNotification('No additional hostels available. Encourage realtors to list more properties!', 'info');
    } else {
        showNotification(`Showing all ${state.hostels.length} available hostels from verified realtors.`, 'success');
    }
}

// Profile Photo Functions
function handleProfilePhotoUpload(event) {
    console.log('📷 Handling profile photo upload...');
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showNotification('Image size must be less than 2MB', 'error');
        return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoPreview = document.getElementById('photoPreview');
        const previewImage = document.getElementById('previewImage');
        const uploadContent = document.querySelector('.file-upload-content');
        
        if (photoPreview && previewImage) {
            previewImage.src = e.target.result;
            photoPreview.style.display = 'block';
            if (uploadContent) uploadContent.style.display = 'none';
        }
    };
    reader.readAsDataURL(file);
    
    showNotification('Profile photo uploaded successfully!', 'success');
}

function removeProfilePhoto() {
    console.log('🗑️ Removing profile photo...');
    const photoPreview = document.getElementById('photoPreview');
    const uploadContent = document.querySelector('.file-upload-content');
    const fileInput = document.getElementById('profilePhoto');
    
    if (photoPreview) photoPreview.style.display = 'none';
    if (uploadContent) uploadContent.style.display = 'block';
    if (fileInput) fileInput.value = '';
    
    showNotification('Profile photo removed', 'info');
}

// Enhanced Filter Function
function filterHostels() {
    console.log('🔍 Applying filters...');
    
    const locationFilter = document.getElementById('locationFilter')?.value || '';
    const priceFilter = document.getElementById('priceFilter')?.value || '';
    
    let filtered = [...state.hostels];
    
    // Filter by location
    if (locationFilter) {
        filtered = filtered.filter(hostel => hostel.location === locationFilter);
    }
    
    // Filter by price
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(Number);
        filtered = filtered.filter(hostel => {
            const price = parseInt(hostel.price.replace(/[^\d]/g, ''));
            if (max) {
                return price >= min && price <= max;
            } else {
                return price >= min;
            }
        });
    }
    
    state.filteredHostels = filtered;
    renderHostels(filtered);
    
    console.log(`📊 Filtered to ${filtered.length} hostels`);
}

// Handle accommodation preference change
function handleAccommodationChange() {
    const accommodationType = document.getElementById('accommodationType')?.value;
    const roommatePreferencesGroup = document.getElementById('roommatePreferencesGroup');
    
    if (accommodationType === 'shared' && roommatePreferencesGroup) {
        roommatePreferencesGroup.classList.remove('hidden');
    } else if (roommatePreferencesGroup) {
        roommatePreferencesGroup.classList.add('hidden');
    }
}

// ROOMMATE FEATURE - NEW FUNCTIONALITY
function showRoommateModal() {
    console.log('👥 Opening roommate modal...');
    
    const modalHTML = `
        <div class="modal active" id="roommateModal">
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3><i class="fas fa-users"></i> Find Roommates</h3>
                    <button class="modal-close" onclick="closeRoommateModal()">&times;</button>
                </div>
                
                <div class="roommate-options">
                    <div class="roommate-option" onclick="showRoommateSearch()">
                        <i class="fas fa-search"></i>
                        <h4>Find a Roommate</h4>
                        <p>Search for students looking to share accommodation</p>
                    </div>
                    
                    <div class="roommate-option" onclick="showRoommatePost()">
                        <i class="fas fa-plus"></i>
                        <h4>I Have Space to Share</h4>
                        <p>Post your room details to find a roommate</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('roommateModal');
    if (existingModal) existingModal.remove();
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function closeRoommateModal() {
    const modal = document.getElementById('roommateModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function showRoommateSearch() {
    console.log('🔍 Showing roommate search...');
    closeRoommateModal();
    
    const modalHTML = `
        <div class="modal active" id="roommateSearchModal">
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3><i class="fas fa-search"></i> Find Roommates</h3>
                    <button class="modal-close" onclick="closeRoommateSearchModal()">&times;</button>
                </div>
                
                <div class="roommate-search-content">
                    <div class="search-filters">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Gate Location</label>
                                <select id="roommateLocationFilter">
                                    <option value="">All Locations</option>
                                    <option value="north">North Gate</option>
                                    <option value="south">South Gate</option>
                                    <option value="west">West Gate</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Budget Range</label>
                                <select id="roommateBudgetFilter">
                                    <option value="">Any Budget</option>
                                    <option value="0-30000">₦10,000 - ₦30,000</option>
                                    <option value="30000-60000">₦30,000 - ₦60,000</option>
                                    <option value="60000-100000">₦60,000 - ₦100,000</option>
                                </select>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="searchRoommates()">
                            <i class="fas fa-search"></i> Search Roommates
                        </button>
                    </div>
                    
                    <div class="roommate-results" id="roommateResults">
                        <!-- Results will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    loadRoommateRequests();
}

function closeRoommateSearchModal() {
    const modal = document.getElementById('roommateSearchModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function showRoommatePost() {
    console.log('📝 Showing roommate post form...');
    closeRoommateModal();
    
    const modalHTML = `
        <div class="modal active" id="roommatePostModal">
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3><i class="fas fa-plus"></i> Share Your Room</h3>
                    <button class="modal-close" onclick="closeRoommatePostModal()">&times;</button>
                </div>
                
                <form id="roommatePostForm" class="roommate-post-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="roomLocation">Room Location *</label>
                            <select id="roomLocation" name="location" required>
                                <option value="">Select Gate</option>
                                <option value="north">North Gate</option>
                                <option value="south">South Gate</option>
                                <option value="west">West Gate</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="roomPrice">Monthly Rent (Split) *</label>
                            <input type="number" id="roomPrice" name="price" required placeholder="25000" min="5000" max="100000">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="roomAddress">Room Address *</label>
                        <input type="text" id="roomAddress" name="address" required placeholder="e.g., Block 5, Room 12, Student Village">
                    </div>
                    
                    <div class="form-group">
                        <label for="roomDescription">Room Description *</label>
                        <textarea id="roomDescription" name="description" rows="4" required placeholder="Describe your room, amenities, and what kind of roommate you're looking for..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="roommatePreferences">Roommate Preferences</label>
                        <textarea id="roommatePreferences" name="preferences" rows="3" placeholder="e.g., Non-smoker, quiet, same department, etc."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="contactPhone">Contact Phone *</label>
                        <input type="tel" id="contactPhone" name="phone" required placeholder="+234 xxx xxx xxxx">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="closeRoommatePostModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Post Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize form
    const form = document.getElementById('roommatePostForm');
    if (form) {
        form.addEventListener('submit', handleRoommatePost);
    }
}

function closeRoommatePostModal() {
    const modal = document.getElementById('roommatePostModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function handleRoommatePost(event) {
    event.preventDefault();
    console.log('📤 Posting roommate request...');
    
    const form = event.target;
    const formData = new FormData(form);
    
    const roommateData = {
        id: Date.now(),
        location: formData.get('location'),
        price: parseInt(formData.get('price')),
        address: formData.get('address'),
        description: formData.get('description'),
        preferences: formData.get('preferences'),
        phone: formData.get('phone'),
        postedDate: new Date().toISOString(),
        poster: 'Current User' // In real app, get from logged in user
    };
    
    // Add to state
    if (!state.roommateRequests) state.roommateRequests = [];
    state.roommateRequests.push(roommateData);
    
    // Save to localStorage
    localStorage.setItem('roommateRequests', JSON.stringify(state.roommateRequests));
    
    closeRoommatePostModal();
    showNotification('Room shared successfully! Other students can now find you.', 'success');
}

function loadRoommateRequests() {
    console.log('📋 Loading roommate requests...');
    
    // Load from localStorage
    const saved = localStorage.getItem('roommateRequests');
    if (saved) {
        state.roommateRequests = JSON.parse(saved);
    } else {
        // Demo data
        state.roommateRequests = [
            {
                id: 1,
                location: 'main',
                price: 25000,
                address: 'Block 3, Room 8, Campus Lodge',
                description: 'Spacious room with AC, WiFi, and private bathroom. Looking for a clean, quiet roommate.',
                preferences: 'Non-smoker, Computer Science student preferred',
                phone: '+234 801 234 5670',
                postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                poster: 'Ahmed S.'
            },
            {
                id: 2,
                location: 'south',
                price: 20000,
                address: 'House 12, Off Campus Road',
                description: 'Cozy room in a shared apartment. Kitchen and living room access included.',
                preferences: 'Female student, any department welcome',
                phone: '+234 802 345 6781',
                postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                poster: 'Fatima K.'
            },
            {
                id: 3,
                location: 'north',
                price: 30000,
                address: 'Harmony Heights, Floor 2',
                description: 'Modern apartment with gym access, security, and parking. Great for serious students.',
                preferences: 'Graduate student or final year, non-party lifestyle',
                phone: '+234 803 456 7892',
                postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                poster: 'David O.'
            }
        ];
    }
    
    renderRoommateResults(state.roommateRequests);
}

function renderRoommateResults(requests) {
    const resultsContainer = document.getElementById('roommateResults');
    if (!resultsContainer) return;
    
    if (requests.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-users"></i>
                <h3>No roommate requests found</h3>
                <p>Be the first to share your room!</p>
                <button class="btn btn-primary" onclick="closeRoommateSearchModal(); showRoommatePost();">
                    <i class="fas fa-plus"></i> Share Your Room
                </button>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = requests.map(request => `
        <div class="roommate-card">
            <div class="roommate-header">
                <div class="roommate-info">
                    <h4>${request.address}</h4>
                    <p class="roommate-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${request.location.charAt(0).toUpperCase() + request.location.slice(1)} Gate
                    </p>
                </div>
                <div class="roommate-price">₦${request.price.toLocaleString()}/month</div>
            </div>
            
            <div class="roommate-content">
                <p class="roommate-description">${request.description}</p>
                ${request.preferences ? `<p class="roommate-preferences"><strong>Preferences:</strong> ${request.preferences}</p>` : ''}
                
                <div class="roommate-meta">
                    <span class="roommate-poster">Posted by ${request.poster}</span>
                    <span class="roommate-date">${formatDate(request.postedDate)}</span>
                </div>
            </div>
            
            <div class="roommate-actions">
                <button class="btn btn-outline" onclick="contactRoommate('${request.phone}', '${request.address}')">
                    <i class="fas fa-phone"></i> Call
                </button>
                <button class="btn btn-primary" onclick="whatsappRoommate('${request.phone}', '${request.address}')">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
            </div>
        </div>
    `).join('');
}

function searchRoommates() {
    console.log('🔍 Searching roommates...');
    
    const locationFilter = document.getElementById('roommateLocationFilter')?.value || '';
    const budgetFilter = document.getElementById('roommateBudgetFilter')?.value || '';
    
    let filtered = [...state.roommateRequests];
    
    if (locationFilter) {
        filtered = filtered.filter(request => request.location === locationFilter);
    }
    
    if (budgetFilter) {
        const [min, max] = budgetFilter.split('-').map(Number);
        filtered = filtered.filter(request => {
            if (max) {
                return request.price >= min && request.price <= max;
            } else {
                return request.price >= min;
            }
        });
    }
    
    renderRoommateResults(filtered);
    showNotification(`Found ${filtered.length} roommate options`, 'info');
}

function contactRoommate(phone, address) {
    console.log(`📞 Calling roommate at ${phone}...`);
    window.open(`tel:${phone}`, '_self');
}

function whatsappRoommate(phone, address) {
    console.log(`💬 WhatsApp message to roommate...`);
    const message = `Hi! I saw your roommate post for ${address}. I'm interested in sharing the room. Can we discuss?`;
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
}

// Enhanced FAB with roommate option
function initializeFAB() {
    const fab = document.querySelector('.floating-action-btn');
    if (!fab) return;
    
    fab.addEventListener('click', function(e) {
        e.stopPropagation();
        showFABMenu();
    });
    
    // Close FAB menu when clicking outside
    document.addEventListener('click', function() {
        closeFABMenu();
    });
}

function showFABMenu() {
    if (state.fabMenuOpen) {
        closeFABMenu();
        return;
    }
    
    const fab = document.querySelector('.floating-action-btn');
    if (!fab) return;
    
    // Create FAB menu
    const fabMenu = document.createElement('div');
    fabMenu.className = 'fab-menu';
    fabMenu.innerHTML = `
        <div class="fab-option" onclick="event.stopPropagation(); showNotification('Browse all hostels freely - no registration needed!', 'success'); closeFABMenu();">
            <i class="fas fa-search"></i>
            <span>Find Hostel</span>
        </div>
        <div class="fab-option" onclick="event.stopPropagation(); showRoommateModal(); closeFABMenu();">
            <i class="fas fa-users"></i>
            <span>Find Roommate</span>
        </div>
    `;
    
    fab.appendChild(fabMenu);
    fab.classList.add('fab-open');
    state.fabMenuOpen = true;
    
    // Animate in
    setTimeout(() => {
        fabMenu.classList.add('fab-menu-open');
    }, 10);
}

function closeFABMenu() {
    const fab = document.querySelector('.floating-action-btn');
    const fabMenu = document.querySelector('.fab-menu');
    
    if (fabMenu) {
        fabMenu.classList.remove('fab-menu-open');
        setTimeout(() => {
            if (fabMenu.parentNode) fabMenu.parentNode.removeChild(fabMenu);
            if (fab) fab.classList.remove('fab-open');
            state.fabMenuOpen = false;
        }, 200);
    }
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

// Duplicate showModal function removed - using the first definition

// Duplicate closeModal function removed - using the comprehensive version above

// Add CSS for new features
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .fab-menu {
        position: absolute;
        bottom: 100%;
        right: 0;
        margin-bottom: 1rem;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .fab-menu-open {
        opacity: 1;
        transform: translateY(0);
    }
    
    .fab-option {
        background: white;
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 150px;
        transition: all 0.2s ease;
    }
    
    .fab-option:hover {
        background: var(--primary-color);
        color: white;
        transform: translateX(-5px);
    }
    
    .fab-option i {
        font-size: 1.1rem;
        width: 20px;
        text-align: center;
    }
    
    .roommate-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
    }
    
    .roommate-option {
        background: var(--gray-50);
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }
    
    .roommate-option:hover {
        background: var(--primary-color);
        color: white;
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
    }
    
    .roommate-option i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.8;
    }
    
    .roommate-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border-left: 4px solid var(--primary-color);
    }
    
    .roommate-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }
    
    .roommate-price {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--primary-color);
    }
    
    .roommate-location {
        color: var(--gray-600);
        margin: 0.25rem 0;
    }
    
    .roommate-description {
        margin-bottom: 1rem;
        line-height: 1.5;
    }
    
    .roommate-preferences {
        font-size: 0.9rem;
        color: var(--gray-600);
        margin-bottom: 1rem;
    }
    
    .roommate-meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: var(--gray-500);
        margin-bottom: 1rem;
    }
    
    .roommate-actions {
        display: flex;
        gap: 1rem;
    }
    
    .roommate-actions .btn {
        flex: 1;
    }
    
    .no-results {
        text-align: center;
        padding: 3rem;
        color: var(--gray-500);
    }
    
    .no-results i {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(additionalStyles);

console.log('✅ MWG Hostel Finder JavaScript loaded successfully');

// Auto-refresh hostels when localStorage changes (new listings added)
window.addEventListener('storage', function(e) {
    if (e.key === 'realtorListings') {
        console.log('🔄 Detected new realtor listings, refreshing...');
        loadHostels();
        showNotification('New hostel listings added! Page refreshed.', 'success');
    }
});

// Also listen for focus events to refresh when switching tabs
window.addEventListener('focus', function() {
    // Only refresh if there were no hostels before
    if (state.hostels.length === 0) {
        console.log('🔄 Page focus detected, checking for new listings...');
        loadHostels();
    }
});

// Add a manual refresh function for the page
function refreshHostelListings() {
    console.log('🔄 Manually refreshing hostel listings...');
    loadHostels();
    showNotification('Hostel listings refreshed!', 'success');
}

// Clear all data for testing (dev function)
function clearAllData() {
    localStorage.removeItem('realtorListings');
    localStorage.removeItem('realtorData');
    localStorage.removeItem('realtorLoggedIn');
    loadHostels();
    showNotification('All data cleared for testing!', 'info');
}

// Make functions available globally
window.refreshHostelListings = refreshHostelListings;
window.clearAllData = clearAllData;

// Periodic check for new listings (every 30 seconds)
setInterval(() => {
    const currentCount = state.hostels.length;
    loadHostels();
    const newCount = state.hostels.length;
    
    if (newCount > currentCount) {
        console.log(`📈 New listings detected: ${newCount - currentCount} added`);
        showNotification(`${newCount - currentCount} new hostel${newCount - currentCount > 1 ? 's' : ''} added!`, 'success');
    }
}, 30000); // Check every 30 seconds

// 🔧 COMPREHENSIVE INITIALIZATION AND DEBUG SYSTEM
console.log('🚀 Initializing MWG Hostels Platform...');

// Ensure global functions are available
window.contactRealtor = contactRealtor;
window.submitInquiry = submitInquiry;
window.testContactButton = testContactButton;

// Debug function to check system status
function checkSystemStatus() {
    console.log('📋 SYSTEM STATUS CHECK:');
    console.log('- contactRealtor function:', typeof contactRealtor);
    console.log('- submitInquiry function:', typeof submitInquiry);
    console.log('- showModal function:', typeof showModal);
    console.log('- closeModal function:', typeof closeModal);
    console.log('- hostels loaded:', state.hostels.length);
    console.log('- hostel container:', document.getElementById('hostelsGrid') ? 'found' : 'not found');
    
    return {
        contactFunction: typeof contactRealtor !== 'undefined',
        hostelsLoaded: state.hostels.length > 0,
        containerExists: !!document.getElementById('hostelsGrid'),
        modalSystem: typeof showModal !== 'undefined'
    };
}

window.checkSystemStatus = checkSystemStatus;

// Run system check on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, running system check...');
    setTimeout(() => {
        const status = checkSystemStatus();
        console.log('✅ System check complete:', status);
    }, 1000);
});

console.log('✅ MWG Hostels Platform initialization complete!');