// Enhanced hostel card click handler
function handleHostelClick(hostelId) {
    const hostel = hostels.find(h => h.id === hostelId);
    if (!hostel) return;

    // DIRECT WHATSAPP CONTACT - No login required for viewing
    showHostelDetailsModal(hostel);
}

function showHostelDetailsModal(hostel) {
    const modal = document.createElement('div');
    modal.className = 'hostel-detail-modal';
    
    const imageUrl = hostel.images?.length > 0 
        ? (typeof hostel.images[0] === 'string' ? hostel.images[0] : hostel.images[0].url)
        : 'assets/default-hostel.jpg';

    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <button class="close-modal" onclick="this.closest('.hostel-detail-modal').remove()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="hostel-detail-header">
                <img src="${imageUrl}" alt="${hostel.name}" onerror="this.src='assets/default-hostel.jpg'">
                <div class="hostel-badge">${hostel.availability || 'Available'}</div>
            </div>
            
            <div class="hostel-detail-body">
                <h2>${hostel.name}</h2>
                <p class="hostel-location">
                    <i class="fas fa-map-marker-alt"></i> ${hostel.location}
                </p>
                <p class="hostel-price">
                    ₦${parseInt(hostel.price).toLocaleString()}/year
                </p>
                
                <div class="hostel-features-grid">
                    <div class="feature">
                        <i class="fas fa-bed"></i>
                        <span>${hostel.roomType || 'Room Type'}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-users"></i>
                        <span>${hostel.capacity || 'N/A'} Students</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-wifi"></i>
                        <span>${hostel.amenities?.includes('WiFi') ? 'WiFi Available' : 'No WiFi'}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-shield-alt"></i>
                        <span>${hostel.amenities?.includes('Security') ? '24/7 Security' : 'Basic Security'}</span>
                    </div>
                </div>
                
                <div class="hostel-description">
                    <h3>Description</h3>
                    <p>${hostel.description || 'Contact realtor for more details.'}</p>
                </div>
                
                <div class="hostel-amenities">
                    <h3>Amenities</h3>
                    <div class="amenities-list">
                        ${(hostel.amenities || []).map(amenity => `
                            <span class="amenity-tag">
                                <i class="fas fa-check"></i> ${amenity}
                            </span>
                        `).join('') || '<p>Contact realtor for amenities list</p>'}
                    </div>
                </div>
                
                <div class="hostel-actions">
                    <button class="btn-whatsapp-large" onclick="contactRealtorDirectly('${hostel.id}', '${hostel.realtorPhone || hostel.phone || ''}')">
                        <i class="fab fa-whatsapp"></i> Contact Realtor on WhatsApp
                    </button>
                    <button class="btn-secondary" onclick="saveHostelForLater('${hostel.id}')">
                        <i class="fas fa-bookmark"></i> Save for Later
                    </button>
                </div>
                
                <p class="info-note">
                    <i class="fas fa-info-circle"></i> 
                    You'll be redirected to WhatsApp to chat with the realtor directly. 
                    No registration required!
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Direct WhatsApp contact - No login needed
function contactRealtorDirectly(hostelId, realtorPhone) {
    const hostel = hostels.find(h => h.id === hostelId);
    if (!hostel) return;

    // Use provided phone or fetch from hostel data
    const phone = realtorPhone || hostel.realtorPhone || hostel.phone || '';
    
    if (!phone) {
        showNotification('Contact information not available. Please try another hostel.', 'error');
        return;
    }

    const message = `Hi! I'm interested in ${hostel.name} at ${hostel.location}. (Saw on MWG Hostels - https://sama-ruddy.vercel.app)`;
    
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Track analytics (optional)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'hostel_contact', {
            'hostel_id': hostelId,
            'hostel_name': hostel.name
        });
    }
    
    window.open(whatsappUrl, '_blank');
}

// Save hostel for later (requires login)
function saveHostelForLater(hostelId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser) {
        showNotification('Please login to save hostels', 'info');
        setTimeout(() => {
            window.location.href = 'login.html?redirect=hostels';
        }, 1500);
        return;
    }

    let savedHostels = JSON.parse(localStorage.getItem('savedHostels') || '[]');
    
    if (savedHostels.includes(hostelId)) {
        showNotification('Hostel already saved', 'info');
        return;
    }

    savedHostels.push(hostelId);
    localStorage.setItem('savedHostels', JSON.stringify(savedHostels));
    showNotification('Hostel saved successfully!', 'success');
}

// Load hostels and setup click handlers
function initializeHostelCards() {
    const hostelCards = document.querySelectorAll('.hostel-card');
    
    hostelCards.forEach(card => {
        const hostelId = card.dataset.hostelId;
        card.addEventListener('click', () => handleHostelClick(hostelId));
    });
}

document.addEventListener('DOMContentLoaded', initializeHostelCards);