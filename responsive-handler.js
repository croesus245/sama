/**
 * MWG HOSTELS - RESPONSIVE BEHAVIOR HANDLER
 * Handles all responsive interactions, mobile menu, touch events, and device-specific fixes
 * Author: SAMA GREAT
 * Version: 2.0 Production-Ready
 */

(function() {
    'use strict';
    
    // ========================================
    // MOBILE DETECTION & DEVICE INFO
    // ========================================
    
    const ResponsiveHandler = {
        // Device detection
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
        isAndroid: /Android/i.test(navigator.userAgent),
        isTablet: /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent),
        
        // Viewport dimensions
        getViewport: function() {
            return {
                width: window.innerWidth || document.documentElement.clientWidth,
                height: window.innerHeight || document.documentElement.clientHeight
            };
        },
        
        // Check if mobile viewport
        isMobileViewport: function() {
            return this.getViewport().width <= 768;
        },
        
        // Check if tablet viewport
        isTabletViewport: function() {
            const width = this.getViewport().width;
            return width > 768 && width <= 1024;
        },
        
        // Check if desktop viewport
        isDesktopViewport: function() {
            return this.getViewport().width > 1024;
        }
    };
    
    // ========================================
    // MOBILE NAVIGATION HANDLER
    // ========================================
    
    const MobileNavigation = {
        menuOpen: false,
        
        init: function() {
            this.setupMobileToggle();
            this.handleResize();
            this.setupMenuLinks();
            
            // Listen for window resize
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.handleResize();
                }, 250);
            });
        },
        
        setupMobileToggle: function() {
            // Find mobile toggle button (works with both class names)
            const mobileToggle = document.querySelector('.mobile-toggle, .mobile-menu-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (!mobileToggle || !navMenu) return;
            
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMenu();
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.menuOpen && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                    this.closeMenu();
                }
            });
            
            // Prevent clicks inside menu from closing it
            navMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        },
        
        toggleMenu: function() {
            if (this.menuOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        },
        
        openMenu: function() {
            const mobileToggle = document.querySelector('.mobile-toggle, .mobile-menu-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (!mobileToggle || !navMenu) return;
            
            navMenu.classList.add('active');
            mobileToggle.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            this.menuOpen = true;
        },
        
        closeMenu: function() {
            const mobileToggle = document.querySelector('.mobile-toggle, .mobile-menu-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (!mobileToggle || !navMenu) return;
            
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
            this.menuOpen = false;
        },
        
        setupMenuLinks: function() {
            // Close menu when clicking a link on mobile
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (ResponsiveHandler.isMobileViewport()) {
                        this.closeMenu();
                    }
                });
            });
        },
        
        handleResize: function() {
            // Close mobile menu if viewport becomes desktop
            if (!ResponsiveHandler.isMobileViewport() && this.menuOpen) {
                this.closeMenu();
            }
        }
    };
    
    // ========================================
    // MODAL RESPONSIVE HANDLER
    // ========================================
    
    const ModalHandler = {
        init: function() {
            this.setupModalClosing();
            this.preventBackgroundScroll();
            this.setupSwipeToClose();
        },
        
        setupModalClosing: function() {
            // Close modal on overlay click
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal') || e.target.classList.contains('modal-overlay')) {
                    this.closeAllModals();
                }
            });
            
            // Close modal on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAllModals();
                }
            });
        },
        
        closeAllModals: function() {
            const modals = document.querySelectorAll('.modal.active, .modal[style*="display: flex"], .modal[style*="display: block"]');
            modals.forEach(modal => {
                modal.classList.remove('active');
                modal.style.display = 'none';
            });
            document.body.style.overflow = ''; // Restore scroll
        },
        
        preventBackgroundScroll: function() {
            // Observe when modals are opened
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const target = mutation.target;
                        if (target.classList.contains('modal')) {
                            if (target.classList.contains('active')) {
                                document.body.style.overflow = 'hidden';
                            } else {
                                document.body.style.overflow = '';
                            }
                        }
                    }
                });
            });
            
            document.querySelectorAll('.modal').forEach(modal => {
                observer.observe(modal, { attributes: true });
            });
        },
        
        setupSwipeToClose: function() {
            // Swipe down to close on mobile
            let startY = 0;
            let currentY = 0;
            let isDragging = false;
            
            document.addEventListener('touchstart', (e) => {
                const modal = e.target.closest('.modal-content, .modal-container');
                if (modal && ResponsiveHandler.isMobileViewport()) {
                    startY = e.touches[0].clientY;
                    isDragging = true;
                }
            });
            
            document.addEventListener('touchmove', (e) => {
                if (isDragging) {
                    currentY = e.touches[0].clientY;
                    const diff = currentY - startY;
                    
                    // Only allow dragging down
                    if (diff > 0) {
                        const modal = e.target.closest('.modal-content, .modal-container');
                        if (modal) {
                            modal.style.transform = `translateY(${diff}px)`;
                        }
                    }
                }
            });
            
            document.addEventListener('touchend', (e) => {
                if (isDragging) {
                    const diff = currentY - startY;
                    const modal = e.target.closest('.modal-content, .modal-container');
                    
                    if (modal) {
                        // If dragged down more than 150px, close modal
                        if (diff > 150) {
                            this.closeAllModals();
                        } else {
                            // Reset position
                            modal.style.transform = '';
                        }
                    }
                    
                    isDragging = false;
                    startY = 0;
                    currentY = 0;
                }
            });
        }
    };
    
    // ========================================
    // FORM MOBILE OPTIMIZATION
    // ========================================
    
    const FormOptimizer = {
        init: function() {
            this.preventZoomOnFocus();
            this.improveSelectDropdowns();
            this.optimizeTextareas();
            this.addSubmitFeedback();
        },
        
        preventZoomOnFocus: function() {
            // Already handled in CSS with font-size: 16px
            // This is a safety check
            if (ResponsiveHandler.isIOS) {
                const inputs = document.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (window.getComputedStyle(input).fontSize.replace('px', '') < 16) {
                        input.style.fontSize = '16px';
                    }
                });
            }
        },
        
        improveSelectDropdowns: function() {
            // Add touch-friendly styling to select elements
            const selects = document.querySelectorAll('select');
            selects.forEach(select => {
                select.style.webkitAppearance = 'none';
                select.style.appearance = 'none';
            });
        },
        
        optimizeTextareas: function() {
            // Auto-expand textareas on mobile
            const textareas = document.querySelectorAll('textarea');
            textareas.forEach(textarea => {
                textarea.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = (this.scrollHeight) + 'px';
                });
            });
        },
        
        addSubmitFeedback: function() {
            // Add loading state to submit buttons
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    const submitBtn = this.querySelector('button[type="submit"], input[type="submit"]');
                    if (submitBtn && !submitBtn.classList.contains('loading')) {
                        submitBtn.classList.add('loading');
                        submitBtn.disabled = true;
                        
                        // Re-enable after 5 seconds (safety)
                        setTimeout(() => {
                            submitBtn.classList.remove('loading');
                            submitBtn.disabled = false;
                        }, 5000);
                    }
                });
            });
        }
    };
    
    // ========================================
    // IMAGE OPTIMIZATION
    // ========================================
    
    const ImageOptimizer = {
        init: function() {
            this.setupLazyLoading();
            this.handleImageErrors();
            this.optimizeBackgrounds();
        },
        
        setupLazyLoading: function() {
            // Use Intersection Observer for lazy loading
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.classList.add('loaded');
                                observer.unobserve(img);
                            }
                        }
                    });
                });
                
                document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        },
        
        handleImageErrors: function() {
            // Replace broken images with placeholder
            window.addEventListener('error', (e) => {
                if (e.target.tagName === 'IMG') {
                    e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80';
                    e.target.alt = 'Hostel image not available';
                }
            }, true);
        },
        
        optimizeBackgrounds: function() {
            // Use smaller background images on mobile
            if (ResponsiveHandler.isMobileViewport()) {
                const elements = document.querySelectorAll('[style*="background-image"]');
                elements.forEach(el => {
                    const style = el.style.backgroundImage;
                    if (style) {
                        // Replace high-res URLs with mobile-optimized versions
                        const mobileStyle = style.replace(/w=\d+/, 'w=800').replace(/q=\d+/, 'q=60');
                        el.style.backgroundImage = mobileStyle;
                    }
                });
            }
        }
    };
    
    // ========================================
    // SCROLL OPTIMIZATION
    // ========================================
    
    const ScrollOptimizer = {
        init: function() {
            this.smoothScroll();
            this.showScrollTop();
            this.handleScrollEvents();
        },
        
        smoothScroll: function() {
            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href !== '#' && href !== '#!') {
                        const target = document.querySelector(href);
                        if (target) {
                            e.preventDefault();
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }
                });
            });
        },
        
        showScrollTop: function() {
            // Show scroll-to-top button
            const scrollBtn = document.createElement('button');
            scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            scrollBtn.className = 'scroll-to-top';
            scrollBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                border: none;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 998;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            `;
            
            document.body.appendChild(scrollBtn);
            
            // Show/hide based on scroll position
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollBtn.style.opacity = '1';
                    scrollBtn.style.visibility = 'visible';
                } else {
                    scrollBtn.style.opacity = '0';
                    scrollBtn.style.visibility = 'hidden';
                }
            });
            
            // Scroll to top on click
            scrollBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        },
        
        handleScrollEvents: function() {
            let ticking = false;
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        // Add scroll class to navbar
                        const navbar = document.querySelector('.navbar');
                        if (navbar) {
                            if (window.pageYOffset > 50) {
                                navbar.classList.add('scrolled');
                            } else {
                                navbar.classList.remove('scrolled');
                            }
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    };
    
    // ========================================
    // TOUCH GESTURES
    // ========================================
    
    const TouchGestures = {
        init: function() {
            this.setupSwipeGestures();
            this.setupPinchZoom();
        },
        
        setupSwipeGestures: function() {
            // Add swipe detection for carousels/galleries
            let touchStartX = 0;
            let touchEndX = 0;
            
            document.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            document.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX, e.target);
            });
        },
        
        handleSwipe: function(startX, endX, target) {
            const diff = startX - endX;
            const threshold = 50;
            
            // Check if element has swipeable class
            const swipeable = target.closest('.swipeable, .gallery, .carousel');
            if (!swipeable) return;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe left
                    this.triggerSwipeEvent(swipeable, 'left');
                } else {
                    // Swipe right
                    this.triggerSwipeEvent(swipeable, 'right');
                }
            }
        },
        
        triggerSwipeEvent: function(element, direction) {
            const event = new CustomEvent('swipe', {
                detail: { direction: direction }
            });
            element.dispatchEvent(event);
        },
        
        setupPinchZoom: function() {
            // Disable pinch zoom on images in galleries
            document.querySelectorAll('.hostel-image img, .gallery img').forEach(img => {
                img.addEventListener('touchstart', (e) => {
                    if (e.touches.length > 1) {
                        e.preventDefault();
                    }
                });
            });
        }
    };
    
    // ========================================
    // PERFORMANCE MONITOR
    // ========================================
    
    const PerformanceMonitor = {
        init: function() {
            this.monitorPerformance();
            this.reportVitals();
        },
        
        monitorPerformance: function() {
            // Monitor page load performance
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            console.log(`⚡ ${entry.name}: ${entry.duration.toFixed(2)}ms`);
                        }
                    });
                    observer.observe({ entryTypes: ['measure', 'navigation'] });
                } catch (e) {
                    // PerformanceObserver not fully supported
                }
            }
        },
        
        reportVitals: function() {
            // Report Web Vitals
            if ('web-vital' in window) {
                return; // Web Vitals library handles this
            }
            
            // Simple performance logging
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                const renderTime = perfData.domComplete - perfData.domLoading;
                
                console.log('📊 Performance Metrics:');
                console.log(`  - Page Load: ${pageLoadTime}ms`);
                console.log(`  - Connect: ${connectTime}ms`);
                console.log(`  - Render: ${renderTime}ms`);
            });
        }
    };
    
    // ========================================
    // DEVICE ORIENTATION HANDLER
    // ========================================
    
    const OrientationHandler = {
        init: function() {
            this.handleOrientationChange();
            
            window.addEventListener('orientationchange', () => {
                this.handleOrientationChange();
            });
        },
        
        handleOrientationChange: function() {
            const orientation = window.orientation || (window.innerWidth > window.innerHeight ? 90 : 0);
            
            if (Math.abs(orientation) === 90) {
                // Landscape
                document.body.classList.add('landscape');
                document.body.classList.remove('portrait');
            } else {
                // Portrait
                document.body.classList.add('portrait');
                document.body.classList.remove('landscape');
            }
        }
    };
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    function init() {
        console.log('📱 Responsive Handler Initialized');
        console.log(`   Device: ${ResponsiveHandler.isMobile ? 'Mobile' : 'Desktop'}`);
        console.log(`   Viewport: ${ResponsiveHandler.getViewport().width}x${ResponsiveHandler.getViewport().height}`);
        console.log(`   iOS: ${ResponsiveHandler.isIOS}`);
        console.log(`   Android: ${ResponsiveHandler.isAndroid}`);
        
        // Initialize all modules
        MobileNavigation.init();
        ModalHandler.init();
        FormOptimizer.init();
        ImageOptimizer.init();
        ScrollOptimizer.init();
        TouchGestures.init();
        PerformanceMonitor.init();
        OrientationHandler.init();
        
        // Add device classes to body
        if (ResponsiveHandler.isMobile) document.body.classList.add('is-mobile');
        if (ResponsiveHandler.isTablet) document.body.classList.add('is-tablet');
        if (ResponsiveHandler.isIOS) document.body.classList.add('is-ios');
        if (ResponsiveHandler.isAndroid) document.body.classList.add('is-android');
        
        console.log('✅ Responsive Handler Ready');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for global use
    window.ResponsiveHandler = ResponsiveHandler;
    window.MobileNavigation = MobileNavigation;
    window.ModalHandler = ModalHandler;
    
})();
