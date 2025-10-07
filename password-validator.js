// Password Validation System
class PasswordValidator {
    constructor() {
        this.initializeValidation();
    }

    initializeValidation() {
        // Student password validation
        const studentPassword = document.getElementById('password');
        const studentConfirmPassword = document.getElementById('studentConfirmPassword');
        
        // Realtor password validation
        const realtorPassword = document.getElementById('realtorPassword');
        const realtorConfirmPassword = document.getElementById('confirmPassword');

        if (studentPassword) {
            studentPassword.addEventListener('input', () => {
                this.validatePasswordRequirements(studentPassword.value, 'student');
                if (studentConfirmPassword.value) {
                    this.validatePasswordMatch(studentPassword.value, studentConfirmPassword.value, 'student');
                }
            });
        }

        if (studentConfirmPassword) {
            studentConfirmPassword.addEventListener('input', () => {
                if (studentPassword.value) {
                    this.validatePasswordMatch(studentPassword.value, studentConfirmPassword.value, 'student');
                }
            });
        }

        if (realtorPassword) {
            realtorPassword.addEventListener('input', () => {
                this.validatePasswordRequirements(realtorPassword.value, 'realtor');
                if (realtorConfirmPassword.value) {
                    this.validatePasswordMatch(realtorPassword.value, realtorConfirmPassword.value, 'realtor');
                }
            });
        }

        if (realtorConfirmPassword) {
            realtorConfirmPassword.addEventListener('input', () => {
                if (realtorPassword.value) {
                    this.validatePasswordMatch(realtorPassword.value, realtorConfirmPassword.value, 'realtor');
                }
            });
        }
    }

    validatePasswordRequirements(password, type) {
        const prefix = type === 'realtor' ? 'realtor-' : '';
        
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };

        // Update requirement indicators
        Object.keys(requirements).forEach(req => {
            const element = document.getElementById(`${prefix}${req}-req`);
            if (element) {
                if (requirements[req]) {
                    element.classList.add('valid');
                } else {
                    element.classList.remove('valid');
                }
            }
        });

        return Object.values(requirements).every(req => req);
    }

    validatePasswordMatch(password, confirmPassword, type) {
        const matchElement = document.getElementById(`${type}-password-match`);
        
        if (!matchElement) return;

        if (confirmPassword === '') {
            matchElement.classList.remove('show', 'valid');
            return;
        }

        matchElement.classList.add('show');

        if (password === confirmPassword) {
            matchElement.classList.add('valid');
            matchElement.innerHTML = '<i class="fas fa-check"></i> Passwords match';
        } else {
            matchElement.classList.remove('valid');
            matchElement.innerHTML = '<i class="fas fa-times"></i> Passwords do not match';
        }

        return password === confirmPassword;
    }

    // Public method to check if all password requirements are met
    isPasswordValid(password, confirmPassword, type) {
        const requirementsMet = this.validatePasswordRequirements(password, type);
        const passwordsMatch = this.validatePasswordMatch(password, confirmPassword, type);
        
        return requirementsMet && passwordsMatch;
    }

    // Get password strength score
    getPasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
        
        return {
            score: score,
            strength: this.getStrengthLabel(score)
        };
    }

    getStrengthLabel(score) {
        switch(score) {
            case 0:
            case 1: return 'Very Weak';
            case 2: return 'Weak';
            case 3: return 'Fair';
            case 4: return 'Good';
            case 5: return 'Strong';
            default: return 'Unknown';
        }
    }

    // Enhanced validation with detailed feedback
    validatePasswordWithFeedback(password) {
        const feedback = {
            valid: true,
            messages: [],
            requirements: {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /\d/.test(password),
                special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
            }
        };

        if (!feedback.requirements.length) {
            feedback.valid = false;
            feedback.messages.push('Password must be at least 8 characters long');
        }

        if (!feedback.requirements.uppercase) {
            feedback.valid = false;
            feedback.messages.push('Password must contain at least one uppercase letter');
        }

        if (!feedback.requirements.lowercase) {
            feedback.valid = false;
            feedback.messages.push('Password must contain at least one lowercase letter');
        }

        if (!feedback.requirements.number) {
            feedback.valid = false;
            feedback.messages.push('Password must contain at least one number');
        }

        if (!feedback.requirements.special) {
            feedback.valid = false;
            feedback.messages.push('Password must contain at least one special character');
        }

        return feedback;
    }
}

// Initialize password validator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.passwordValidator = new PasswordValidator();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PasswordValidator;
}