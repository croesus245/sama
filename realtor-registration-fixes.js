/**
 * Realtor Registration Enhancement Script
 * Fixes form validation, password requirements, and submission issues
 */

document.addEventListener('DOMContentLoaded', function() {
    const realtorPassword = document.getElementById('realtorPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (realtorPassword) {
        // Password requirements validation
        realtorPassword.addEventListener('input', function() {
            const password = this.value;
            const requirements = {
                'realtor-length-req': password.length >= 8,
                'realtor-uppercase-req': /[A-Z]/.test(password),
                'realtor-lowercase-req': /[a-z]/.test(password),
                'realtor-number-req': /\d/.test(password),
                'realtor-special-req': /[@$!%*?&]/.test(password)
            };
            
            // Update requirement indicators
            Object.keys(requirements).forEach(reqId => {
                const element = document.getElementById(reqId);
                if (element) {
                    const icon = element.querySelector('i');
                    if (requirements[reqId]) {
                        element.classList.add('valid');
                        icon.className = 'fas fa-check';
                    } else {
                        element.classList.remove('valid');
                        icon.className = 'fas fa-times';
                    }
                }
            });
            
            // Check password match if confirm password has value
            if (confirmPassword && confirmPassword.value) {
                checkPasswordMatch();
            }
        });
    }
    
    if (confirmPassword) {
        confirmPassword.addEventListener('input', checkPasswordMatch);
    }
    
    function checkPasswordMatch() {
        const password = realtorPassword ? realtorPassword.value : '';
        const confirm = confirmPassword ? confirmPassword.value : '';
        const matchIndicator = document.getElementById('realtor-password-match');
        
        if (matchIndicator) {
            const icon = matchIndicator.querySelector('i');
            if (password && confirm) {
                if (password === confirm) {
                    matchIndicator.classList.add('valid');
                    matchIndicator.innerHTML = '<i class="fas fa-check"></i> Passwords match';
                } else {
                    matchIndicator.classList.remove('valid');
                    matchIndicator.innerHTML = '<i class="fas fa-times"></i> Passwords do not match';
                }
                matchIndicator.style.display = 'block';
            } else {
                matchIndicator.style.display = 'none';
            }
        }
    }
    
    // Phone number formatting
    const businessPhone = document.getElementById('businessPhone');
    if (businessPhone) {
        businessPhone.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.startsWith('234')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                value = '+234' + value.substring(1);
            } else if (!value.startsWith('+')) {
                value = '+234' + value;
            }
            this.value = value;
        });
    }
    
    // Form submission enhancement
    const realtorForm = document.getElementById('realtorRegistrationForm');
    if (realtorForm) {
        realtorForm.addEventListener('submit', function(e) {
            // Additional client-side validation
            const businessName = document.getElementById('businessName');
            const contactFirstName = document.getElementById('contactFirstName');
            const realtorEmail = document.getElementById('realtorEmail');
            const agreeTerms = document.getElementById('agreeRealtorTerms');
            
            // Check if required fields are filled
            const requiredFields = [businessName, contactFirstName, realtorEmail];
            for (let field of requiredFields) {
                if (field && !field.value.trim()) {
                    e.preventDefault();
                    field.focus();
                    showErrorMessage(`${field.labels[0].textContent} is required`);
                    return;
                }
            }
            
            // Check terms agreement
            if (agreeTerms && !agreeTerms.checked) {
                e.preventDefault();
                agreeTerms.focus();
                showErrorMessage('You must agree to the terms and conditions');
                return;
            }
            
            // Check password requirements
            if (realtorPassword && !isPasswordValid(realtorPassword.value)) {
                e.preventDefault();
                realtorPassword.focus();
                showErrorMessage('Password does not meet all requirements');
                return;
            }
            
            // Check password match
            if (realtorPassword && confirmPassword && realtorPassword.value !== confirmPassword.value) {
                e.preventDefault();
                confirmPassword.focus();
                showErrorMessage('Passwords do not match');
                return;
            }
        });
    }
    
    function isPasswordValid(password) {
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /[a-z]/.test(password) &&
               /\d/.test(password) &&
               /[@$!%*?&]/.test(password);
    }
    
    function showErrorMessage(message) {
        // Create or update error message display
        let errorDiv = document.querySelector('.realtor-error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'realtor-error-message error-message';
            if (realtorForm) {
                realtorForm.insertBefore(errorDiv, realtorForm.firstChild);
            }
        }
        
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        errorDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        }, 5000);
    }
});

// Terms and conditions display
function showRealtorTerms() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <h2><i class="fas fa-file-contract"></i> Realtor Terms & Conditions</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <h3>1. Business Registration</h3>
                <p>All realtors must provide valid business information and documentation for verification purposes.</p>
                
                <h3>2. Verification Process</h3>
                <p>Your application will be reviewed within 24-48 hours. Required documents include:</p>
                <ul>
                    <li>Valid business registration documents</li>
                    <li>Business address verification</li>
                    <li>Contact person identification</li>
                </ul>
                
                <h3>3. Listing Standards</h3>
                <p>All property listings must be accurate, current, and include real photos. False or misleading information will result in account suspension.</p>
                
                <h3>4. Student Safety</h3>
                <p>Properties must meet basic safety and habitability standards. Regular inspections may be conducted.</p>
                
                <h3>5. Fee Structure</h3>
                <p>Commission and platform fees will be clearly communicated and agreed upon before activation.</p>
                
                <h3>6. Code of Conduct</h3>
                <p>Professional behavior is required in all interactions with students and platform staff.</p>
                
                <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <strong>By registering, you agree to these terms and confirm that all information provided is accurate and truthful.</strong>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// Switch to login modal
function switchToLogin() {
    const realtorModal = document.getElementById('realtorModal');
    const loginModal = document.getElementById('loginModal');
    
    if (realtorModal) {
        realtorModal.style.display = 'none';
    }
    if (loginModal) {
        loginModal.style.display = 'flex';
    }
}