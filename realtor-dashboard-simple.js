// MWG Hostels - Simple Realtor Dashboard
// Blue (#2196F3) and White theme

// Check authentication
if (!isRealtorLoggedIn()) {
    window.location.href = 'realtor-login.html';
}

// Section navigation
function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active');
    event.target.closest('.nav-link').classList.add('active');
    
    if (sectionId === 'myListings') {
        loadAllListings();
    }
}

// Image preview
document.getElementById('propertyImages')?.addEventListener('change', function(e) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    const files = Array.from(e.target.files).slice(0, 5);
    
    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button type="button" onclick="removeImage(${index})" class="remove-btn">
                    <i class="fas fa-times"></i>
                </button>
            `;
            preview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
});

// Add listing form submission
document.getElementById('addListingForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get realtor details
    const realtorDetails = {
        name: document.getElementById('realtorName').value.trim(),
        business: document.getElementById('businessName').value.trim(),
        phone: document.getElementById('realtorPhone').value.trim(),
        email: document.getElementById('realtorEmail').value.trim()
    };
    
    // Get property details
    const propertyData = {
        name: document.getElementById('propertyName').value.trim(),
        location: document.getElementById('propertyLocation').value.trim(),
        price: document.getElementById('propertyPrice').value,
        roomType: document.getElementById('roomType').value,
        description: document.getElementById('propertyDescription').value.trim(),
        amenities: {
            wifi: document.getElementById('hasWifi').checked,
            parking: document.getElementById('hasParking').checked,
            security: document.getElementById('hasSecurity').checked
        }
    };
    
    // Handle images
    const images = await handleImages();
    
    // Create listing
    const newListing = {
        id: `listing_${Date.now()}`,
        ...propertyData,
        images: images,
        realtor: realtorDetails,
        createdAt: new Date().toISOString(),
        status: 'Active'
    };
    
    // Save to localStorage
    const listings = JSON.parse(localStorage.getItem('allHostelListings') || '[]');
    listings.push(newListing);
    localStorage.setItem('allHostelListings', JSON.stringify(listings));
    
    showNotification('✅ Property published successfully!', 'success');
    
    // Reset form
    this.reset();
    document.getElementById('imagePreview').innerHTML = '';
    
    // Switch to listings view
    setTimeout(() => {
        document.querySelector('[onclick*="myListings"]').click();
    }, 1500);
});

// Handle image uploads
async function handleImages() {
    const fileInput = document.getElementById('propertyImages');
    const files = Array.from(fileInput.files).slice(0, 5);
    const imageUrls = [];
    
    for (const file of files) {
        const reader = new FileReader();
        const result = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
        imageUrls.push(result);
    }
    
    return imageUrls;
}

// Load all listings
function loadAllListings() {
    const listings = JSON.parse(localStorage.getItem('allHostelListings') || '[]');
    const container = document.getElementById('listingsContainer');
    
    if (listings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-home"></i>
                <h3>No properties yet</h3>
                <p>Start adding properties to see them here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = listings.map(listing => `
        <div class="listing-card">
            <div class="listing-image">
                <img src="${listing.images?.[0] || 'assets/default-hostel.jpg'}" 
                     alt="${listing.name}"
                     onerror="this.src='assets/default-hostel.jpg'">
                <span class="listing-badge">${listing.status}</span>
            </div>
            <div class="listing-content">
                <h3>${listing.name}</h3>
                <p class="listing-location">
                    <i class="fas fa-map-marker-alt"></i> ${listing.location}
                </p>
                <p class="listing-price">₦${parseInt(listing.price).toLocaleString()}/year</p>
                <div class="listing-realtor">
                    <p><strong>${listing.realtor.business}</strong></p>
                    <p>${listing.realtor.name}</p>
                    <p><i class="fab fa-whatsapp"></i> ${listing.realtor.phone}</p>
                </div>
                <div class="listing-actions">
                    <button onclick="deleteListing('${listing.id}')" class="btn-delete">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Delete listing
function deleteListing(listingId) {
    if (!confirm('⚠️ Delete this property? This cannot be undone!')) return;
    
    const listings = JSON.parse(localStorage.getItem('allHostelListings') || '[]');
    const filtered = listings.filter(l => l.id !== listingId);
    
    localStorage.setItem('allHostelListings', JSON.stringify(filtered));
    showNotification('✅ Property deleted', 'success');
    loadAllListings();
}

// Load initial data
loadAllListings();
console.log('✅ Realtor Dashboard Loaded');