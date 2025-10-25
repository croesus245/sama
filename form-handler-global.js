/**
 * GLOBAL FORM HANDLER
 * Handles form submission, validation, and API calls across all pages
 * Created: October 25, 2025
 * Purpose: Centralized form management for production deployment
 */

// Form Handler Utility
const FormHandler = {
    /**
     * Validate email
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    /**
     * Validate password
     */
    isValidPassword(password) {
        // Minimum 8 characters, at least one uppercase, one lowercase, one number
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(password);
    },

    /**
     * Validate phone number
     */
    isValidPhone(phone) {
        // Simple phone validation - at least 10 digits
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
    },

    /**
     * Show loading state on button
     */
    setLoading(button, isLoading = true, originalText = null) {
        if (!button) return;
        
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<span class="spinner"></span> Loading...';
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || originalText || 'Submit';
        }
    },

    /**
     * Show alert message
     */
    showAlert(message, type = 'info', duration = 5000) {
        // Try multiple alert methods
        const alertBox = document.getElementById('alertBox') || 
                        document.querySelector('.alert') ||
                        document.querySelector('[role="alert"]');
        
        if (alertBox) {
            alertBox.className = `alert alert-${type} show`;
            alertBox.textContent = message;
            alertBox.style.display = 'block';
            
            if (duration > 0) {
                setTimeout(() => {
                    alertBox.classList.remove('show');
                    alertBox.style.display = 'none';
                }, duration);
            }
        } else {
            // Fallback to browser alert
            console.warn(`Alert (${type}): ${message}`);
            alert(message);
        }
    },

    /**
     * Make API call with error handling
     */
    async makeApiCall(url, method = 'GET', data = null, token = null) {
        try {
            const config = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Add authorization token if provided
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }

            // Add body if data provided
            if (data) {
                config.body = JSON.stringify(data);
            }

            const response = await fetch(url, config);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `HTTP ${response.status}`);
            }

            return responseData;
        } catch (error) {
            console.error(`API Error (${method} ${url}):`, error);
            throw error;
        }
    },

    /**
     * Handle realtor login form
     */
    async handleRealtorLogin(formData, apiURL) {
        const email = formData.get('email')?.trim();
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe') === 'on';

        // Validate
        if (!email || !password) {
            this.showAlert('Please enter both email and password', 'error');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showAlert('Please enter a valid email address', 'error');
            return false;
        }

        try {
            const response = await this.makeApiCall(
                `${apiURL}/realtor-auth/login`,
                'POST',
                { email, password, rememberMe }
            );

            if (response.status === 'success' || response.data?.token) {
                // Store token and user data
                localStorage.setItem('realtorToken', response.data.token);
                localStorage.setItem('realtorData', JSON.stringify(response.data.realtor));
                sessionStorage.setItem('validLogin', 'true');

                this.showAlert('Login successful! Redirecting...', 'success', 2000);
                
                setTimeout(() => {
                    window.location.href = 'enhanced-realtor-dashboard.html';
                }, 2000);

                return true;
            }
        } catch (error) {
            this.showAlert(error.message || 'Login failed. Please try again.', 'error');
            return false;
        }
    },

    /**
     * Handle student login form
     */
    async handleStudentLogin(formData, apiURL) {
        const identifier = formData.get('identifier')?.trim(); // email or matric
        const password = formData.get('password');

        // Validate
        if (!identifier || !password) {
            this.showAlert('Please enter your email/matric and password', 'error');
            return false;
        }

        try {
            const response = await this.makeApiCall(
                `${apiURL}/students/login`,
                'POST',
                { identifier, password }
            );

            if (response.success || response.data?.token) {
                // Store token and user data
                localStorage.setItem('studentToken', response.data.token);
                localStorage.setItem('studentData', JSON.stringify(response.data));
                sessionStorage.setItem('studentLogin', 'true');

                this.showAlert('Login successful! Redirecting...', 'success', 2000);
                
                setTimeout(() => {
                    window.location.href = 'my-applications.html';
                }, 2000);

                return true;
            }
        } catch (error) {
            this.showAlert(error.message || 'Login failed. Please try again.', 'error');
            return false;
        }
    },

    /**
     * Handle hostel application form
     */
    async handleHostelApplication(formData, hostelId, apiURL) {
        try {
            const applicationData = {
                applicationId: `APP-${Date.now()}`,
                hostelId: hostelId,
                studentInfo: {
                    firstName: formData.get('firstName')?.trim(),
                    lastName: formData.get('lastName')?.trim(),
                    email: formData.get('email')?.trim(),
                    phone: formData.get('phone')?.trim(),
                    whatsapp: formData.get('whatsapp')?.trim(),
                    studentId: formData.get('studentId')?.trim(),
                    level: formData.get('level'),
                    department: formData.get('department')?.trim(),
                    graduation: formData.get('graduation')
                },
                accommodation: {
                    roomType: formData.get('roomType'),
                    moveInDate: formData.get('moveInDate'),
                    duration: formData.get('duration'),
                    previousStay: formData.get('previousStay')
                },
                additional: {
                    emergencyContact: formData.get('emergencyContact')?.trim(),
                    additionalInfo: formData.get('additionalInfo')?.trim(),
                    paymentMethod: formData.get('paymentMethod')
                }
            };

            // Validate required fields
            if (!applicationData.studentInfo.firstName || !applicationData.studentInfo.email) {
                this.showAlert('Please fill in all required fields', 'error');
                return false;
            }

            const response = await this.makeApiCall(
                `${apiURL}/applications/submit`,
                'POST',
                { applicationData }
            );

            if (response.success) {
                this.showAlert('Application submitted successfully! The realtor will contact you soon.', 'success', 3000);
                
                setTimeout(() => {
                    window.location.href = 'my-applications.html';
                }, 3000);

                return true;
            }
        } catch (error) {
            this.showAlert(error.message || 'Failed to submit application. Please try again.', 'error');
            return false;
        }
    },

    /**
     * Handle image upload
     */
    async handleImageUpload(file, apiURL, token) {
        try {
            if (!file || !file.type.startsWith('image/')) {
                this.showAlert('Please select a valid image file', 'error');
                return null;
            }

            if (file.size > 5 * 1024 * 1024) {
                this.showAlert('Image size must be less than 5MB', 'error');
                return null;
            }

            const formData = new FormData();
            formData.append('image', file);

            const config = {
                method: 'POST',
                body: formData
            };

            if (token) {
                config.headers = {
                    'Authorization': `Bearer ${token}`
                };
            }

            const response = await fetch(`${apiURL}/upload/image`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            return data.data;
        } catch (error) {
            console.error('Image upload error:', error);
            this.showAlert(error.message || 'Failed to upload image', 'error');
            return null;
        }
    }
};

// Export for use
if (typeof window !== 'undefined') {
    window.FormHandler = FormHandler;
}
