/**
 * Enhanced Authentication System with Fallback
 * Handles user registration, login, and access control
 */

class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('mwg_users') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('mwg_current_user') || 'null');
        this.isOnline = navigator.onLine;
        
        // Safely initialize API with connectivity check
        try {
            this.api = typeof MWGHostelsAPI !== 'undefined' ? new MWGHostelsAPI() : null;
            // Test API connectivity if available
            if (this.api) {
                this.testAPIConnectivity();
            }
        } catch (error) {
            console.warn('MWGHostelsAPI not available, running in offline mode:', error);
            this.api = null;
        }
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        this.initializeUI();
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
            if (e.target.id === 'studentRegistrationForm') {
                e.preventDefault();
                this.handleStudentRegistration(e.target);
            } else if (e.target.id === 'realtorRegistrationForm') {
                e.preventDefault();
                this.handleRealtorRegistration(e.target);
            } else if (e.target.id === 'loginForm') {
                e.preventDefault();
                this.handleLogin(e.target);
            }
        });

        // Browse hostels button with auth check
        const browseButtons = document.querySelectorAll('[onclick*="browseHostels"], .browse-btn, [data-action="browse-hostels"]');
        browseButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.requireAuth('browse hostels', () => {
                    window.location.href = 'demo.html';
                });
            });
        });

        // Find roommates button with auth check
        const roommateButtons = document.querySelectorAll('[onclick*="findRoommates"], .roommate-btn, [data-action="find-roommates"]');
        roommateButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.requireAuth('find roommates', () => {
                    window.location.href = 'roommate-finder.html';
                });
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
                faculty: formData.get('faculty'),
                department: formData.get('department'),
                yearOfStudy: formData.get('yearOfStudy'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                userType: 'student'
            };

            // Validate required fields
            this.validateStudentData(studentData);

            // Try online registration first
            let registrationSuccess = false;
            if (this.isOnline && this.api) {
                try {
                    const response = await this.api.registerStudent(studentData);
                    if (response.success) {
                        registrationSuccess = true;
                        this.showSuccess(successDiv, 'Registration successful! Please check your email for verification.');
                    } else {
                        throw new Error(response.message || 'Registration failed');
                    }
                } catch (apiError) {
                    console.warn('Online registration failed, using local fallback:', apiError.message);
                    
                    // Check if it's a network connectivity issue
                    if (apiError.message.includes('fetch') || apiError.message.includes('network') || apiError.message.includes('Failed to fetch')) {
                        console.log('Backend server appears to be offline, using local registration');
                        // Fall back to local registration
                        try {
                            registrationSuccess = this.registerUserLocally(studentData);
                            if (registrationSuccess) {
                                this.showSuccess(successDiv, '✅ Registration successful! (Local mode - will sync when server is available)');
                            }
                        } catch (localError) {
                            throw new Error(`Registration failed: ${localError.message}`);
                        }
                    } else {
                        throw new Error(`Server error: ${apiError.message}`);
                    }
                }
            } else {
                // Offline registration or API not available
                console.log('Using local registration (offline mode or no API)');
                try {
                    registrationSuccess = this.registerUserLocally(studentData);
                    if (registrationSuccess) {
                        this.showSuccess(successDiv, '✅ Registration successful! (Offline mode)');
                    }
                } catch (localError) {
                    throw new Error(`Registration failed: ${localError.message}`);
                }
            }

            if (registrationSuccess) {
                // Close modal and show login
                setTimeout(() => {
                    this.closeModal('registrationModal');
                    this.showModal('loginModal');
                }, 2000);
            }

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
                userType: 'realtor',
                verificationStatus: 'pending',
                submittedAt: new Date().toISOString()
            };

            // Validate required fields
            this.validateRealtorData(realtorData);

            // Try online registration first
            let registrationSuccess = false;
            if (this.isOnline && this.api) {
                try {
                    const response = await this.api.registerRealtor(realtorData);
                    if (response.success) {
                        registrationSuccess = true;
                        this.showSuccess(successDiv, 'Application submitted successfully! You will receive an email notification within 24-48 hours once your account is verified.');
                    } else {
                        throw new Error(response.message || 'Registration failed');
                    }
                } catch (apiError) {
                    console.warn('Online registration failed, using local fallback:', apiError.message);
                    registrationSuccess = this.registerUserLocally(realtorData);
                }
            } else {
                // Offline registration - submit to verification system
                try {
                    if (typeof verificationManager !== 'undefined') {
                        const result = verificationManager.submitVerificationApplication(realtorData);
                        if (result.success) {
                            registrationSuccess = true;
                            this.showSuccess(successDiv, `Application submitted successfully! Application ID: ${result.applicationId}. You will receive an email notification within 24-48 hours once your account is verified.`);
                        }
                    } else {
                        // Fallback to local storage
                        registrationSuccess = this.registerUserLocally(realtorData);
                        if (registrationSuccess) {
                            this.showSuccess(successDiv, 'Application submitted successfully! You will receive an email notification within 24-48 hours once your account is verified.');
                        }
                    }
                } catch (error) {
                    console.error('Verification submission failed:', error);
                    registrationSuccess = this.registerUserLocally(realtorData);
                    if (registrationSuccess) {
                        this.showSuccess(successDiv, 'Application submitted successfully! You will receive an email notification within 24-48 hours once your account is verified.');
                    }
                }
            }

            if (registrationSuccess) {
                setTimeout(() => {
                    this.closeModal('registrationModal');
                    this.showModal('loginModal');
                }, 2000);
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

            // Try online login first
            let loginSuccess = false;
            if (this.isOnline && this.api) {
                try {
                    const response = await this.api.login(loginData);
                    if (response.success) {
                        this.currentUser = response.user;
                        localStorage.setItem('mwg_current_user', JSON.stringify(this.currentUser));
                        loginSuccess = true;
                    } else {
                        throw new Error(response.message || 'Login failed');
                    }
                } catch (apiError) {
                    console.warn('Online login failed, trying local:', apiError.message);
                    loginSuccess = this.loginUserLocally(loginData);
                }
            } else {
                loginSuccess = this.loginUserLocally(loginData);
            }

            if (loginSuccess) {
                this.updateAuthUI();
                this.closeModal('loginModal');
                this.showNotification('Welcome back!', 'success');
            } else {
                throw new Error('Invalid email or password');
            }

        } catch (error) {
            this.showError(errorDiv, error.message);
        } finally {
            this.hideLoading(submitBtn);
        }
    }

    registerUserLocally(userData) {
        // Check if user already exists
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Add user to local storage
        const newUser = {
            id: this.generateId(),
            ...userData,
            createdAt: new Date().toISOString(),
            isVerified: false,
            needsSync: true // Flag for when online sync is available
        };

        delete newUser.password; // Don't store password in local storage
        this.users.push(newUser);
        localStorage.setItem('mwg_users', JSON.stringify(this.users));

        return true;
    }

    loginUserLocally(loginData) {
        const user = this.users.find(u => u.email === loginData.email);
        if (user) {
            // Check if user is a realtor and verify their status
            if (user.userType === 'realtor' && typeof verificationManager !== 'undefined') {
                const verificationStatus = verificationManager.getVerificationStatus(user.email);
                
                if (verificationStatus.status === 'pending') {
                    throw new Error(`Your account is pending verification. Application ID: ${verificationStatus.applicationId}. Please wait for approval email.`);
                } else if (verificationStatus.status === 'rejected') {
                    const canReapply = verificationStatus.canReapply ? ' You can reapply after 30 days.' : '';
                    throw new Error(`Your account verification was rejected. Reason: ${verificationStatus.reason}.${canReapply}`);
                } else if (verificationStatus.status === 'not_found') {
                    throw new Error('Account verification required. Please contact support.');
                }
                // If verified, proceed with login
            }
            
            this.currentUser = user;
            localStorage.setItem('mwg_current_user', JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    }

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
                    <h3><i class="fas fa-lock"></i> Authentication Required</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="auth-message">
                        <i class="fas fa-info-circle"></i>
                        <h4>Please register or login to ${action}</h4>
                        <p>Create your account to access all features and connect with verified property owners.</p>
                    </div>
                    <div class="auth-options">
                        <button class="btn primary-btn" onclick="this.closest('.modal').remove(); document.querySelector('#registrationModal').style.display='flex'">
                            <i class="fas fa-user-plus"></i> Register Now
                        </button>
                        <button class="btn secondary-btn" onclick="this.closest('.modal').remove(); document.querySelector('#loginModal').style.display='flex'">
                            <i class="fas fa-sign-in-alt"></i> Login
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
        if (!data.firstName || !data.lastName) {
            throw new Error('First name and last name are required');
        }
        if (!this.isValidEmail(data.email)) {
            throw new Error('Please enter a valid email address');
        }
        if (!data.phone || data.phone.length < 10) {
            throw new Error('Please enter a valid phone number');
        }
        if (!data.faculty || data.faculty.trim().length < 2) {
            throw new Error('Faculty is required and must be at least 2 characters');
        }
        if (!data.department || data.department.trim().length < 2) {
            throw new Error('Department is required and must be at least 2 characters');
        }
        if (!data.yearOfStudy) {
            throw new Error('Year of study is required');
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
            statusIndicator.innerHTML = '🟡 Offline Mode';
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
        localStorage.setItem('mwg_users', JSON.stringify(this.users));
    }
}

// Initialize auth system when DOM is loaded
let authSystem;
document.addEventListener('DOMContentLoaded', () => {
    authSystem = new AuthSystem();
});

// Make it globally available
window.authSystem = authSystem;