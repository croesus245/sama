class FormValidator {
    static validate(formId) {
        const form = document.getElementById(formId);
        const errors = [];
        
        // Email validation
        const email = form.querySelector('[type="email"]');
        if (email && !this.isValidEmail(email.value)) {
            errors.push('Invalid email format');
            this.showError(email, 'Please enter a valid email');
        }
        
        // Phone validation (Nigerian format)
        const phone = form.querySelector('[type="tel"]');
        if (phone && !this.isValidPhone(phone.value)) {
            errors.push('Invalid phone number');
            this.showError(phone, 'Enter 11-digit Nigerian number (e.g., 08012345678)');
        }
        
        // Required fields
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                errors.push(`${field.name} is required`);
                this.showError(field, 'This field is required');
            }
        });
        
        return errors.length === 0;
    }
    
    static isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    static isValidPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return /^0[789][01]\d{8}$/.test(cleaned);
    }
    
    static showError(field, message) {
        // Remove existing error
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        // Add error message
        const error = document.createElement('span');
        error.className = 'field-error';
        error.textContent = message;
        error.style.color = '#f44336';
        error.style.fontSize = '0.875rem';
        error.style.marginTop = '4px';
        error.style.display = 'block';
        
        field.parentElement.appendChild(error);
        field.style.borderColor = '#f44336';
        
        // Remove error on input
        field.addEventListener('input', function handler() {
            error.remove();
            field.style.borderColor = '';
            field.removeEventListener('input', handler);
        });
    }
}

// Usage
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        if (!FormValidator.validate(form.id)) {
            e.preventDefault();
        }
    });
});