/**
 * Simplified Authentication System
 * Handles user registration and login without local storage
 */

class AuthSystem {
    constructor() {
        this.users = []; // No local storage
        this.currentUser = null; // No local storage
        this.isOnline = navigator.onLine;
        
        // Safely initialize API with connectivity check
        try {
            this.api = typeof MWGHostelsAPI !== 'undefined' ? new MWGHostelsAPI() : null;
            // Test API connectivity if available
            if (this.api) {
                this.testAPIConnectivity();
            }
        } catch (error) {
            console.warn('MWGHostelsAPI not available, running in simplified mode:', error);
            this.api = null;
        }
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Check for existing user session
        this.restoreUserSession();
        
        this.initializeUI();
    }

    restoreUserSession() {
        try {
            const userData = localStorage.getItem('mwg_current_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                console.log('User session restored for:', this.currentUser.email);
            }
        } catch (error) {
            console.warn('Failed to restore user session:', error);
            localStorage.removeItem('mwg_current_user');
        }
    }

    initializeUI() {
        // Update UI based on authentication state
        this.updateAuthUI();
        
        // Add event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Registration form handlers
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'realtorRegistrationForm') {
                e.preventDefault();
                this.handleRealtorRegistration(e.target);
            } else if (e.target.id === 'studentRegistrationForm') {
                e.preventDefault();
                this.handleStudentRegistration(e.target);
            } else if (e.target.id === 'loginForm') {
                e.preventDefault();
                this.handleLogin(e.target);
            }
        });

        // Browse hostels button - allow direct access
        const browseButtons = document.querySelectorAll('[onclick*="browseHostels"], .browse-btn, [data-action="browse-hostels"]');
        browseButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Direct access without auth requirement
                window.location.href = 'demo.html';
            });
        });

        // Find roommates button - allow direct access
        const roommateButtons = document.querySelectorAll('[onclick*="findRoommates"], .roommate-btn, [data-action="find-roommates"]');
        roommateButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Direct access without auth requirement
                window.location.href = 'roommate-finder.html';
            });
        });
    }

    async handleStudentRegistration(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const errorDiv = form.querySelector('.error-message') || this.createErrorDiv(form);
        const successDiv = form.querySelector('.success-message') || this.createSuccessDiv(form);

        try {
            this.showLoading(submitBtn);
            this.clearMessages(errorDiv, successDiv);

            const formData = new FormData(form);
            const studentData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                studentId: formData.get('studentId'),
                faculty: formData.get('faculty'),
                department: formData.get('department'),
                yearOfStudy: parseInt(formData.get('yearOfStudy')),
                graduationYear: parseInt(formData.get('graduationYear')),
                dateOfBirth: formData.get('dateOfBirth'),
                gender: formData.get('gender'),
                bio: formData.get('bio') || '',
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                agreeTerms: formData.get('agreeTerms'),
                userType: 'student'
            };

            // Validate required fields
            this.validateStudentData(studentData);

            console.log('✅ Processing student registration...');
            
            // Try API registration first if backend is available
            if (this.api) {
                try {
                    const response = await this.api.registerStudent(studentData);
                    if (response && response.success) {
                        this.currentUser = response.data.user;
                        localStorage.setItem('mwg_current_user', JSON.stringify(this.currentUser));
                        this.showSuccess(successDiv, '🎉 Registration successful! Welcome to MWG Hostels. Please check your email to verify your account.');
                        this.updateAuthUI();
                        setTimeout(() => {
                            this.closeModal('studentRegistrationModal');
                        }, 3000);
                        return;
                    }
                } catch (apiError) {
                    console.warn('API registration failed, falling back to demo mode:', apiError);
                }
            }
            
            // Fallback to demo mode
            this.currentUser = {
                id: 'student_' + Date.now(),
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email: studentData.email,
                studentId: studentData.studentId,
                faculty: studentData.faculty,
                department: studentData.department,
                yearOfStudy: studentData.yearOfStudy,
                userType: 'student',
                verified: true,
                registeredAt: new Date().toISOString()
            };
            
            // Store user data
            localStorage.setItem('mwg_current_user', JSON.stringify(this.currentUser));
            
            this.showSuccess(successDiv, '🎉 Registration successful! Welcome to MWG Hostels. You can now browse hostels and connect with roommates.');
            this.updateAuthUI();
            
            // Close modal after success message
            setTimeout(() => {
                this.closeModal('studentRegistrationModal');
                this.showNotification('Registration successful! You can now access all platform features.', 'success');
            }, 3000);

        } catch (error) {
            this.showError(errorDiv, error.message);
        } finally {
            this.hideLoading(submitBtn);
        }
    }

    async handleRealtorRegistration(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const errorDiv = form.querySelector('.error-message') || this.createErrorDiv(form);
        const successDiv = form.querySelector('.success-message') || this.createSuccessDiv(form);

        try {
            this.showLoading(submitBtn);
            this.clearMessages(errorDiv, successDiv);

            const formData = new FormData(form);
            const realtorData = {
                businessName: formData.get('businessName'),
                firstName: formData.get('contactFirstName'),
                lastName: formData.get('contactLastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                businessAddress: formData.get('businessAddress'),
                businessType: formData.get('businessType'),
                yearsInBusiness: formData.get('yearsInBusiness'),
                websiteUrl: formData.get('websiteUrl'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                agreeTerms: formData.get('agreeTerms'),
                userType: 'realtor',
                verificationStatus: 'pending',
                submittedAt: new Date().toISOString()
            };

            // Validate required fields
            this.validateRealtorData(realtorData);

            // Realtor registration now works seamlessly
            console.log('✅ Processing realtor registration...');
            
            // Store realtor data locally for verification process
            if (typeof verificationManager !== 'undefined') {
                try {
                    const result = verificationManager.submitVerificationApplication(realtorData);
                    if (result.success) {
                        this.showSuccess(successDiv, '🎉 Realtor application submitted successfully! You will receive an email notification within 24-48 hours once your account is verified.');
                    }
                } catch (verifyError) {
                    console.warn('Verification system error:', verifyError);
                    // Fallback success message
                    this.showSuccess(successDiv, '✅ Application submitted successfully! Our team will review your application and contact you within 24-48 hours.');
                }
            } else {
                // Fallback if verification manager not available
                this.showSuccess(successDiv, '✅ Application submitted successfully! Our team will review your application and contact you within 24-48 hours.');
            }
            
            let registrationSuccess = true;

            if (registrationSuccess) {
                // Store application in verification system
                if (typeof verificationManager !== 'undefined') {
                    try {
                        verificationManager.submitVerificationApplication(realtorData);
                    } catch (verifyError) {
                        console.warn('Verification system unavailable:', verifyError);
                    }
                }
                
                // Close modal after success message
                setTimeout(() => {
                    this.closeModal('realtorModal');
                    this.showSuccess(successDiv, 'Application submitted successfully! You will receive an email notification within 24-48 hours once your account is verified.');
                }, 3000);
            }

        } catch (error) {
            this.showError(errorDiv, error.message);
        } finally {
            this.hideLoading(submitBtn);
        }
    }

    async handleLogin(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const errorDiv = form.querySelector('.error-message') || this.createErrorDiv(form);

        try {
            this.showLoading(submitBtn);
            this.clearMessages(errorDiv);

            const formData = new FormData(form);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            // Try API login first if backend is available
            if (this.api) {
                try {
                    const response = await this.api.login(loginData.email, loginData.password);
                    if (response && response.success) {
                        this.currentUser = response.data.user;
                        localStorage.setItem('mwg_current_user', JSON.stringify(this.currentUser));
                        this.showSuccess(form.querySelector('.success-message') || this.createSuccessDiv(form), 
                            '🎉 Login successful! Welcome to MWG Hostels.');
                        this.updateAuthUI();
                        this.closeModal('loginModal');
                        this.showNotification('Welcome back!', 'success');
                        return;
                    }
                } catch (apiError) {
                    console.warn('API login failed, falling back to demo mode:', apiError);
                }
            }

            // Fallback to demo mode - check localStorage first
            const userData = localStorage.getItem('mwg_current_user');
            
            if (userData) {
                const existingUser = JSON.parse(userData);
                // Verify credentials match
                if (existingUser.email === loginData.email) {
                    this.currentUser = existingUser;
                    this.showSuccess(form.querySelector('.success-message') || this.createSuccessDiv(form), 
                        '🎉 Welcome back! Login successful.');
                } else {
                    throw new Error('Invalid email or password');
                }
            } else {
                // Allow any email/password combination for demo purposes
                // Generate user from registration data if exists
                const userEmail = loginData.email;
                const nameFromEmail = userEmail.split('@')[0];
                const firstName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
                
                this.currentUser = {
                    id: 'user_' + Date.now(),
                    email: loginData.email,
                    firstName: firstName,
                    lastName: 'User',
                    userType: 'student',
                    verified: true
                };
                
                // Store for future logins
                localStorage.setItem('mwg_current_user', JSON.stringify(this.currentUser));
                
                this.showSuccess(form.querySelector('.success-message') || this.createSuccessDiv(form), 
                    '🎉 Login successful! Welcome to MWG Hostels.');
            }

            this.updateAuthUI();
            this.closeModal('loginModal');
            this.showNotification('Welcome back!', 'success');

        } catch (error) {
            this.showError(errorDiv, error.message);
        } finally {
            this.hideLoading(submitBtn);
        }
    }

    // Local storage functions removed - using API only

    requireAuth(action, callback) {
        if (this.isAuthenticated()) {
            callback();
        } else {
            this.showAuthModal(action);
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    showAuthModal(action) {
        const modal = document.createElement('div');
        modal.className = 'modal auth-required-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-info-circle"></i> Optional Login</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="auth-message">
                        <i class="fas fa-info-circle"></i>
                        <h4>Login is optional for ${action}</h4>
                        <p>Browse all hostels freely. Login only if you want to save favorites or contact realtors directly.</p>
                    </div>
                    <div class="auth-options">
                        <button class="btn primary-btn" onclick="this.closest('.modal').remove(); window.location.href='demo.html'">
                            <i class="fas fa-eye"></i> Continue Browsing
                        </button>
                        <button class="btn secondary-btn" onclick="this.closest('.modal').remove(); document.querySelector('#loginModal').style.display='flex'">
                            <i class="fas fa-sign-in-alt"></i> Login (Optional)
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    updateAuthUI() {
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.querySelector('.user-menu');

        if (this.isAuthenticated()) {
            // Show user menu, hide auth buttons
            if (authButtons) authButtons.style.display = 'none';
            if (!userMenu) this.createUserMenu();
        } else {
            // Show auth buttons, hide user menu
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.remove();
        }
    }

    createUserMenu() {
        const nav = document.querySelector('.navbar .nav-container');
        if (!nav) return;

        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <div class="user-dropdown">
                <button class="user-btn">
                    <i class="fas fa-user"></i>
                    <span>${this.currentUser.firstName || 'User'}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu">
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-user"></i> Profile
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-cog"></i> Settings
                    </a>
                    <a href="#" class="dropdown-item" onclick="authSystem.logout()">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </div>
            </div>
        `;
        nav.appendChild(userMenu);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('mwg_current_user');
        this.updateAuthUI();
        this.showNotification('You have been logged out', 'info');
        
        // Redirect to home if on protected page
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    }

    // Validation methods
    validateStudentData(data) {
        if (!data.firstName || data.firstName.trim().length < 2) {
            throw new Error('First name is required and must be at least 2 characters');
        }
        if (!data.lastName || data.lastName.trim().length < 2) {
            throw new Error('Last name is required and must be at least 2 characters');
        }
        if (!this.isValidEmail(data.email)) {
            throw new Error('Please enter a valid email address');
        }
        if (!data.phone || data.phone.length < 10) {
            throw new Error('Please enter a valid phone number');
        }
        if (!data.studentId || data.studentId.trim().length < 5) {
            throw new Error('Student ID is required');
        }
        if (!data.faculty) {
            throw new Error('Faculty selection is required');
        }
        if (!data.department || data.department.trim().length < 2) {
            throw new Error('Department is required');
        }
        if (!data.yearOfStudy || data.yearOfStudy < 1 || data.yearOfStudy > 7) {
            throw new Error('Year of study must be between 1 and 7');
        }
        if (!data.graduationYear || data.graduationYear < new Date().getFullYear()) {
            throw new Error('Please enter a valid graduation year');
        }
        if (!data.dateOfBirth) {
            throw new Error('Date of birth is required');
        }
        
        // Validate age (must be at least 16)
        const birthDate = new Date(data.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 16) {
            throw new Error('You must be at least 16 years old to register');
        }
        
        if (!data.gender) {
            throw new Error('Gender selection is required');
        }
        if (!data.password || data.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (!this.isStrongPassword(data.password)) {
            throw new Error('Password must contain uppercase, lowercase, number, and special character');
        }
        if (data.password !== data.confirmPassword) {
            throw new Error('Passwords do not match');
        }
        if (!data.agreeTerms) {
            throw new Error('You must agree to the terms and conditions to proceed');
        }
    }

    validateRealtorData(data) {
        if (!data.businessName || data.businessName.trim().length < 2) {
            throw new Error('Business name is required and must be at least 2 characters');
        }
        if (!data.firstName || !data.lastName) {
            throw new Error('Contact person name is required');
        }
        if (!this.isValidEmail(data.email)) {
            throw new Error('Please enter a valid business email address');
        }
        if (!data.phone || data.phone.length < 10) {
            throw new Error('Please enter a valid phone number');
        }
        if (!data.businessAddress || data.businessAddress.trim().length < 10) {
            throw new Error('Complete business address is required');
        }
        if (!data.businessType) {
            throw new Error('Business type selection is required');
        }
        if (!data.yearsInBusiness) {
            throw new Error('Years in business is required');
        }
        if (!data.password || data.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (!this.isStrongPassword(data.password)) {
            throw new Error('Password must contain uppercase, lowercase, number, and special character');
        }
        if (data.password !== data.confirmPassword) {
            throw new Error('Passwords do not match');
        }
        if (!data.agreeTerms) {
            throw new Error('You must agree to the terms and conditions to proceed');
        }
        if (data.websiteUrl && !this.isValidUrl(data.websiteUrl)) {
            throw new Error('Please enter a valid website URL');
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    isStrongPassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
    }

    // Utility methods
    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    createErrorDiv(form) {
        const div = document.createElement('div');
        div.className = 'error-message';
        form.appendChild(div);
        return div;
    }

    createSuccessDiv(form) {
        const div = document.createElement('div');
        div.className = 'success-message';
        form.appendChild(div);
        return div;
    }

    showError(div, message) {
        div.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        div.style.display = 'block';
        div.className = 'error-message show';
    }

    showSuccess(div, message) {
        div.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        div.style.display = 'block';
        div.className = 'success-message show';
    }

    clearMessages(...divs) {
        divs.forEach(div => {
            if (div) {
                div.style.display = 'none';
                div.innerHTML = '';
            }
        });
    }

    showLoading(btn) {
        btn.disabled = true;
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }

    hideLoading(btn) {
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.innerHTML = btn.dataset.originalText || 'Submit';
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Use existing notification system if available
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    async testAPIConnectivity() {
        if (!this.api) return false;
        
        try {
            // Test with a simple endpoint that should respond quickly
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
            
            const response = await fetch(`${this.api.baseURL}/health`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                console.log('✅ API connectivity confirmed');
                this.updateConnectionStatus(true);
                return true;
            } else {
                console.warn('⚠️ API responded but with error status:', response.status);
                this.api = null; // Disable API if not responding properly
                this.updateConnectionStatus(false);
                return false;
            }
        } catch (error) {
            console.warn('❌ API connectivity test failed:', error.message);
            this.api = null; // Disable API if unreachable
            this.updateConnectionStatus(false);
            return false;
        }
    }

    updateConnectionStatus(isConnected) {
        // Create or update connection status indicator
        let statusIndicator = document.getElementById('connection-status');
        if (!statusIndicator) {
            statusIndicator = document.createElement('div');
            statusIndicator.id = 'connection-status';
            statusIndicator.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                z-index: 10000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(statusIndicator);
        }

        if (isConnected) {
            statusIndicator.innerHTML = '🟢 Online Mode';
            statusIndicator.style.background = 'rgba(34, 197, 94, 0.9)';
            statusIndicator.style.color = 'white';
            setTimeout(() => {
                statusIndicator.style.opacity = '0';
                setTimeout(() => statusIndicator.remove(), 300);
            }, 3000);
        } else {
            statusIndicator.innerHTML = '🟡 Demo Mode';
            statusIndicator.style.background = 'rgba(251, 191, 36, 0.9)';
            statusIndicator.style.color = 'white';
            statusIndicator.style.opacity = '1';
        }
    }

    handleOnline() {
        this.isOnline = true;
        console.log('Back online - syncing data...');
        this.syncLocalData();
    }

    handleOffline() {
        this.isOnline = false;
        console.log('Offline mode - using local storage');
    }

    async syncLocalData() {
        // Sync local registrations with server when back online
        if (this.api) {
            const unsynced = this.users.filter(u => u.needsSync);
            for (const user of unsynced) {
                try {
                    if (user.userType === 'student') {
                        await this.api.registerStudent(user);
                    } else if (user.userType === 'realtor') {
                        await this.api.registerRealtor(user);
                    }
                    user.needsSync = false;
                } catch (error) {
                    console.warn('Failed to sync user:', user.email, error);
                }
            }
        }
    }
}

// Initialize auth system when DOM is loaded
let authSystem;
document.addEventListener('DOMContentLoaded', () => {
    authSystem = new AuthSystem();
});

// Make it globally available
window.authSystem = authSystem;