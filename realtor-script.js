// MWG Hostels - Realtor Portal Script
// Blue (#2196F3) and White theme

// Check authentication
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentRealtorUser') || 'null');
    
    if (!currentUser) {
        window.location.href = 'realtor-login.html';
        return null;
    }
    
    return currentUser;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// LOGIN HANDLER
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        console.log('🔍 Login attempt:', email);
        
        // Get or initialize accounts
        let accounts = JSON.parse(localStorage.getItem('realtorAccounts') || '[]');
        
        // If no accounts exist, initialize from config
        if (accounts.length === 0 && typeof AUTHORIZED_REALTORS !== 'undefined') {
            console.log('📝 Initializing accounts from config...');
            initializeAuthorizedRealtors();
            accounts = JSON.parse(localStorage.getItem('realtorAccounts') || '[]');
        }
        
        console.log('👥 Total accounts:', accounts.length);
        
        // Find matching account (case-insensitive email)
        const account = accounts.find(acc => 
            acc.email.toLowerCase() === email.toLowerCase() && 
            acc.password === password
        );
        
        if (!account) {
            console.log('❌ Login failed - Invalid credentials');
            console.log('Available emails:', accounts.map(a => a.email));
            showNotification('❌ Invalid email or password', 'error');
            return;
        }
        
        // Check verification
        if (!account.verified) {
            console.log('❌ Login failed - Account not verified');
            showNotification('⚠️ Your account is pending verification. Contact admin.', 'error');
            return;
        }
        
        // LOGIN SUCCESS
        console.log('✅ Login successful:', account.name);
        localStorage.setItem('currentRealtorUser', JSON.stringify(account));
        showNotification(`✅ Welcome back, ${account.name}!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'realtor-dashboard.html';
        }, 1000);
    });
}

// REGISTRATION HANDLER
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const name = document.getElementById('regName').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const company = document.getElementById('regCompany').value.trim();
        
        // Check if authorization system is loaded
        if (typeof isAuthorizedEmail !== 'function') {
            showNotification('❌ Authorization system not loaded. Please refresh the page.', 'error');
            return;
        }
        
        // CHECK 1: Email authorization
        if (!isAuthorizedEmail(email)) {
            showNotification('❌ This email is not authorized. Contact admin@mwghostels.com', 'error');
            return;
        }
        
        // CHECK 2: Password match
        if (password !== confirmPassword) {
            showNotification('❌ Passwords do not match', 'error');
            return;
        }
        
        // CHECK 3: Password strength
        if (!isStrongPassword(password)) {
            showNotification('❌ Password must be at least 8 characters with uppercase, lowercase, and number', 'error');
            return;
        }
        
        // CHECK 4: Already registered
        const accounts = JSON.parse(localStorage.getItem('realtorAccounts') || '[]');
        if (accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase())) {
            showNotification('❌ This email is already registered. Please login.', 'error');
            return;
        }
        
        // CREATE ACCOUNT
        const newAccount = {
            id: `realtor_${Date.now()}`,
            email: email,
            password: password,
            name: name,
            phone: phone,
            company: company,
            verified: true, // Auto-verify authorized emails
            createdAt: new Date().toISOString()
        };
        
        accounts.push(newAccount);
        localStorage.setItem('realtorAccounts', JSON.stringify(accounts));
        
        showNotification('✅ Registration successful! You can now login.', 'success');
        
        // Clear form and switch to login
        setTimeout(() => {
            document.getElementById('registerForm').reset();
            document.querySelector('.tab-btn[data-tab="login"]')?.click();
        }, 1500);
    });
}

// LOGOUT
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentRealtorUser');
        window.location.href = 'realtor-login.html';
    }
}

// TAB SWITCHING
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tab = this.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}Tab`)?.classList.add('active');
    });
});

// DASHBOARD FUNCTIONALITY
if (window.location.pathname.includes('realtor-dashboard.html')) {
    const currentUser = checkAuth();
    
    if (currentUser) {
        document.getElementById('realtorName')?.textContent = currentUser.name;
        document.getElementById('realtorEmail')?.textContent = currentUser.email;
        
        loadRealtorListings();
    }
}

// Load realtor's listings
function loadRealtorListings() {
    const currentUser = JSON.parse(localStorage.getItem('currentRealtorUser'));
    const allListings = JSON.parse(localStorage.getItem('realtorListings') || '[]');
    
    const myListings = allListings.filter(listing => listing.realtorId === currentUser.id);
    
    const container = document.getElementById('myListingsContainer');
    if (!container) return;
    
    if (myListings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-home" style="font-size: 4rem; color: #2196F3; margin-bottom: 1rem;"></i>
                <h3>No listings yet</h3>
                <p>Start adding your hostel properties to attract students</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = myListings.map(listing => `
        <div class="listing-card">
            <div class="listing-image">
                <img src="${listing.images?.[0] || 'assets/default-hostel.jpg'}" 
                     alt="${listing.name}"
                     onerror="this.src='assets/default-hostel.jpg'">
                <span class="listing-badge">${listing.status || 'Active'}</span>
            </div>
            <div class="listing-content">
                <h3>${listing.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${listing.location}</p>
                <p class="listing-price">₦${parseInt(listing.price).toLocaleString()}/year</p>
                <div class="listing-actions">
                    <button onclick="editListing('${listing.id}')" class="btn-edit">
                        <i class="fas fa-edit"></i> Edit
                    </button>
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
    if (!confirm('⚠️ Delete this listing? This cannot be undone!')) return;
    
    const listings = JSON.parse(localStorage.getItem('realtorListings') || '[]');
    const filtered = listings.filter(l => l.id !== listingId);
    
    localStorage.setItem('realtorListings', JSON.stringify(filtered));
    showNotification('✅ Listing deleted', 'success');
    loadRealtorListings();
}

console.log('✅ Realtor script loaded');
