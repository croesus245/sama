// Student Hostel Application System
console.log('🎯 Student Application System - Initializing...');

class StudentApplicationSystem {
    constructor() {
        this.applications = this.loadApplications();
        this.initializeSystem();
    }

    // Load saved applications from localStorage
    loadApplications() {
        try {
            return JSON.parse(localStorage.getItem('studentApplications') || '[]');
        } catch (error) {
            console.error('Error loading applications:', error);
            return [];
        }
    }

    // Save applications to localStorage
    saveApplications() {
        try {
            localStorage.setItem('studentApplications', JSON.stringify(this.applications));
            console.log('✅ Applications saved successfully');
        } catch (error) {
            console.error('❌ Error saving applications:', error);
        }
    }

    // Initialize the system
    initializeSystem() {
        console.log('🚀 Initializing Student Application System...');
        this.setupEventListeners();
        this.loadMyApplications();
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for application button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="apply-hostel"]')) {
                const hostelId = e.target.getAttribute('data-hostel-id');
                this.showApplicationForm(hostelId);
            }
            
            if (e.target.matches('[data-action="view-applications"]')) {
                this.showMyApplications();
            }
        });

        // Initialize FAB menu if it exists
        this.initializeFABMenu();
    }

    // Initialize floating action button menu
    initializeFABMenu() {
        const fabMain = document.getElementById('fabMain');
        const fabMenu = document.getElementById('fabMenu');
        
        if (fabMain && fabMenu) {
            let isOpen = false;
            
            fabMain.addEventListener('click', () => {
                isOpen = !isOpen;
                fabMain.classList.toggle('active', isOpen);
                fabMenu.classList.toggle('active', isOpen);
            });

            // Close FAB menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!fabMain.contains(e.target) && !fabMenu.contains(e.target)) {
                    isOpen = false;
                    fabMain.classList.remove('active');
                    fabMenu.classList.remove('active');
                }
            });

            // Handle FAB option clicks
            fabMenu.querySelectorAll('.fab-option').forEach(option => {
                option.addEventListener('click', () => {
                    isOpen = false;
                    fabMain.classList.remove('active');
                    fabMenu.classList.remove('active');
                });
            });
        }
    }

    // Show application form
    showApplicationForm(hostelId) {
        const hostel = state.hostels.find(h => h.id === hostelId);
        if (!hostel) {
            this.showNotification('Hostel not found', 'error');
            return;
        }

        const applicationId = this.generateApplicationId();
        
        showModal('Apply for Hostel', `
            <div class="student-application-form">
                <div class="application-header">
                    <div class="hostel-info">
                        <h3>${hostel.name}</h3>
                        <p><i class="fas fa-map-marker-alt"></i> ${hostel.location}</p>
                        <p><i class="fas fa-tag"></i> ₦${hostel.price.toLocaleString()}/year</p>
                    </div>
                </div>

                <form id="studentApplicationForm" class="application-form">
                    <input type="hidden" name="applicationId" value="${applicationId}">
                    <input type="hidden" name="hostelId" value="${hostelId}">
                    <input type="hidden" name="hostelName" value="${hostel.name}">
                    <input type="hidden" name="realtorInfo" value="${hostel.realtor}">

                    <div class="form-section">
                        <h4><i class="fas fa-user"></i> Personal Information</h4>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="studentFirstName">First Name *</label>
                                <input type="text" id="studentFirstName" name="firstName" required>
                            </div>
                            <div class="form-group">
                                <label for="studentLastName">Last Name *</label>
                                <input type="text" id="studentLastName" name="lastName" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="studentEmail">Email Address *</label>
                                <input type="email" id="studentEmail" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="studentPhone">Phone Number *</label>
                                <input type="tel" id="studentPhone" name="phone" required placeholder="+234 xxx xxx xxxx">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="whatsappNumber">WhatsApp Number</label>
                            <input type="tel" id="whatsappNumber" name="whatsapp" placeholder="+234 xxx xxx xxxx">
                            <small class="form-help">For easier communication (optional)</small>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4><i class="fas fa-graduation-cap"></i> Academic Information</h4>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="studentId">Student ID/Matric Number *</label>
                                <input type="text" id="studentId" name="studentId" required placeholder="e.g., FUT/xxxx/xxxx">
                            </div>
                            <div class="form-group">
                                <label for="academicLevel">Academic Level *</label>
                                <select id="academicLevel" name="level" required>
                                    <option value="">Select Level</option>
                                    <option value="100">100 Level</option>
                                    <option value="200">200 Level</option>
                                    <option value="300">300 Level</option>
                                    <option value="400">400 Level</option>
                                    <option value="500">500 Level</option>
                                    <option value="postgraduate">Postgraduate</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="department">Department/Faculty *</label>
                                <input type="text" id="department" name="department" required placeholder="e.g., Computer Science">
                            </div>
                            <div class="form-group">
                                <label for="expectedGraduation">Expected Graduation</label>
                                <input type="month" id="expectedGraduation" name="graduation">
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4><i class="fas fa-home"></i> Accommodation Preferences</h4>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="roomType">Preferred Room Type *</label>
                                <select id="roomType" name="roomType" required>
                                    <option value="">Select Room Type</option>
                                    <option value="single">Single Room</option>
                                    <option value="shared">Shared Room (2 people)</option>
                                    <option value="apartment">Mini Apartment</option>
                                    <option value="any">Any Available</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="moveInDate">Preferred Move-in Date *</label>
                                <input type="date" id="moveInDate" name="moveInDate" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="duration">Stay Duration *</label>
                            <select id="duration" name="duration" required>
                                <option value="">Select Duration</option>
                                <option value="semester">One Semester</option>
                                <option value="academic_year">Academic Year</option>
                                <option value="multiple_years">Multiple Years</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4><i class="fas fa-users"></i> Background Information</h4>
                        
                        <div class="form-group">
                            <label for="previousAccommodation">Previous Accommodation Experience</label>
                            <select id="previousAccommodation" name="previousStay">
                                <option value="">Select Experience</option>
                                <option value="first_time">First time staying off-campus</option>
                                <option value="hostel_experience">Have hostel experience</option>
                                <option value="apartment_experience">Have apartment experience</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="emergencyContact">Emergency Contact *</label>
                            <input type="text" id="emergencyContact" name="emergencyContact" required placeholder="Name and phone number">
                        </div>

                        <div class="form-group">
                            <label for="additionalInfo">Additional Information/Special Requests</label>
                            <textarea id="additionalInfo" name="additionalInfo" rows="3" placeholder="Any specific needs, medical conditions, or preferences..."></textarea>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4><i class="fas fa-credit-card"></i> Financial Information</h4>
                        
                        <div class="form-group">
                            <label for="paymentMethod">Preferred Payment Method *</label>
                            <select id="paymentMethod" name="paymentMethod" required>
                                <option value="">Select Payment Method</option>
                                <option value="full_payment">Full Payment Upfront</option>
                                <option value="installments">Installment Payments</option>
                                <option value="family_support">Family/Guardian Payment</option>
                                <option value="scholarship">Scholarship/Bursary</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="financialConfirmation" required>
                                I confirm that I can afford the rent (₦${hostel.price.toLocaleString()}/year) and understand the payment terms
                            </label>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4><i class="fas fa-file-contract"></i> Agreement & Consent</h4>
                        
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="termsAgreement" required>
                                I agree to the <a href="#" onclick="showTermsAndConditions()">Terms and Conditions</a>
                            </label>
                            
                            <label class="checkbox-label">
                                <input type="checkbox" name="dataConsent" required>
                                I consent to sharing my information with the realtor for accommodation purposes
                            </label>
                            
                            <label class="checkbox-label">
                                <input type="checkbox" name="communicationConsent" required>
                                I agree to be contacted by the realtor via phone, email, or WhatsApp
                            </label>
                        </div>
                    </div>

                    <div class="application-actions">
                        <button type="button" class="btn btn-outline" onclick="closeModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Submit Application
                        </button>
                    </div>
                </form>
            </div>
        `, 'large');

        // Add form submission handler
        document.getElementById('studentApplicationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitApplication(e.target);
        });
    }

    // Generate unique application ID
    generateApplicationId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `APP-${timestamp}-${random}`.toUpperCase();
    }

    // Submit application
    async submitApplication(form) {
        const formData = new FormData(form);
        const application = {
            id: formData.get('applicationId'),
            hostelId: formData.get('hostelId'),
            hostelName: formData.get('hostelName'),
            realtorInfo: formData.get('realtorInfo'),
            studentInfo: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                whatsapp: formData.get('whatsapp'),
                studentId: formData.get('studentId'),
                level: formData.get('level'),
                department: formData.get('department'),
                graduation: formData.get('graduation')
            },
            accommodation: {
                roomType: formData.get('roomType'),
                moveInDate: formData.get('moveInDate'),
                duration: formData.get('duration'),
                previousStay: formData.get('previousStay')
            },
            additional: {
                emergencyContact: formData.get('emergencyContact'),
                additionalInfo: formData.get('additionalInfo'),
                paymentMethod: formData.get('paymentMethod')
            },
            status: 'pending',
            submittedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };

        try {
            // Save to backend API
            const response = await fetch('http://localhost:5000/api/applications/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    applicationData: {
                        applicationId: application.id,
                        hostelId: application.hostelId,
                        studentInfo: application.studentInfo,
                        accommodation: application.accommodation,
                        additional: application.additional
                    }
                })
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to submit application');
            }

            console.log('✅ Application saved to backend:', result);

            // Also save locally as backup
            this.applications.push(application);
            this.saveApplications();

            // Show success message
            closeModal();
            this.showSuccessMessage(application);
            
            // Send notification to realtor
            this.notifyRealtor(application);
            
            console.log('✅ Application submitted successfully:', application.id);

        } catch (error) {
            console.error('❌ Error submitting application:', error);
            
            // Save locally as fallback
            this.applications.push(application);
            this.saveApplications();
            
            // Still show success to user
            closeModal();
            this.showSuccessMessage(application);
            
            console.log('⚠️ Application saved locally (backend unavailable)');
        }
    }

    // Show success message
    showSuccessMessage(application) {
        showModal('Application Submitted Successfully!', `
            <div class="application-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                
                <h3>Application Submitted!</h3>
                <p>Your application for <strong>${application.hostelName}</strong> has been submitted successfully.</p>
                
                <div class="application-details">
                    <div class="detail-item">
                        <strong>Application ID:</strong> ${application.id}
                    </div>
                    <div class="detail-item">
                        <strong>Submitted:</strong> ${new Date(application.submittedAt).toLocaleDateString()}
                    </div>
                    <div class="detail-item">
                        <strong>Status:</strong> <span class="status-pending">Pending Review</span>
                    </div>
                </div>

                <div class="next-steps">
                    <h4>What happens next?</h4>
                    <ul>
                        <li><i class="fas fa-check"></i> Your application will be reviewed by the realtor</li>
                        <li><i class="fas fa-check"></i> You'll receive updates via email and phone</li>
                        <li><i class="fas fa-check"></i> The realtor may contact you for additional information</li>
                        <li><i class="fas fa-check"></i> You can track your application status anytime</li>
                    </ul>
                </div>

                <div class="success-actions">
                    <button class="btn btn-primary" onclick="studentApplicationSystem.showMyApplications(); closeModal();">
                        <i class="fas fa-list"></i> View My Applications
                    </button>
                    <button class="btn btn-outline" onclick="closeModal()">
                        <i class="fas fa-home"></i> Continue Browsing
                    </button>
                </div>
            </div>
        `);
    }

    // Notify realtor (simulated - in real app this would be an API call)
    notifyRealtor(application) {
        console.log(`📧 Notifying realtor about new application: ${application.id}`);
        
        // In a real application, this would send an email/notification to the realtor
        // For now, we'll simulate this by storing notifications
        const notifications = JSON.parse(localStorage.getItem('realtorNotifications') || '[]');
        notifications.push({
            type: 'new_application',
            applicationId: application.id,
            hostelName: application.hostelName,
            studentName: `${application.studentInfo.firstName} ${application.studentInfo.lastName}`,
            timestamp: new Date().toISOString(),
            read: false
        });
        localStorage.setItem('realtorNotifications', JSON.stringify(notifications));
    }

    // Show my applications
    showMyApplications() {
        const myApplications = this.applications;
        
        if (myApplications.length === 0) {
            showModal('My Applications', `
                <div class="no-applications">
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>No Applications Yet</h3>
                        <p>You haven't submitted any hostel applications yet.</p>
                        <button class="btn btn-primary" onclick="closeModal()">
                            <i class="fas fa-search"></i> Browse Hostels
                        </button>
                    </div>
                </div>
            `);
            return;
        }

        const applicationsHTML = myApplications.map(app => `
            <div class="application-card" data-application-id="${app.id}">
                <div class="application-header">
                    <div class="application-info">
                        <h4>${app.hostelName}</h4>
                        <p><i class="fas fa-user"></i> ${app.realtorInfo}</p>
                        <p><i class="fas fa-calendar"></i> Applied: ${new Date(app.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div class="application-status">
                        <span class="status-badge status-${app.status}">${this.getStatusLabel(app.status)}</span>
                    </div>
                </div>
                
                <div class="application-details">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Application ID:</label>
                            <span>${app.id}</span>
                        </div>
                        <div class="detail-item">
                            <label>Room Type:</label>
                            <span>${this.formatRoomType(app.accommodation.roomType)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Move-in Date:</label>
                            <span>${new Date(app.accommodation.moveInDate).toLocaleDateString()}</span>
                        </div>
                        <div class="detail-item">
                            <label>Duration:</label>
                            <span>${this.formatDuration(app.accommodation.duration)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="application-actions">
                    <button class="btn btn-outline btn-sm" onclick="studentApplicationSystem.viewApplicationDetails('${app.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    ${app.status === 'pending' ? `
                        <button class="btn btn-danger btn-sm" onclick="studentApplicationSystem.cancelApplication('${app.id}')">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    ` : ''}
                    <button class="btn btn-primary btn-sm" onclick="studentApplicationSystem.contactRealtorAboutApplication('${app.id}')">
                        <i class="fas fa-phone"></i> Contact Realtor
                    </button>
                </div>
            </div>
        `).join('');

        showModal('My Applications', `
            <div class="my-applications">
                <div class="applications-header">
                    <h3><i class="fas fa-clipboard-list"></i> My Applications (${myApplications.length})</h3>
                    <div class="applications-stats">
                        <span class="stat-item">
                            <span class="stat-count">${myApplications.filter(a => a.status === 'pending').length}</span>
                            <span class="stat-label">Pending</span>
                        </span>
                        <span class="stat-item">
                            <span class="stat-count">${myApplications.filter(a => a.status === 'approved').length}</span>
                            <span class="stat-label">Approved</span>
                        </span>
                    </div>
                </div>
                
                <div class="applications-list">
                    ${applicationsHTML}
                </div>
                
                <div class="applications-footer">
                    <button class="btn btn-outline" onclick="closeModal()">
                        <i class="fas fa-times"></i> Close
                    </button>
                    <button class="btn btn-primary" onclick="closeModal()">
                        <i class="fas fa-plus"></i> Apply for More Hostels
                    </button>
                </div>
            </div>
        `, 'large');
    }

    // View application details
    viewApplicationDetails(applicationId) {
        const application = this.applications.find(app => app.id === applicationId);
        if (!application) {
            this.showNotification('Application not found', 'error');
            return;
        }

        showModal('Application Details', `
            <div class="application-details-view">
                <div class="application-header">
                    <h3>${application.hostelName}</h3>
                    <span class="status-badge status-${application.status}">${this.getStatusLabel(application.status)}</span>
                </div>
                
                <div class="details-grid">
                    <div class="detail-section">
                        <h4>Application Information</h4>
                        <div class="detail-item">
                            <label>Application ID:</label>
                            <span>${application.id}</span>
                        </div>
                        <div class="detail-item">
                            <label>Submitted:</label>
                            <span>${new Date(application.submittedAt).toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                            <label>Realtor:</label>
                            <span>${application.realtorInfo}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Student Information</h4>
                        <div class="detail-item">
                            <label>Name:</label>
                            <span>${application.studentInfo.firstName} ${application.studentInfo.lastName}</span>
                        </div>
                        <div class="detail-item">
                            <label>Student ID:</label>
                            <span>${application.studentInfo.studentId}</span>
                        </div>
                        <div class="detail-item">
                            <label>Level:</label>
                            <span>${application.studentInfo.level} Level</span>
                        </div>
                        <div class="detail-item">
                            <label>Department:</label>
                            <span>${application.studentInfo.department}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Accommodation Preferences</h4>
                        <div class="detail-item">
                            <label>Room Type:</label>
                            <span>${this.formatRoomType(application.accommodation.roomType)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Move-in Date:</label>
                            <span>${new Date(application.accommodation.moveInDate).toLocaleDateString()}</span>
                        </div>
                        <div class="detail-item">
                            <label>Duration:</label>
                            <span>${this.formatDuration(application.accommodation.duration)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="application-actions">
                    <button class="btn btn-outline" onclick="closeModal()">
                        <i class="fas fa-arrow-left"></i> Back to Applications
                    </button>
                    <button class="btn btn-primary" onclick="studentApplicationSystem.contactRealtorAboutApplication('${application.id}')">
                        <i class="fas fa-phone"></i> Contact Realtor
                    </button>
                </div>
            </div>
        `);
    }

    // Cancel application
    cancelApplication(applicationId) {
        if (!confirm('Are you sure you want to cancel this application? This action cannot be undone.')) {
            return;
        }

        const applicationIndex = this.applications.findIndex(app => app.id === applicationId);
        if (applicationIndex === -1) {
            this.showNotification('Application not found', 'error');
            return;
        }

        this.applications[applicationIndex].status = 'cancelled';
        this.applications[applicationIndex].lastUpdated = new Date().toISOString();
        this.saveApplications();
        
        this.showNotification('Application cancelled successfully', 'success');
        this.showMyApplications(); // Refresh the view
    }

    // Contact realtor about application
    contactRealtorAboutApplication(applicationId) {
        const application = this.applications.find(app => app.id === applicationId);
        if (!application) {
            this.showNotification('Application not found', 'error');
            return;
        }

        const message = `Hi! I recently submitted an application (ID: ${application.id}) for ${application.hostelName} on the MWG Hostels platform. I wanted to follow up on the status and see if you need any additional information from me.`;
        
        // This would typically contact the realtor - for now we'll show contact options
        showModal('Contact Realtor', `
            <div class="contact-realtor">
                <h3>Contact Realtor about Application</h3>
                <p>Application ID: <strong>${application.id}</strong></p>
                <p>Hostel: <strong>${application.hostelName}</strong></p>
                
                <div class="contact-options">
                    <button class="btn btn-primary" onclick="window.open('https://wa.me/2348145653433?text=${encodeURIComponent(message)}', '_blank'); closeModal();">
                        <i class="fab fa-whatsapp"></i> WhatsApp Realtor
                    </button>
                    <button class="btn btn-outline" onclick="window.open('tel:+2348145653433', '_self'); closeModal();">
                        <i class="fas fa-phone"></i> Call Realtor
                    </button>
                </div>
            </div>
        `);
    }

    // Helper methods
    getStatusLabel(status) {
        const labels = {
            'pending': 'Pending Review',
            'approved': 'Approved',
            'rejected': 'Rejected',
            'cancelled': 'Cancelled'
        };
        return labels[status] || status;
    }

    formatRoomType(type) {
        const types = {
            'single': 'Single Room',
            'shared': 'Shared Room',
            'apartment': 'Mini Apartment',
            'any': 'Any Available'
        };
        return types[type] || type;
    }

    formatDuration(duration) {
        const durations = {
            'semester': 'One Semester',
            'academic_year': 'Academic Year',
            'multiple_years': 'Multiple Years'
        };
        return durations[duration] || duration;
    }

    showNotification(message, type = 'info') {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
        // This would show a proper notification in the UI
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            alert(message);
        }
    }

    // Load applications on page load
    loadMyApplications() {
        // This could populate a dashboard or applications section
        console.log(`📋 Loaded ${this.applications.length} applications`);
    }
}

// Initialize the system
let studentApplicationSystem;

document.addEventListener('DOMContentLoaded', function() {
    studentApplicationSystem = new StudentApplicationSystem();
});

// Global function to show terms and conditions
function showTermsAndConditions() {
    showModal('Terms and Conditions', `
        <div class="terms-content">
            <h4>Student Application Terms & Conditions</h4>
            
            <h5>1. Application Process</h5>
            <ul>
                <li>Applications are submitted directly to realtors for review</li>
                <li>Approval is at the discretion of the property owner/realtor</li>
                <li>Applications may be cancelled before approval</li>
            </ul>
            
            <h5>2. Information Accuracy</h5>
            <ul>
                <li>All information provided must be accurate and truthful</li>
                <li>False information may result in application rejection</li>
                <li>Student ID and academic details will be verified</li>
            </ul>
            
            <h5>3. Communication</h5>
            <ul>
                <li>You agree to be contacted by realtors regarding your application</li>
                <li>Response times may vary by realtor</li>
                <li>Keep your contact information updated</li>
            </ul>
            
            <h5>4. Privacy & Data</h5>
            <ul>
                <li>Your information is shared only with relevant realtors</li>
                <li>Data is used solely for accommodation purposes</li>
                <li>You can request data removal at any time</li>
            </ul>
            
            <button class="btn btn-primary" onclick="closeModal()">I Understand</button>
        </div>
    `);
}

console.log('✅ Student Application System loaded successfully');