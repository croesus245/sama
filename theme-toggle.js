/* ==============================================
   THEME TOGGLE SYSTEM - PERFECT DARK/LIGHT MODE
   ============================================== */

class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        // Apply initial theme
        this.applyTheme(this.theme);
        
        // Create toggle button
        this.createToggleButton();
        
        // Listen for system theme changes
        this.watchSystemTheme();
        
        console.log('🎨 Theme Manager initialized with theme:', this.theme);
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    storeTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
        this.storeTheme(theme);
        
        // Update meta theme-color
        this.updateMetaThemeColor(theme);
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themechange', { 
            detail: { theme: theme } 
        }));
        
        console.log('🎨 Theme applied:', theme);
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const colors = {
            light: '#3b82f6',
            dark: '#1e293b'
        };
        
        metaThemeColor.content = colors[theme];
    }

    toggleTheme() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        
        // Add visual feedback
        this.animateToggle();
        
        // Show notification
        if (window.notifications) {
            const message = `Switched to ${newTheme} mode`;
            window.notifications.show(message, 'success', 2000);
        }
    }

    animateToggle() {
        const button = document.querySelector('.theme-toggle');
        if (button) {
            button.style.transform = 'scale(0.9) rotate(180deg)';
            setTimeout(() => {
                button.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }
    }

    createToggleButton() {
        // Remove existing button if present
        const existingButton = document.querySelector('.theme-toggle');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.innerHTML = `
            <i class="fas fa-sun icon light-icon" title="Switch to dark mode"></i>
            <i class="fas fa-moon icon dark-icon" title="Switch to light mode"></i>
        `;
        
        button.addEventListener('click', () => this.toggleTheme());
        
        // Add keyboard support
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        document.body.appendChild(button);
    }

    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Public methods for external use
    getCurrentTheme() {
        return this.theme;
    }

    setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.applyTheme(theme);
        }
    }

    resetToSystem() {
        localStorage.removeItem('theme');
        this.applyTheme(this.getSystemTheme());
    }
}

// Enhanced theme utilities
const ThemeUtils = {
    // Get CSS variable value
    getCSSVariable(variable) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(variable).trim();
    },

    // Set CSS variable
    setCSSVariable(variable, value) {
        document.documentElement.style.setProperty(variable, value);
    },

    // Check if dark theme is active
    isDarkTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    },

    // Get theme-appropriate color
    getThemeColor(lightColor, darkColor) {
        return this.isDarkTheme() ? darkColor : lightColor;
    },

    // Apply theme to specific element
    applyThemeToElement(element, styles) {
        const theme = this.isDarkTheme() ? 'dark' : 'light';
        const themeStyles = styles[theme] || styles;
        
        Object.entries(themeStyles).forEach(([property, value]) => {
            element.style[property] = value;
        });
    }
};

// Theme-aware notification system enhancement
class ThemeAwareNotifications {
    constructor() {
        this.container = this.createContainer();
        this.notifications = [];
    }

    createContainer() {
        let container = document.getElementById('theme-notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'theme-notifications';
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 1002;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 4000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.remove(notification), duration);
        }

        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `theme-notification theme-notification-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icons[type] || icons.info}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        notification.style.cssText = `
            background: var(--bg-card);
            color: var(--text-primary);
            border: 1px solid var(--border-primary);
            border-radius: 8px;
            margin-bottom: 0.5rem;
            box-shadow: var(--shadow-medium);
            transform: translateX(100%);
            opacity: 0;
            transition: var(--transition-theme);
            pointer-events: auto;
            min-width: 300px;
            max-width: 400px;
        `;

        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0.25rem;
            margin-left: auto;
            border-radius: 4px;
            transition: var(--transition-theme);
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = 'var(--text-primary)';
            closeBtn.style.background = 'var(--bg-secondary)';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = 'var(--text-muted)';
            closeBtn.style.background = 'transparent';
        });

        return notification;
    }

    remove(notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    clear() {
        this.notifications.forEach(notification => this.remove(notification));
    }
}

// Auto-initialization when DOM is ready
function initializeThemeSystem() {
    // Initialize theme manager
    window.themeManager = new ThemeManager();
    
    // Initialize theme-aware notifications
    window.themeNotifications = new ThemeAwareNotifications();
    
    // Make theme utilities globally available
    window.ThemeUtils = ThemeUtils;
    
    // Add global theme change listener for debugging
    window.addEventListener('themechange', (e) => {
        console.log('🎨 Theme changed to:', e.detail.theme);
    });
    
    // Add keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            window.themeManager.toggleTheme();
        }
    });
    
    console.log('✅ Theme System fully initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThemeSystem);
} else {
    initializeThemeSystem();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, ThemeUtils, ThemeAwareNotifications };
}