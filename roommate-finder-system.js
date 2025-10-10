// Roommate Finder - Complete Working System
// This file contains all the JavaScript functionality for the roommate finder

class RoommateFinder {
    constructor() {
        this.profiles = [];
        this.currentUser = null;
        this.userType = null; // 'seeker' or 'provider'
        this.init();
    }

    init() {
        this.loadProfiles();
        this.setupEventListeners();
        this.renderProfiles();
        
        // Check if user is logged in
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    setupEventListeners() {
        // Toggle between seeker and provider
        const userTypeToggle = document.getElementById('userTypeToggle');
        if (userTypeToggle) {
            userTypeToggle.addEventListener('change', (e) => {
                this.userType = e.target.value;
                this.updateFormFields();
            });
        }

        // Profile form submission
        const profileForm = document.getElementById('roommateProfileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileSubmission(e);
            });
        }

        // Room images upload
        const roomImagesInput = document.getElementById('roomImages');
        if (roomImagesInput) {
            roomImagesInput.addEventListener('change', (e) => {
                this.handleRoomImageUpload(e);
            });
        }

        // Search and filters
        const searchInput = document.getElementById('roommateSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProfiles(e.target.value);
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.applyFilter(e.target.dataset.filter);
            });
        });
    }

    updateFormFields() {
        const seekerFields = document.getElementById('seekerFields');
        const providerFields = document.getElementById('providerFields');

        if (this.userType === 'seeker') {
            seekerFields.style.display = 'block';
            providerFields.style.display = 'none';
        } else {
            seekerFields.style.display = 'none';
            providerFields.style.display = 'block';
        }
    }

    handleRoomImageUpload(event) {
        const files = Array.from(event.target.files);
        const previewContainer = document.getElementById('roomImagePreview');
        
        if (!previewContainer) return;

        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                showNotification('Only image files allowed', 'error');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showNotification('Image must be under 5MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.createElement('div');
                preview.className = 'room-image-preview';
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Room preview">
                    <button type="button" class="remove-image-btn" onclick="this.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                previewContainer.appendChild(preview);
            };
            reader.readAsDataURL(file);
        });
    }

    handleProfileSubmission(event) {
        const formData = new FormData(event.target);
        
        // Collect room images if provider
        let roomImages = [];
        if (this.userType === 'provider') {
            const imageElements = document.querySelectorAll('#roomImagePreview img');
            roomImages = Array.from(imageElements).map(img => img.src);
        }

        const profile = {
            id: `profile_${Date.now()}`,
            userId: this.currentUser?.id || 'guest',
            type: this.userType,
            name: formData.get('name'),
            age: formData.get('age'),
            gender: formData.get('gender'),
            university: formData.get('university'),
            department: formData.get('department'),
            level: formData.get('level'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            
            // Seeker specific
            budget: this.userType === 'seeker' ? formData.get('budget') : null,
            preferredLocation: this.userType === 'seeker' ? formData.get('preferredLocation') : null,
            moveInDate: this.userType === 'seeker' ? formData.get('moveInDate') : null,
            
            // Provider specific
            roomLocation: this.userType === 'provider' ? formData.get('roomLocation') : null,
            roomPrice: this.userType === 'provider' ? formData.get('roomPrice') : null,
            roomType: this.userType === 'provider' ? formData.get('roomType') : null,
            amenities: this.userType === 'provider' ? formData.getAll('amenities') : [],
            roomImages: roomImages,
            availableFrom: this.userType === 'provider' ? formData.get('availableFrom') : null,
            
            // Common
            bio: formData.get('bio'),
            interests: formData.get('interests')?.split(',').map(i => i.trim()) || [],
            sleepSchedule: formData.get('sleepSchedule'),
            cleanliness: formData.get('cleanliness'),
            smoking: formData.get('smoking') === 'yes',
            pets: formData.get('pets') === 'yes',
            
            createdAt: new Date().toISOString()
        };

        this.profiles.push(profile);
        this.saveProfiles();
        this.renderProfiles();
        
        showNotification('Profile created successfully!', 'success');
        event.target.reset();
        document.getElementById('roomImagePreview').innerHTML = '';
        
        // Close modal if exists
        const modal = document.getElementById('addProfileModal');
        if (modal) modal.style.display = 'none';
    }

    renderProfiles() {
        const container = document.getElementById('roommateProfilesContainer');
        if (!container) return;

        if (this.profiles.length === 0) {
            container.innerHTML = `
                <div class="no-profiles">
                    <i class="fas fa-users"></i>
                    <p>No profiles yet. Be the first to create one!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.profiles.map(profile => this.createProfileCard(profile)).join('');
    }

    createProfileCard(profile) {
        const isProvider = profile.type === 'provider';
        const imageUrl = isProvider && profile.roomImages?.length > 0 
            ? profile.roomImages[0] 
            : 'assets/default-avatar.jpg';

        return `
            <div class="roommate-card ${isProvider ? 'provider-card' : 'seeker-card'}">
                <div class="profile-badge">${isProvider ? '🏠 Has Room' : '🔍 Seeking'}</div>
                <div class="roommate-image">
                    <img src="${imageUrl}" alt="${profile.name}" onerror="this.src='assets/default-avatar.jpg'">
                </div>
                <div class="roommate-info">
                    <h3>${profile.name}</h3>
                    <p class="university"><i class="fas fa-graduation-cap"></i> ${profile.university}</p>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${isProvider ? profile.roomLocation : profile.preferredLocation}</p>
                    
                    ${isProvider ? `
                        <p class="price"><i class="fas fa-money-bill-wave"></i> ₦${parseInt(profile.roomPrice).toLocaleString()}/year</p>
                        <p class="room-type"><i class="fas fa-bed"></i> ${profile.roomType}</p>
                    ` : `
                        <p class="budget"><i class="fas fa-wallet"></i> Budget: ₦${parseInt(profile.budget).toLocaleString()}/year</p>
                    `}
                    
                    <div class="profile-tags">
                        <span class="tag">${profile.gender}</span>
                        <span class="tag">${profile.level} Level</span>
                        <span class="tag">${profile.sleepSchedule}</span>
                    </div>
                    
                    <div class="profile-actions">
                        <button class="btn-primary" onclick="roommateFinderInstance.viewProfile('${profile.id}')">
                            <i class="fas fa-eye"></i> View Profile
                        </button>
                        <button class="btn-success" onclick="roommateFinderInstance.contactProfile('${profile.id}')">
                            <i class="fab fa-whatsapp"></i> Contact
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    viewProfile(profileId) {
        const profile = this.profiles.find(p => p.id === profileId);
        if (!profile) return;

        const modal = document.createElement('div');
        modal.className = 'profile-modal';
        modal.innerHTML = `
            <div class="profile-modal-content">
                <button class="close-modal" onclick="this.closest('.profile-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="profile-detail">
                    ${profile.type === 'provider' && profile.roomImages?.length > 0 ? `
                        <div class="room-gallery">
                            ${profile.roomImages.map(img => `
                                <img src="${img}" alt="Room photo">
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <h2>${profile.name}</h2>
                    <p><strong>Age:</strong> ${profile.age}</p>
                    <p><strong>Gender:</strong> ${profile.gender}</p>
                    <p><strong>University:</strong> ${profile.university}</p>
                    <p><strong>Department:</strong> ${profile.department}</p>
                    <p><strong>Level:</strong> ${profile.level}</p>
                    
                    ${profile.type === 'provider' ? `
                        <h3>Room Details</h3>
                        <p><strong>Location:</strong> ${profile.roomLocation}</p>
                        <p><strong>Price:</strong> ₦${parseInt(profile.roomPrice).toLocaleString()}/year</p>
                        <p><strong>Room Type:</strong> ${profile.roomType}</p>
                        <p><strong>Available From:</strong> ${new Date(profile.availableFrom).toLocaleDateString()}</p>
                        <p><strong>Amenities:</strong> ${profile.amenities.join(', ')}</p>
                    ` : `
                        <h3>Looking For</h3>
                        <p><strong>Budget:</strong> ₦${parseInt(profile.budget).toLocaleString()}/year</p>
                        <p><strong>Preferred Location:</strong> ${profile.preferredLocation}</p>
                        <p><strong>Move-in Date:</strong> ${new Date(profile.moveInDate).toLocaleDateString()}</p>
                    `}
                    
                    <h3>About</h3>
                    <p>${profile.bio}</p>
                    
                    <h3>Lifestyle</h3>
                    <p><strong>Sleep Schedule:</strong> ${profile.sleepSchedule}</p>
                    <p><strong>Cleanliness:</strong> ${profile.cleanliness}</p>
                    <p><strong>Smoking:</strong> ${profile.smoking ? 'Yes' : 'No'}</p>
                    <p><strong>Pets:</strong> ${profile.pets ? 'Yes' : 'No'}</p>
                    
                    <button class="btn-whatsapp" onclick="roommateFinderInstance.contactProfile('${profile.id}')">
                        <i class="fab fa-whatsapp"></i> Contact on WhatsApp
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    contactProfile(profileId) {
        const profile = this.profiles.find(p => p.id === profileId);
        if (!profile) return;

        const message = profile.type === 'provider'
            ? `Hi! I'm interested in your room at ${profile.roomLocation}. (Saw on MWG Hostels)`
            : `Hi! I saw your roommate profile on MWG Hostels. I think we might be a good match!`;

        const whatsappUrl = `https://wa.me/${profile.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    filterProfiles(searchTerm) {
        const filtered = this.profiles.filter(profile => {
            const searchLower = searchTerm.toLowerCase();
            return (
                profile.name.toLowerCase().includes(searchLower) ||
                profile.university.toLowerCase().includes(searchLower) ||
                (profile.roomLocation?.toLowerCase().includes(searchLower)) ||
                (profile.preferredLocation?.toLowerCase().includes(searchLower))
            );
        });

        this.renderFilteredProfiles(filtered);
    }

    applyFilter(filterType) {
        let filtered = [...this.profiles];

        switch(filterType) {
            case 'seekers':
                filtered = filtered.filter(p => p.type === 'seeker');
                break;
            case 'providers':
                filtered = filtered.filter(p => p.type === 'provider');
                break;
            case 'male':
            case 'female':
                filtered = filtered.filter(p => p.gender.toLowerCase() === filterType);
                break;
        }

        this.renderFilteredProfiles(filtered);
    }

    renderFilteredProfiles(profiles) {
        const container = document.getElementById('roommateProfilesContainer');
        if (!container) return;

        container.innerHTML = profiles.map(profile => this.createProfileCard(profile)).join('');
    }

    loadProfiles() {
        const saved = localStorage.getItem('roommateProfiles');
        this.profiles = saved ? JSON.parse(saved) : [];
    }

    saveProfiles() {
        localStorage.setItem('roommateProfiles', JSON.stringify(this.profiles));
    }
}

// Initialize
let roommateFinderInstance;
document.addEventListener('DOMContentLoaded', () => {
    roommateFinderInstance = new RoommateFinder();
});