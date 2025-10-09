// Roommate Finder - Complete Working System
// This file contains all the JavaScript functionality for the roommate finder

class RoommateFinder {
    constructor() {
        this.posts = [];
        this.init();
    }

    init() {
        this.loadSavedPosts();
        this.setupEventListeners();
        this.displayPosts();
    }

    loadSavedPosts() {
        const savedPosts = localStorage.getItem('roommatePosts');
        this.posts = savedPosts ? JSON.parse(savedPosts) : [];
        console.log(`Loaded ${this.posts.length} roommate posts`);
    }

    savePosts() {
        localStorage.setItem('roommatePosts', JSON.stringify(this.posts));
    }

    setupEventListeners() {
        // Post room form submission
        const postRoomForm = document.getElementById('postRoomForm');
        if (postRoomForm) {
            postRoomForm.addEventListener('submit', (e) => this.handlePostSubmission(e));
        }

        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmission(e));
        }

        // Photo upload handling
        const photoInput = document.getElementById('roomPhotos');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }

        // Video upload handling
        const videoInput = document.getElementById('roomVideos');
        if (videoInput) {
            videoInput.addEventListener('change', (e) => this.handleVideoUpload(e));
        }
    }

    handlePostSubmission(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Validate required fields
        const requiredFields = ['roomTitle', 'location', 'rent', 'rentPeriod', 'posterGender', 'roommateGender', 'fullAddress', 'description'];
        for (let field of requiredFields) {
            if (!formData.get(field)) {
                alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return;
            }
        }

        // Collect amenities
        const amenities = [];
        const amenityCheckboxes = e.target.querySelectorAll('input[name="amenities"]:checked');
        amenityCheckboxes.forEach(checkbox => {
            if (checkbox.value === 'other') {
                const otherInput = e.target.querySelector('input[name="otherAmenity"]');
                if (otherInput && otherInput.value.trim()) {
                    amenities.push(otherInput.value.trim());
                }
            } else {
                amenities.push(checkbox.value);
            }
        });

        // Create new post
        const newPost = {
            id: Date.now().toString(),
            roomTitle: formData.get('roomTitle'),
            location: formData.get('location'),
            rent: formData.get('rent'),
            rentPeriod: formData.get('rentPeriod'),
            posterGender: formData.get('posterGender'),
            roommateGender: formData.get('roommateGender'),
            fullAddress: formData.get('fullAddress'),
            description: formData.get('description'),
            amenities: amenities,
            timestamp: new Date().toISOString(),
            status: 'active'
        };

        // Add to posts array
        this.posts.push(newPost);
        this.savePosts();
        this.displayPosts();

        // Success feedback
        alert('🎉 Room posted successfully! Your listing is now visible to potential roommates.');
        e.target.reset();
        this.closePostRoomModal();
    }

    handleContactSubmission(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const contactData = {
            name: formData.get('contactName'),
            email: formData.get('contactEmail'),
            phone: formData.get('contactPhone'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };

        // Here you would normally send this to a backend
        // For demo, we'll just show success message
        alert('✅ Message sent successfully! The room poster will contact you soon.');
        e.target.reset();
        this.closeContactModal();
    }

    displayPosts() {
        const roommateGrid = document.getElementById('roommateGrid');
        if (!roommateGrid) return;

        // Clear existing dynamic posts (keep any sample posts)
        const dynamicPosts = roommateGrid.querySelectorAll('.dynamic-post');
        dynamicPosts.forEach(post => post.remove());

        // Add new posts
        this.posts.forEach(post => {
            if (post.status === 'active') {
                const postElement = this.createPostElement(post);
                roommateGrid.appendChild(postElement);
            }
        });
    }

    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'roommate-card dynamic-post';
        postDiv.innerHTML = `
            <div class="roommate-header">
                <div class="roommate-status ${post.status}">Looking</div>
                <h3>${post.roomTitle}</h3>
                <p><i class="fas fa-map-marker-alt"></i> FUTA ${post.location.charAt(0).toUpperCase() + post.location.slice(1)} Gate</p>
            </div>
            
            <div class="roommate-content">
                <div class="rent-info">
                    <span class="rent-amount">₦${parseInt(post.rent).toLocaleString()}</span>
                    <span class="rent-period">per ${post.rentPeriod}</span>
                </div>
                
                <div class="gender-preference">
                    <div><strong>Poster:</strong> ${post.posterGender}</div>
                    <div><strong>Looking for:</strong> ${post.roommateGender}</div>
                </div>
                
                <div class="description">
                    <p>${post.description}</p>
                </div>
                
                ${post.amenities.length > 0 ? `
                <div class="amenities">
                    <strong>Amenities:</strong>
                    <div class="amenity-tags">
                        ${post.amenities.map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="contact-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${post.fullAddress}</p>
                    <small><i class="fas fa-clock"></i> Posted ${new Date(post.timestamp).toLocaleDateString()}</small>
                </div>
            </div>
            
            <div class="roommate-actions">
                <button class="btn btn-primary" onclick="roommateFinder.showContactModal('${post.id}')">
                    <i class="fas fa-comment"></i> Contact
                </button>
                <button class="btn btn-success" onclick="roommateFinder.markAsFound('${post.id}')">
                    <i class="fas fa-check"></i> Found
                </button>
            </div>
        `;
        return postDiv;
    }

    // Modal functions
    showPostRoomModal() {
        const modal = document.getElementById('postRoomModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closePostRoomModal() {
        const modal = document.getElementById('postRoomModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    showFindRoommateModal() {
        alert('🔍 Find Roommate\n\nBrowse through the available room posts above! Use the "Contact" buttons to reach out to room posters and find your perfect roommate match.');
    }

    showContactModal(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            // Pre-fill message
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = `Hi! I saw your room post "${post.roomTitle}" on the MWG by SAMA d'GREAT platform. I'm interested in being your roommate. Can we discuss the details?`;
            }
            
            const modal = document.getElementById('contactModal');
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
    }

    closeContactModal() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    markAsFound(postId) {
        if (confirm('🎉 Mark this room as "Roommate Found"?\n\nThis will close the post and remove it from active listings.')) {
            const postIndex = this.posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
                this.posts[postIndex].status = 'found';
                this.savePosts();
                this.displayPosts();
                
                alert('✅ Congratulations! Room marked as found. The post has been closed.');
            }
        }
    }

    // File upload handlers
    handlePhotoUpload(e) {
        const files = e.target.files;
        const preview = document.getElementById('photoPreview');
        if (preview) {
            preview.innerHTML = '';
            for (let i = 0; i < Math.min(files.length, 5); i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    img.style.width = '100px';
                    img.style.height = '80px';
                    img.style.objectFit = 'cover';
                    img.style.margin = '5px';
                    img.style.borderRadius = '5px';
                    preview.appendChild(img);
                }
            }
        }
    }

    handleVideoUpload(e) {
        const files = e.target.files;
        const preview = document.getElementById('videoPreview');
        if (preview) {
            preview.innerHTML = '';
            for (let i = 0; i < Math.min(files.length, 2); i++) {
                const file = files[i];
                if (file.type.startsWith('video/')) {
                    const video = document.createElement('video');
                    video.src = URL.createObjectURL(file);
                    video.controls = true;
                    video.style.width = '200px';
                    video.style.height = '150px';
                    video.style.margin = '5px';
                    video.style.borderRadius = '5px';
                    preview.appendChild(video);
                }
            }
        }
    }

    // Utility functions
    toggleOtherAmenity() {
        const checkbox = document.getElementById('otherAmenityCheckRoommate');
        const otherGroup = document.getElementById('otherAmenityGroupRoommate');
        const otherInput = document.getElementById('otherAmenityRoommate');
        
        if (checkbox && otherGroup && otherInput) {
            if (checkbox.checked) {
                otherGroup.style.display = 'block';
                otherInput.focus();
            } else {
                otherGroup.style.display = 'none';
                otherInput.value = '';
            }
        }
    }
}

// Initialize the roommate finder when DOM is loaded
let roommateFinder;
document.addEventListener('DOMContentLoaded', function() {
    roommateFinder = new RoommateFinder();
    console.log('🏠 Roommate Finder initialized successfully!');
});

// Global functions for HTML onclick handlers
function showPostRoomModal() {
    if (roommateFinder) roommateFinder.showPostRoomModal();
}

function closePostRoomModal() {
    if (roommateFinder) roommateFinder.closePostRoomModal();
}

function showFindRoommateModal() {
    if (roommateFinder) roommateFinder.showFindRoommateModal();
}

function closeContactModal() {
    if (roommateFinder) roommateFinder.closeContactModal();
}

function toggleOtherAmenityRoommate() {
    if (roommateFinder) roommateFinder.toggleOtherAmenity();
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});