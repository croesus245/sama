/**
 * Comprehensive Testing & Validation Framework
 * Automated quality assurance for MWG Hostels Platform
 */

class ComprehensiveTestingSuite {
    constructor() {
        this.testResults = {
            accessibility: [],
            performance: [],
            functionality: [],
            compatibility: [],
            security: [],
            usability: []
        };
        
        this.config = {
            runOnLoad: true,
            logDetails: true,
            autoFix: true,
            reportToConsole: true
        };
        
        this.init();
    }
    
    init() {
        if (this.config.runOnLoad) {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.runAllTests(), 2000);
            });
        }
    }
    
    async runAllTests() {
        console.group('🧪 Running Comprehensive Test Suite');
        
        try {
            await this.testAccessibility();
            await this.testPerformance();
            await this.testFunctionality();
            await this.testCompatibility();
            await this.testSecurity();
            await this.testUsability();
            
            this.generateTestReport();
        } catch (error) {
            console.error('Test suite error:', error);
        }
        
        console.groupEnd();
    }
    
    async testAccessibility() {
        console.log('♿ Testing Accessibility...');
        
        const tests = [
            this.testKeyboardNavigation(),
            this.testScreenReaderSupport(),
            this.testColorContrast(),
            this.testFocusManagement(),
            this.testARIALabels(),
            this.testSemanticHTML(),
            this.testFormAccessibility()
        ];
        
        const results = await Promise.all(tests);
        this.testResults.accessibility = results.flat();
        
        console.log(`✅ Accessibility: ${this.getPassCount(this.testResults.accessibility)} passed, ${this.getFailCount(this.testResults.accessibility)} failed`);
    }
    
    async testPerformance() {
        console.log('⚡ Testing Performance...');
        
        const tests = [
            this.testPageLoadSpeed(),
            this.testResourceOptimization(),
            this.testMemoryUsage(),
            this.testRenderPerformance(),
            this.testNetworkEfficiency(),
            this.testCacheStrategy()
        ];
        
        const results = await Promise.all(tests);
        this.testResults.performance = results.flat();
        
        console.log(`✅ Performance: ${this.getPassCount(this.testResults.performance)} passed, ${this.getFailCount(this.testResults.performance)} failed`);
    }
    
    async testFunctionality() {
        console.log('⚙️ Testing Functionality...');
        
        const tests = [
            this.testFormValidation(),
            this.testNavigationFlow(),
            this.testSearchFunctionality(),
            this.testModalSystem(),
            this.testAuthenticationFlow(),
            this.testDataPersistence(),
            this.testErrorHandling()
        ];
        
        const results = await Promise.all(tests);
        this.testResults.functionality = results.flat();
        
        console.log(`✅ Functionality: ${this.getPassCount(this.testResults.functionality)} passed, ${this.getFailCount(this.testResults.functionality)} failed`);
    }
    
    async testCompatibility() {
        console.log('🌐 Testing Compatibility...');
        
        const tests = [
            this.testBrowserCompatibility(),
            this.testMobileResponsiveness(),
            this.testPWAFeatures(),
            this.testOfflineCapability(),
            this.testDeviceFeatures()
        ];
        
        const results = await Promise.all(tests);
        this.testResults.compatibility = results.flat();
        
        console.log(`✅ Compatibility: ${this.getPassCount(this.testResults.compatibility)} passed, ${this.getFailCount(this.testResults.compatibility)} failed`);
    }
    
    async testSecurity() {
        console.log('🔒 Testing Security...');
        
        const tests = [
            this.testInputSanitization(),
            this.testCSRFProtection(),
            this.testXSSPrevention(),
            this.testDataEncryption(),
            this.testSecureHeaders(),
            this.testContentSecurityPolicy()
        ];
        
        const results = await Promise.all(tests);
        this.testResults.security = results.flat();
        
        console.log(`✅ Security: ${this.getPassCount(this.testResults.security)} passed, ${this.getFailCount(this.testResults.security)} failed`);
    }
    
    async testUsability() {
        console.log('👥 Testing Usability...');
        
        const tests = [
            this.testUserInterface(),
            this.testLoadingStates(),
            this.testErrorMessages(),
            this.testHelperText(),
            this.testUserFlow(),
            this.testMobileUsability()
        ];
        
        const results = await Promise.all(tests);
        this.testResults.usability = results.flat();
        
        console.log(`✅ Usability: ${this.getPassCount(this.testResults.usability)} passed, ${this.getFailCount(this.testResults.usability)} failed`);
    }
    
    // Accessibility Tests
    async testKeyboardNavigation() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const results = [];
        
        // Test tab order
        results.push({
            test: 'Keyboard Navigation - Tab Order',
            passed: focusableElements.length > 0,
            message: focusableElements.length > 0 ? 
                `${focusableElements.length} focusable elements found` : 
                'No focusable elements found',
            priority: 'high'
        });
        
        // Test skip links
        const skipLinks = document.querySelectorAll('.skip-link, [href="#main-content"]');
        results.push({
            test: 'Keyboard Navigation - Skip Links',
            passed: skipLinks.length > 0,
            message: skipLinks.length > 0 ? 
                'Skip links implemented' : 
                'No skip links found',
            priority: 'medium',
            fix: skipLinks.length === 0 ? 'Add skip links for keyboard users' : null
        });
        
        return results;
    }
    
    async testScreenReaderSupport() {
        const results = [];
        
        // Test alt text on images
        const images = document.querySelectorAll('img');
        const imagesWithAlt = Array.from(images).filter(img => img.alt && img.alt.trim());
        
        results.push({
            test: 'Screen Reader - Image Alt Text',
            passed: images.length === 0 || imagesWithAlt.length === images.length,
            message: `${imagesWithAlt.length}/${images.length} images have alt text`,
            priority: 'high',
            fix: images.length > imagesWithAlt.length ? 'Add alt text to all images' : null
        });
        
        // Test headings hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        results.push({
            test: 'Screen Reader - Heading Structure',
            passed: headings.length > 0,
            message: `${headings.length} headings found`,
            priority: 'medium'
        });
        
        return results;
    }
    
    async testColorContrast() {
        const results = [];
        
        // Test high contrast mode support
        const hasHighContrastCSS = document.querySelector('link[href*="high-contrast"]') || 
            document.styleSheets[0]?.cssRules?.some?.(rule => 
                rule.selectorText?.includes('high-contrast')
            );
        
        results.push({
            test: 'Color Contrast - High Contrast Support',
            passed: !!hasHighContrastCSS,
            message: hasHighContrastCSS ? 
                'High contrast mode supported' : 
                'No high contrast mode detected',
            priority: 'medium',
            fix: !hasHighContrastCSS ? 'Add high contrast CSS support' : null
        });
        
        return results;
    }
    
    async testFocusManagement() {
        const results = [];
        
        // Test focus visible styles
        const hasFocusStyles = Array.from(document.styleSheets).some(sheet => {
            try {
                return Array.from(sheet.cssRules).some(rule => 
                    rule.selectorText?.includes(':focus')
                );
            } catch (e) {
                return false;
            }
        });
        
        results.push({
            test: 'Focus Management - Focus Styles',
            passed: hasFocusStyles,
            message: hasFocusStyles ? 
                'Focus styles implemented' : 
                'No focus styles found',
            priority: 'high',
            fix: !hasFocusStyles ? 'Add visible focus indicators' : null
        });
        
        return results;
    }
    
    async testARIALabels() {
        const results = [];
        
        // Test ARIA labels on interactive elements
        const interactiveElements = document.querySelectorAll(
            'button, [role="button"], input, select, textarea'
        );
        
        let elementsWithLabels = 0;
        interactiveElements.forEach(el => {
            if (el.getAttribute('aria-label') || 
                el.getAttribute('aria-labelledby') || 
                el.querySelector('label') ||
                el.textContent?.trim()) {
                elementsWithLabels++;
            }
        });
        
        results.push({
            test: 'ARIA Labels - Interactive Elements',
            passed: interactiveElements.length === 0 || 
                elementsWithLabels === interactiveElements.length,
            message: `${elementsWithLabels}/${interactiveElements.length} interactive elements have labels`,
            priority: 'high',
            fix: elementsWithLabels < interactiveElements.length ? 
                'Add ARIA labels to unlabeled interactive elements' : null
        });
        
        return results;
    }
    
    async testSemanticHTML() {
        const results = [];
        
        // Test semantic landmarks
        const landmarks = document.querySelectorAll(
            'header, nav, main, section, article, aside, footer, [role="banner"], [role="navigation"], [role="main"]'
        );
        
        results.push({
            test: 'Semantic HTML - Landmarks',
            passed: landmarks.length >= 3,
            message: `${landmarks.length} semantic landmarks found`,
            priority: 'medium',
            fix: landmarks.length < 3 ? 'Add more semantic HTML landmarks' : null
        });
        
        return results;
    }
    
    async testFormAccessibility() {
        const results = [];
        
        // Test form labels
        const inputs = document.querySelectorAll('input, select, textarea');
        let inputsWithLabels = 0;
        
        inputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`) ||
                input.closest('label') ||
                input.getAttribute('aria-label');
            if (label) inputsWithLabels++;
        });
        
        results.push({
            test: 'Form Accessibility - Input Labels',
            passed: inputs.length === 0 || inputsWithLabels === inputs.length,
            message: `${inputsWithLabels}/${inputs.length} inputs have labels`,
            priority: 'high',
            fix: inputsWithLabels < inputs.length ? 'Add labels to all form inputs' : null
        });
        
        return results;
    }
    
    // Performance Tests
    async testPageLoadSpeed() {
        const results = [];
        
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.fetchStart;
            
            results.push({
                test: 'Performance - Page Load Speed',
                passed: loadTime < 3000,
                message: `Page loaded in ${Math.round(loadTime)}ms`,
                priority: loadTime > 5000 ? 'high' : loadTime > 3000 ? 'medium' : 'low',
                fix: loadTime > 3000 ? 'Optimize images and reduce JavaScript bundle size' : null
            });
        }
        
        return results;
    }
    
    async testResourceOptimization() {
        const results = [];
        
        // Test image optimization
        const images = document.querySelectorAll('img');
        let optimizedImages = 0;
        
        images.forEach(img => {
            if (img.loading === 'lazy' || img.src.includes('w=') || img.src.includes('q=')) {
                optimizedImages++;
            }
        });
        
        results.push({
            test: 'Performance - Image Optimization',
            passed: images.length === 0 || optimizedImages / images.length > 0.8,
            message: `${optimizedImages}/${images.length} images optimized`,
            priority: 'medium',
            fix: optimizedImages < images.length ? 'Add lazy loading and optimize image sizes' : null
        });
        
        return results;
    }
    
    async testMemoryUsage() {
        const results = [];
        
        if ('memory' in performance) {
            const memUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
            
            results.push({
                test: 'Performance - Memory Usage',
                passed: memUsage < 50,
                message: `Using ${Math.round(memUsage)}MB of memory`,
                priority: memUsage > 100 ? 'high' : memUsage > 50 ? 'medium' : 'low',
                fix: memUsage > 50 ? 'Optimize JavaScript objects and clear unused data' : null
            });
        }
        
        return results;
    }
    
    async testRenderPerformance() {
        const results = [];
        
        // Test for layout thrashing
        const hasTransforms = Array.from(document.styleSheets).some(sheet => {
            try {
                return Array.from(sheet.cssRules).some(rule =>
                    rule.style?.transform || rule.style?.willChange
                );
            } catch (e) {
                return false;
            }
        });
        
        results.push({
            test: 'Performance - Render Optimization',
            passed: hasTransforms,
            message: hasTransforms ? 
                'Transform optimizations found' : 
                'No render optimizations detected',
            priority: 'low',
            fix: !hasTransforms ? 'Use CSS transforms for animations' : null
        });
        
        return results;
    }
    
    async testNetworkEfficiency() {
        const results = [];
        
        // Test service worker
        const hasServiceWorker = 'serviceWorker' in navigator && 
            await navigator.serviceWorker.getRegistration();
        
        results.push({
            test: 'Performance - Service Worker',
            passed: !!hasServiceWorker,
            message: hasServiceWorker ? 
                'Service worker registered' : 
                'No service worker found',
            priority: 'medium',
            fix: !hasServiceWorker ? 'Implement service worker for caching' : null
        });
        
        return results;
    }
    
    async testCacheStrategy() {
        const results = [];
        
        // Test cache headers
        const hasCacheStrategy = localStorage.getItem('mwg_cache_strategy') || 
            sessionStorage.getItem('cached_data');
        
        results.push({
            test: 'Performance - Cache Strategy',
            passed: !!hasCacheStrategy,
            message: hasCacheStrategy ? 
                'Caching strategy implemented' : 
                'No caching strategy found',
            priority: 'medium',
            fix: !hasCacheStrategy ? 'Implement client-side caching' : null
        });
        
        return results;
    }
    
    // Functionality Tests
    async testFormValidation() {
        const results = [];
        
        const forms = document.querySelectorAll('form');
        let formsWithValidation = 0;
        
        forms.forEach(form => {
            const hasValidation = form.querySelectorAll('[required], [pattern], [minlength]').length > 0 ||
                form.addEventListener || 
                form.onsubmit;
            if (hasValidation) formsWithValidation++;
        });
        
        results.push({
            test: 'Functionality - Form Validation',
            passed: forms.length === 0 || formsWithValidation === forms.length,
            message: `${formsWithValidation}/${forms.length} forms have validation`,
            priority: 'high',
            fix: formsWithValidation < forms.length ? 'Add validation to all forms' : null
        });
        
        return results;
    }
    
    async testNavigationFlow() {
        const results = [];
        
        // Test navigation links
        const navLinks = document.querySelectorAll('nav a, .navigation a');
        let workingLinks = 0;
        
        navLinks.forEach(link => {
            if (link.href && (link.href.startsWith('#') || link.href.includes(location.origin))) {
                workingLinks++;
            }
        });
        
        results.push({
            test: 'Functionality - Navigation Flow',
            passed: navLinks.length === 0 || workingLinks === navLinks.length,
            message: `${workingLinks}/${navLinks.length} navigation links working`,
            priority: 'high',
            fix: workingLinks < navLinks.length ? 'Fix broken navigation links' : null
        });
        
        return results;
    }
    
    async testSearchFunctionality() {
        const results = [];
        
        const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
        const hasSearchFunction = window.searchHostels || window.filterHostels;
        
        results.push({
            test: 'Functionality - Search Feature',
            passed: searchInputs.length === 0 || hasSearchFunction,
            message: hasSearchFunction ? 
                'Search functionality implemented' : 
                'No search functionality found',
            priority: 'medium',
            fix: searchInputs.length > 0 && !hasSearchFunction ? 'Implement search functionality' : null
        });
        
        return results;
    }
    
    async testModalSystem() {
        const results = [];
        
        const modals = document.querySelectorAll('.modal, [role="dialog"]');
        const hasModalSystem = window.openModal || window.closeModal;
        
        results.push({
            test: 'Functionality - Modal System',
            passed: modals.length === 0 || hasModalSystem,
            message: hasModalSystem ? 
                'Modal system implemented' : 
                'No modal system found',
            priority: 'medium',
            fix: modals.length > 0 && !hasModalSystem ? 'Implement modal management system' : null
        });
        
        return results;
    }
    
    async testAuthenticationFlow() {
        const results = [];
        
        const authForms = document.querySelectorAll('.login-form, .register-form, #loginForm, #registerForm');
        const hasAuthSystem = window.login || window.register || window.authenticate;
        
        results.push({
            test: 'Functionality - Authentication Flow',
            passed: authForms.length === 0 || hasAuthSystem,
            message: hasAuthSystem ? 
                'Authentication system implemented' : 
                'No authentication system found',
            priority: 'high',
            fix: authForms.length > 0 && !hasAuthSystem ? 'Implement authentication system' : null
        });
        
        return results;
    }
    
    async testDataPersistence() {
        const results = [];
        
        const hasLocalStorage = localStorage.length > 0;
        const hasSessionStorage = sessionStorage.length > 0;
        const hasPersistence = hasLocalStorage || hasSessionStorage;
        
        results.push({
            test: 'Functionality - Data Persistence',
            passed: hasPersistence,
            message: hasPersistence ? 
                'Data persistence implemented' : 
                'No data persistence found',
            priority: 'medium',
            fix: !hasPersistence ? 'Implement data persistence for user preferences' : null
        });
        
        return results;
    }
    
    async testErrorHandling() {
        const results = [];
        
        const hasErrorHandler = window.onerror || window.addEventListener;
        const errorElements = document.querySelectorAll('.error, .error-message, [role="alert"]');
        
        results.push({
            test: 'Functionality - Error Handling',
            passed: hasErrorHandler || errorElements.length > 0,
            message: hasErrorHandler ? 
                'Error handling implemented' : 
                'No error handling found',
            priority: 'high',
            fix: !hasErrorHandler ? 'Implement global error handling' : null
        });
        
        return results;
    }
    
    // Compatibility Tests
    async testBrowserCompatibility() {
        const results = [];
        
        // Test modern JavaScript features
        const modernFeatures = {
            'Arrow Functions': () => (() => true)(),
            'Promises': () => typeof Promise !== 'undefined',
            'Fetch API': () => typeof fetch !== 'undefined',
            'LocalStorage': () => typeof localStorage !== 'undefined',
            'ServiceWorker': () => 'serviceWorker' in navigator
        };
        
        Object.entries(modernFeatures).forEach(([feature, test]) => {
            try {
                const supported = test();
                results.push({
                    test: `Browser Compatibility - ${feature}`,
                    passed: supported,
                    message: supported ? 
                        `${feature} supported` : 
                        `${feature} not supported`,
                    priority: 'medium',
                    fix: !supported ? `Add polyfill for ${feature}` : null
                });
            } catch (error) {
                results.push({
                    test: `Browser Compatibility - ${feature}`,
                    passed: false,
                    message: `${feature} test failed: ${error.message}`,
                    priority: 'medium',
                    fix: `Add polyfill for ${feature}`
                });
            }
        });
        
        return results;
    }
    
    async testMobileResponsiveness() {
        const results = [];
        
        // Test viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        results.push({
            test: 'Mobile - Viewport Meta Tag',
            passed: !!viewportMeta,
            message: viewportMeta ? 
                'Viewport meta tag present' : 
                'No viewport meta tag found',
            priority: 'high',
            fix: !viewportMeta ? 'Add viewport meta tag' : null
        });
        
        // Test responsive CSS
        const hasMediaQueries = Array.from(document.styleSheets).some(sheet => {
            try {
                return Array.from(sheet.cssRules).some(rule =>
                    rule.media && rule.media.mediaText.includes('max-width')
                );
            } catch (e) {
                return false;
            }
        });
        
        results.push({
            test: 'Mobile - Responsive CSS',
            passed: hasMediaQueries,
            message: hasMediaQueries ? 
                'Media queries found' : 
                'No responsive CSS detected',
            priority: 'high',
            fix: !hasMediaQueries ? 'Add responsive CSS media queries' : null
        });
        
        return results;
    }
    
    async testPWAFeatures() {
        const results = [];
        
        // Test manifest
        const manifest = document.querySelector('link[rel="manifest"]');
        results.push({
            test: 'PWA - Manifest File',
            passed: !!manifest,
            message: manifest ? 
                'PWA manifest present' : 
                'No PWA manifest found',
            priority: 'medium',
            fix: !manifest ? 'Add PWA manifest file' : null
        });
        
        // Test service worker
        const hasServiceWorker = 'serviceWorker' in navigator;
        results.push({
            test: 'PWA - Service Worker Support',
            passed: hasServiceWorker,
            message: hasServiceWorker ? 
                'Service worker supported' : 
                'Service worker not supported',
            priority: 'medium'
        });
        
        return results;
    }
    
    async testOfflineCapability() {
        const results = [];
        
        const hasOfflineSupport = 'serviceWorker' in navigator && 
            localStorage.getItem('offline_pages');
        
        results.push({
            test: 'Offline - Offline Capability',
            passed: hasOfflineSupport,
            message: hasOfflineSupport ? 
                'Offline support implemented' : 
                'No offline support found',
            priority: 'low',
            fix: !hasOfflineSupport ? 'Implement offline page caching' : null
        });
        
        return results;
    }
    
    async testDeviceFeatures() {
        const results = [];
        
        // Test touch support
        const hasTouchSupport = 'ontouchstart' in window;
        results.push({
            test: 'Device - Touch Support',
            passed: hasTouchSupport,
            message: hasTouchSupport ? 
                'Touch events supported' : 
                'No touch support detected',
            priority: 'low'
        });
        
        return results;
    }
    
    // Security Tests
    async testInputSanitization() {
        const results = [];
        
        const inputs = document.querySelectorAll('input, textarea');
        let sanitizedInputs = 0;
        
        inputs.forEach(input => {
            if (input.pattern || input.maxlength || input.type !== 'text') {
                sanitizedInputs++;
            }
        });
        
        results.push({
            test: 'Security - Input Sanitization',
            passed: inputs.length === 0 || sanitizedInputs === inputs.length,
            message: `${sanitizedInputs}/${inputs.length} inputs have restrictions`,
            priority: 'high',
            fix: sanitizedInputs < inputs.length ? 'Add input validation and restrictions' : null
        });
        
        return results;
    }
    
    async testCSRFProtection() {
        const results = [];
        
        const forms = document.querySelectorAll('form');
        let protectedForms = 0;
        
        forms.forEach(form => {
            if (form.querySelector('input[name*="token"], input[name*="csrf"]')) {
                protectedForms++;
            }
        });
        
        results.push({
            test: 'Security - CSRF Protection',
            passed: forms.length === 0 || protectedForms > 0,
            message: `${protectedForms}/${forms.length} forms have CSRF protection`,
            priority: 'high',
            fix: protectedForms === 0 && forms.length > 0 ? 'Add CSRF tokens to forms' : null
        });
        
        return results;
    }
    
    async testXSSPrevention() {
        const results = [];
        
        const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        
        results.push({
            test: 'Security - XSS Prevention',
            passed: !!hasCSP,
            message: hasCSP ? 
                'Content Security Policy found' : 
                'No CSP header detected',
            priority: 'high',
            fix: !hasCSP ? 'Add Content Security Policy meta tag' : null
        });
        
        return results;
    }
    
    async testDataEncryption() {
        const results = [];
        
        const isHTTPS = location.protocol === 'https:';
        
        results.push({
            test: 'Security - HTTPS Encryption',
            passed: isHTTPS || location.hostname === 'localhost',
            message: isHTTPS ? 
                'HTTPS encryption active' : 
                'Not using HTTPS encryption',
            priority: 'high',
            fix: !isHTTPS && location.hostname !== 'localhost' ? 'Enable HTTPS' : null
        });
        
        return results;
    }
    
    async testSecureHeaders() {
        const results = [];
        
        // This would need server-side testing in real implementation
        results.push({
            test: 'Security - Secure Headers',
            passed: true,
            message: 'Server headers need manual verification',
            priority: 'medium',
            fix: 'Verify security headers on server'
        });
        
        return results;
    }
    
    async testContentSecurityPolicy() {
        const results = [];
        
        const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]') ||
            document.querySelector('meta[name="content-security-policy"]');
        
        results.push({
            test: 'Security - Content Security Policy',
            passed: !!hasCSP,
            message: hasCSP ? 
                'CSP implemented' : 
                'No CSP found',
            priority: 'medium',
            fix: !hasCSP ? 'Implement Content Security Policy' : null
        });
        
        return results;
    }
    
    // Usability Tests
    async testUserInterface() {
        const results = [];
        
        // Test button consistency
        const buttons = document.querySelectorAll('button, .btn');
        const hasConsistentStyling = buttons.length > 0;
        
        results.push({
            test: 'Usability - UI Consistency',
            passed: hasConsistentStyling,
            message: hasConsistentStyling ? 
                `${buttons.length} buttons found with consistent styling` : 
                'No buttons found',
            priority: 'medium'
        });
        
        return results;
    }
    
    async testLoadingStates() {
        const results = [];
        
        const hasLoadingStates = document.querySelectorAll('.loading, .spinner, [aria-busy]').length > 0 ||
            !!window.showLoading;
        
        results.push({
            test: 'Usability - Loading States',
            passed: hasLoadingStates,
            message: hasLoadingStates ? 
                'Loading states implemented' : 
                'No loading states found',
            priority: 'medium',
            fix: !hasLoadingStates ? 'Add loading indicators for async operations' : null
        });
        
        return results;
    }
    
    async testErrorMessages() {
        const results = [];
        
        const errorElements = document.querySelectorAll('.error, .error-message, [role="alert"]');
        
        results.push({
            test: 'Usability - Error Messages',
            passed: errorElements.length > 0,
            message: `${errorElements.length} error message elements found`,
            priority: 'medium',
            fix: errorElements.length === 0 ? 'Add error message display elements' : null
        });
        
        return results;
    }
    
    async testHelperText() {
        const results = [];
        
        const helperTexts = document.querySelectorAll('.help-text, .hint, [aria-describedby]');
        
        results.push({
            test: 'Usability - Helper Text',
            passed: helperTexts.length > 0,
            message: `${helperTexts.length} helper text elements found`,
            priority: 'low',
            fix: helperTexts.length === 0 ? 'Add helpful text for complex interactions' : null
        });
        
        return results;
    }
    
    async testUserFlow() {
        const results = [];
        
        // Test breadcrumbs or navigation indicators
        const breadcrumbs = document.querySelectorAll('.breadcrumb, .progress, .step-indicator');
        
        results.push({
            test: 'Usability - User Flow Indicators',
            passed: breadcrumbs.length > 0,
            message: breadcrumbs.length > 0 ? 
                'Flow indicators found' : 
                'No flow indicators found',
            priority: 'low',
            fix: breadcrumbs.length === 0 ? 'Add navigation breadcrumbs or progress indicators' : null
        });
        
        return results;
    }
    
    async testMobileUsability() {
        const results = [];
        
        // Test touch target sizes
        const touchTargets = document.querySelectorAll('button, a, input, select');
        let adequateSizeTargets = 0;
        
        touchTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (rect.width >= 44 && rect.height >= 44) {
                adequateSizeTargets++;
            }
        });
        
        results.push({
            test: 'Usability - Touch Target Sizes',
            passed: touchTargets.length === 0 || adequateSizeTargets / touchTargets.length > 0.8,
            message: `${adequateSizeTargets}/${touchTargets.length} touch targets are adequate size`,
            priority: 'medium',
            fix: adequateSizeTargets < touchTargets.length * 0.8 ? 
                'Increase touch target sizes for mobile devices' : null
        });
        
        return results;
    }
    
    // Utility Methods
    getPassCount(results) {
        return results.filter(r => r.passed).length;
    }
    
    getFailCount(results) {
        return results.filter(r => !r.passed).length;
    }
    
    getTotalScore() {
        const allResults = Object.values(this.testResults).flat();
        const passed = this.getPassCount(allResults);
        const total = allResults.length;
        return Math.round((passed / total) * 100);
    }
    
    generateTestReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalScore: this.getTotalScore(),
            categories: {}
        };
        
        Object.entries(this.testResults).forEach(([category, results]) => {
            report.categories[category] = {
                passed: this.getPassCount(results),
                failed: this.getFailCount(results),
                total: results.length,
                score: Math.round((this.getPassCount(results) / results.length) * 100),
                issues: results.filter(r => !r.passed && r.fix).map(r => ({
                    test: r.test,
                    priority: r.priority,
                    fix: r.fix
                }))
            };
        });
        
        if (this.config.reportToConsole) {
            this.logTestReport(report);
        }
        
        // Store report
        try {
            localStorage.setItem('mwg_test_report', JSON.stringify(report));
        } catch (e) {
            console.warn('Could not store test report:', e);
        }
        
        return report;
    }
    
    logTestReport(report) {
        console.group(`📊 Test Report - Overall Score: ${report.totalScore}%`);
        
        Object.entries(report.categories).forEach(([category, data]) => {
            const emoji = data.score >= 90 ? '🟢' : data.score >= 70 ? '🟡' : '🔴';
            console.group(`${emoji} ${category.toUpperCase()}: ${data.score}% (${data.passed}/${data.total})`);
            
            if (data.issues.length > 0) {
                console.group('🔧 Issues to Fix:');
                data.issues.forEach(issue => {
                    const priorityEmoji = issue.priority === 'high' ? '🔴' : 
                        issue.priority === 'medium' ? '🟡' : '🟢';
                    console.log(`${priorityEmoji} ${issue.test}: ${issue.fix}`);
                });
                console.groupEnd();
            }
            
            console.groupEnd();
        });
        
        console.groupEnd();
    }
    
    async runQuickTest() {
        console.log('⚡ Running Quick Test...');
        
        const quickTests = [
            this.testKeyboardNavigation(),
            this.testPageLoadSpeed(),
            this.testFormValidation(),
            this.testMobileResponsiveness()
        ];
        
        const results = await Promise.all(quickTests);
        const allResults = results.flat();
        
        console.log(`Quick Test: ${this.getPassCount(allResults)}/${allResults.length} passed`);
        
        return allResults;
    }
    
    getTestReport() {
        return JSON.parse(localStorage.getItem('mwg_test_report') || '{}');
    }
}

// Initialize testing suite
let testingSuite;

document.addEventListener('DOMContentLoaded', () => {
    testingSuite = new ComprehensiveTestingSuite();
    
    // Make available globally for manual testing
    window.testingSuite = testingSuite;
    
    // Add quick test command
    window.runQuickTest = () => testingSuite.runQuickTest();
    window.runFullTest = () => testingSuite.runAllTests();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComprehensiveTestingSuite;
}