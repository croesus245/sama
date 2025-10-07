// ==========================================
// MODAL SYSTEM FOR REGISTRATION & LOGIN
// ==========================================

class ModalSystem {
    constructor() {
        this.initializeModals();
        this.bindEvents();
    }

    initializeModals() {
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    bindEvents() {
        // Student registration form
        const studentForm = document.getElementById('studentRegistrationForm');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => this.handleStudentRegistration(e));
        }

        // Realtor registration form
        const realtorForm = document.getElementById('realtorRegistrationForm');
        if (realtorForm) {
            realtorForm.addEventListener('submit', (e) => this.handleRealtorRegistration(e));
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Show registration requirement popup on page load
        this.showRegistrationRequirement();
    }

    showRegistrationRequirement() {
        // Check if user is already logged in
        const isLoggedIn = localStorage.getItem('userToken') || localStorage.getItem('realtorToken');
        
        if (!isLoggedIn && !sessionStorage.getItem('registrationShown')) {
            setTimeout(() => {
                this.showModal('registrationModal');
                sessionStorage.setItem('registrationShown', 'true');
            }, 2000); // Show after 2 seconds
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('show');
        });
        document.body.style.overflow = '';
    }

    switchToLogin() {
        this.closeAllModals();
        this.showModal('loginModal');
    }

    switchToRegistration() {
        this.closeAllModals();
        this.showModal('registrationModal');
    }

    switchToRealtorModal() {
        this.closeAllModals();
        this.showModal('realtorModal');
    }

    async handleStudentRegistration(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        try {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const studentData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                studentId: formData.get('studentId'),
                faculty: formData.get('faculty'),
                yearOfStudy: formData.get('yearOfStudy'),
                phone: formData.get('phone'),
                password: formData.get('password')
            };

            // Validate password strength
            if (!this.validatePassword(studentData.password)) {
                throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            }

            // Register student via API
            const api = new MWGHostelsAPI();
            const response = await api.registerStudent(studentData);

            if (response.success) {
                this.showSuccessMessage('Registration successful! Please check your email for verification.');
                this.closeModal('registrationModal');
                setTimeout(() => this.showModal('loginModal'), 1000);
            } else {
                throw new Error(response.message || 'Registration failed');
            }

        } catch (error) {
            this.showErrorMessage(error.message);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    async handleRealtorRegistration(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        try {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const realtorData = {
                businessName: formData.get('businessName'),
                firstName: formData.get('contactFirstName'),
                lastName: formData.get('contactLastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                businessRegistrationNumber: formData.get('businessRegistrationNumber'),
                password: formData.get('password')
            };

            // Validate password strength
            if (!this.validatePassword(realtorData.password)) {
                throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            }

            // Register realtor via API
            const api = new MWGHostelsAPI();
            const response = await api.registerRealtor(realtorData);

            if (response.success) {
                this.showSuccessMessage('Realtor registration successful! Please wait for admin approval.');
                this.closeModal('realtorModal');
                setTimeout(() => this.showModal('loginModal'), 1000);
            } else {
                throw new Error(response.message || 'Registration failed');
            }

        } catch (error) {
            this.showErrorMessage(error.message);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        try {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password'),
                rememberMe: formData.get('rememberMe') === 'on'
            };

            // Try login via API
            const api = new MWGHostelsAPI();
            const response = await api.login(loginData);

            if (response.success) {
                // Store token based on user type
                const storage = loginData.rememberMe ? localStorage : sessionStorage;
                
                if (response.user.userType === 'realtor') {
                    storage.setItem('realtorToken', response.token);
                    storage.setItem('realtorData', JSON.stringify(response.user));
                    window.location.href = 'realtor-dashboard.html';
                } else {
                    storage.setItem('userToken', response.token);
                    storage.setItem('userData', JSON.stringify(response.user));
                    window.location.href = 'roommate-finder.html';
                }

                this.closeModal('loginModal');
                this.showSuccessMessage('Login successful! Redirecting...');

            } else {
                throw new Error(response.message || 'Login failed');
            }

        } catch (error) {
            this.showErrorMessage(error.message);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecial;
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    showTerms() {
        alert('Terms of Service will be displayed here. This is a demo version.');
    }

    showPrivacy() {
        alert('Privacy Policy will be displayed here. This is a demo version.');
    }

    showForgotPassword() {
        const email = prompt('Please enter your email address to reset your password:');
        if (email) {
            this.showSuccessMessage('Password reset link sent to your email!');
        }
    }
}

// Global modal functions for HTML onclick events
function openModal(modalId) {
    window.modalSystem.showModal(modalId);
}

function closeModal(modalId) {
    window.modalSystem.closeModal(modalId);
}

function switchToLogin() {
    window.modalSystem.switchToLogin();
}

function switchToRegistration() {
    window.modalSystem.switchToRegistration();
}

function switchToRealtorModal() {
    window.modalSystem.switchToRealtorModal();
}

function showTerms() {
    window.modalSystem.showTerms();
}

function showPrivacy() {
    window.modalSystem.showPrivacy();
}

function showForgotPassword() {
    window.modalSystem.showForgotPassword();
}

// Initialize modal system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modalSystem = new ModalSystem();
});