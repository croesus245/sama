// MWG Hostels - Main Script
// Blue (#2196F3) and White theme

// Load hostels on page load
document.addEventListener('DOMContentLoaded', function() {
    loadHostelsFromRealtors();
    setupSearch();
    setupFilters();
});

// Load hostels from realtor listings
function loadHostelsFromRealtors() {
    const listings = JSON.parse(localStorage.getItem('allHostelListings') || '[]');
    const container = document.getElementById('hostelsContainer');
    
    if (!container) return;
    
    if (listings.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-home" style="font-size: 4rem; color: #2196F3; margin-bottom: 1rem;"></i>
                <h3 style="color: #333; margin-bottom: 0.5rem;">No Properties Listed Yet</h3>
                <p style="color: #666;">Check back soon for available hostels and accommodations</p>
            </div>
        `;
        return;
    }
    
    displayHostels(listings);
}

// Display hostels
function displayHostels(listings) {
    const container = document.getElementById('hostelsContainer');
    
    container.innerHTML = listings.map(listing => `
        <div class="hostel-card" onclick="viewHostelDetails('${listing.id}')">
            <div class="hostel-image">
                <img src="${listing.images && listing.images[0] ? listing.images[0] : 'assets/default-hostel.jpg'}" 
                     alt="${listing.name}"
                     onerror="this.src='assets/default-hostel.jpg'">
                <div class="hostel-badge">${listing.roomType || 'Available'}</div>
            </div>
            <div class="hostel-content">
                <h3>${listing.name}</h3>
                <p class="hostel-location">
                    <i class="fas fa-map-marker-alt"></i> ${listing.location}
                </p>
                <p class="hostel-description">${listing.description.substring(0, 100)}...</p>
                
                <div class="hostel-amenities">
                    ${listing.amenities.wifi ? '<span><i class="fas fa-wifi"></i> WiFi</span>' : ''}
                    ${listing.amenities.parking ? '<span><i class="fas fa-parking"></i> Parking</span>' : ''}
                    ${listing.amenities.security ? '<span><i class="fas fa-shield-alt"></i> Security</span>' : ''}
                </div>
                
                <div class="hostel-footer">
                    <div class="hostel-price">
                        <span class="price-label">From</span>
                        <span class="price-value">₦${parseInt(listing.price).toLocaleString()}</span>
                        <span class="price-period">/year</span>
                    </div>
                    <button class="btn-view" onclick="event.stopPropagation(); contactRealtor('${listing.realtor.phone}', '${listing.name}', '${listing.realtor.name}')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                </div>
                
                <div class="hostel-realtor">
                    <p><i class="fas fa-building"></i> Listed by <strong>${listing.realtor.business}</strong></p>
                </div>
            </div>
        </div>
    `).join('');
}

// View hostel details
function viewHostelDetails(listingId) {
    const listings = JSON.parse(localStorage.getItem('allHostelListings') || '[]');
    const listing = listings.find(l => l.id === listingId);
    
    if (!listing) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'hostel-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.closest('.hostel-modal').remove()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="modal-header">
                <h2>${listing.name}</h2>
                <p class="modal-location">
                    <i class="fas fa-map-marker-alt"></i> ${listing.location}
                </p>
            </div>
            
            <div class="modal-images">
                ${listing.images && listing.images.length > 0 ? `
                    <div class="main-image">
                        <img src="${listing.images[0]}" alt="${listing.name}">
                    </div>
                    ${listing.images.length > 1 ? `
                        <div class="thumbnail-images">
                            ${listing.images.slice(1).map((img, idx) => `
                                <img src="${img}" alt="View ${idx + 2}" onclick="this.closest('.modal-images').querySelector('.main-image img').src = this.src">
                            `).join('')}
                        </div>
                    ` : ''}
                ` : `
                    <div class="main-image">
                        <img src="assets/default-hostel.jpg" alt="No image available">
                    </div>
                `}
            </div>
            
            <div class="modal-body">
                <div class="modal-section">
                    <h3><i class="fas fa-info-circle"></i> Description</h3>
                    <p>${listing.description}</p>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-home"></i> Details</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <i class="fas fa-bed"></i>
                            <span>Room Type: ${listing.roomType}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>₦${parseInt(listing.price).toLocaleString()}/year</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-check-circle"></i> Amenities</h3>
                    <div class="amenities-list">
                        ${listing.amenities.wifi ? '<span><i class="fas fa-wifi"></i> WiFi Available</span>' : ''}
                        ${listing.amenities.parking ? '<span><i class="fas fa-parking"></i> Parking Space</span>' : ''}
                        ${listing.amenities.security ? '<span><i class="fas fa-shield-alt"></i> 24/7 Security</span>' : ''}
                    </div>
                </div>
                
                <div class="modal-section realtor-contact">
                    <h3><i class="fas fa-user-tie"></i> Contact Realtor</h3>
                    <div class="realtor-info">
                        <p><strong>Business:</strong> ${listing.realtor.business}</p>
                        <p><strong>Agent:</strong> ${listing.realtor.name}</p>
                        <p><strong>Phone:</strong> ${listing.realtor.phone}</p>
                        ${listing.realtor.email ? `<p><strong>Email:</strong> ${listing.realtor.email}</p>` : ''}
                    </div>
                    <button class="btn-primary btn-large" onclick="contactRealtor('${listing.realtor.phone}', '${listing.name}', '${listing.realtor.name}')">
                        <i class="fab fa-whatsapp"></i> Contact via WhatsApp
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

// Contact realtor via WhatsApp
function contactRealtor(phone, propertyName, realtorName) {
    const message = encodeURIComponent(`Hi ${realtorName}, I'm interested in ${propertyName} listed on MWG Hostels. Can we discuss further?`);
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const listings = JSON.parse(localStorage.getItem('allHostelListings') || '[]');
        
        const filtered = listings.filter(listing => 
            listing.name.toLowerCase().includes(query) ||
            listing.location.toLowerCase().includes(query) ||
            listing.description.toLowerCase().includes(query)
        );
        
        displayHostels(filtered);
    });
}

// Filter functionality
function setupFilters() {
    const priceFilter = document.getElementById('priceFilter');
    const locationFilter = document.getElementById('locationFilter');
    
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    
    if (locationFilter) {
        locationFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    let listings = JSON.parse(localStorage.getItem('allHostelListings') || '[]');
    
    // Price filter
    const priceFilter = document.getElementById('priceFilter')?.value;
    if (priceFilter && priceFilter !== 'all') {
        const [min, max] = priceFilter.split('-').map(Number);
        listings = listings.filter(l => {
            const price = parseInt(l.price);
            return max ? (price >= min && price <= max) : (price >= min);
        });
    }
    
    // Location filter
    const locationFilter = document.getElementById('locationFilter')?.value.toLowerCase();
    if (locationFilter && locationFilter !== 'all') {
        listings = listings.filter(l => 
            l.location.toLowerCase().includes(locationFilter)
        );
    }
    
    displayHostels(listings);
}

console.log('✅ Main script loaded');