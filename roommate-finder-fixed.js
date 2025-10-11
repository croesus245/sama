// MWG Hostels - Roommate Finder System
// Blue (#2196F3) and White theme

// Switch tabs
function switchTab(tab) {
    document.querySelectorAll('.tab-roommate').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content-roommate').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`${tab}Tab`).classList.add('active');
    
    if (tab === 'browse') {
        loadAllListings();
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Seeker form submission
document.getElementById('seekerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const profile = {
        id: `seeker_${Date.now()}`,
        type: 'seeker',
        name: document.getElementById('seekerName').value,
        phone: document.getElementById('seekerPhone').value,
        gender: document.getElementById('seekerGender').value,
        budget: document.getElementById('seekerBudget').value,
        location: document.getElementById('seekerLocation').value,
        moveDate: document.getElementById('seekerMoveDate').value,
        bio: document.getElementById('seekerBio').value,
        createdAt: new Date().toISOString()
    };
    
    saveProfile(profile);
    this.reset();
    showNotification('✅ Profile posted successfully!');
    
    setTimeout(() => {
        document.querySelector('[onclick*="browse"]').click();
    }, 1500);
});

// Provider form submission
document.getElementById('providerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get uploaded image URLs
    const imageUrls = document.getElementById('roomImageUrls').value;
    const imagesArray = imageUrls ? imageUrls.split(',') : [];
    
    const profile = {
        id: `provider_${Date.now()}`,
        type: 'provider',
        name: document.getElementById('providerName').value,
        phone: document.getElementById('providerPhone').value,
        gender: document.getElementById('providerGender').value,
        rent: document.getElementById('providerRent').value,
        location: document.getElementById('providerLocation').value,
        availableDate: document.getElementById('providerAvailableDate').value,
        description: document.getElementById('providerDescription').value,
        images: imagesArray, // Store uploaded images
        createdAt: new Date().toISOString()
    };
    
    saveProfile(profile);
    this.reset();
    
    // Reset image uploads
    if (typeof uploadedRoomImages !== 'undefined') {
        uploadedRoomImages = [];
        document.getElementById('uploadedCount').textContent = '0 images uploaded';
        document.getElementById('roomImagesPreview').innerHTML = '';
    }
    
    showNotification('✅ Space listed successfully!');
    
    setTimeout(() => {
        document.querySelector('[onclick*="browse"]').click();
    }, 1500);
});

// Save profile
function saveProfile(profile) {
    const profiles = JSON.parse(localStorage.getItem('roommateProfiles') || '[]');
    profiles.push(profile);
    localStorage.setItem('roommateProfiles', JSON.stringify(profiles));
}

// Load all listings
function loadAllListings() {
    const profiles = JSON.parse(localStorage.getItem('roommateProfiles') || '[]');
    const container = document.getElementById('listingsContainer');
    
    if (profiles.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px; grid-column: 1/-1;">
                <i class="fas fa-users" style="font-size: 4rem; color: #2196F3; margin-bottom: 1rem;"></i>
                <h3>No listings yet</h3>
                <p>Be the first to post your profile!</p>
            </div>
        `;
        return;
    }
    
    displayProfiles(profiles);
}

// Display profiles
function displayProfiles(profiles) {
    const container = document.getElementById('listingsContainer');
    
    container.innerHTML = profiles.map(profile => {
        const initial = profile.name.charAt(0).toUpperCase();
        const isSeeker = profile.type === 'seeker';
        const hasImages = profile.images && profile.images.length > 0;
        
        return `
            <div class="profile-card">
                ${hasImages ? `
                    <div style="width: 100%; height: 200px; overflow: hidden; border-radius: 8px 8px 0 0; position: relative;">
                        <img src="${profile.images[0]}" alt="Room" style="width: 100%; height: 100%; object-fit: cover;">
                        ${profile.images.length > 1 ? `
                            <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">
                                <i class="fas fa-images"></i> ${profile.images.length} photos
                            </span>
                        ` : ''}
                    </div>
                ` : ''}
                
                <div class="profile-header" style="${hasImages ? 'padding-top: 16px;' : ''}">
                    <div class="profile-avatar">${initial}</div>
                    <div class="profile-info">
                        <h3>${profile.name}</h3>
                        <span style="color: ${isSeeker ? '#2196F3' : '#4CAF50'};">
                            <i class="fas fa-${isSeeker ? 'search' : 'door-open'}"></i>
                            ${isSeeker ? 'Looking for Roommate' : 'Space Available'}
                        </span>
                    </div>
                </div>
                
                <div class="profile-details">
                    <p><i class="fas fa-venus-mars"></i> ${profile.gender === 'male' ? 'Male' : 'Female'}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${profile.location}</p>
                    <p><i class="fas fa-money-bill-wave"></i> ₦${parseInt(isSeeker ? profile.budget : profile.rent).toLocaleString()}/year</p>
                    ${profile.moveDate || profile.availableDate ? 
                        `<p><i class="fas fa-calendar"></i> ${profile.moveDate || profile.availableDate}</p>` : ''
                    }
                    <p style="margin-top: 12px; color: #666;">
                        ${profile.bio || profile.description || 'No description provided'}
                    </p>
                </div>
                
                ${hasImages && profile.images.length > 1 ? `
                    <div style="padding: 8px 16px; display: flex; gap: 8px; overflow-x: auto;">
                        ${profile.images.slice(1).map(img => `
                            <img src="${img}" alt="Room" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid #e0e0e0;" onclick="window.open('${img}', '_blank')">
                        `).join('')}
                    </div>
                ` : ''}
                
                <button class="btn-contact" onclick="contactViaWhatsApp('${profile.phone}', '${profile.name}')">
                    <i class="fab fa-whatsapp"></i> Contact via WhatsApp
                </button>
            </div>
        `;
    }).join('');
}

// Filter listings
function filterListings() {
    const type = document.getElementById('filterType').value;
    const gender = document.getElementById('filterGender').value;
    
    let profiles = JSON.parse(localStorage.getItem('roommateProfiles') || '[]');
    
    if (type !== 'all') {
        profiles = profiles.filter(p => p.type === type);
    }
    
    if (gender !== 'all') {
        profiles = profiles.filter(p => p.gender === gender);
    }
    
    displayProfiles(profiles);
}

// Contact via WhatsApp
function contactViaWhatsApp(phone, name) {
    const message = encodeURIComponent(`Hi ${name}, I saw your roommate finder profile on MWG Hostels. I'm interested in discussing further.`);
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Load listings on page load
if (document.getElementById('listingsContainer')) {
    loadAllListings();
}

console.log('✅ Roommate Finder Loaded');