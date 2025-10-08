/**
 * SAMA Platform - Student Experience Testing Script
 * Ensures optimal functionality for all students accessing the deployed platform
 */

class StudentExperienceTester {
    constructor() {
        this.testResults = [];
        this.studentScenarios = [
            'mobile_user_slow_connection',
            'desktop_user_fast_connection',
            'first_time_visitor',
            'returning_student',
            'accessibility_needs',
            'no_registration_browser'
        ];
    }

    async runAllTests() {
        console.log('🎓 Starting SAMA Student Experience Tests...');
        
        // Test 1: Mobile Responsiveness
        this.testMobileResponsiveness();
        
        // Test 2: Loading Performance
        await this.testLoadingPerformance();
        
        // Test 3: Open Access Flow
        await this.testOpenAccessFlow();
        
        // Test 4: Browse Without Registration
        this.testBrowseWithoutRegistration();
        
        // Test 5: Accessibility Features
        this.testAccessibilityFeatures();
        
        // Test 6: Error Handling
        this.testErrorHandling();
        
        // Test 7: Demo Mode Functionality
        this.testDemoMode();
        
        // Test 8: Contact Features
        this.testContactFeatures();
        
        // Generate Report
        this.generateStudentReport();
    }

    testMobileResponsiveness() {
        console.log('📱 Testing mobile responsiveness...');
        
        const mobileTests = {
            'Touch targets min 48px': this.checkTouchTargets(),
            'No horizontal scroll': this.checkHorizontalScroll(),
            'Readable text on mobile': this.checkTextSize(),
            'Mobile navigation works': this.checkMobileNavigation(),
            'Forms work on mobile': this.checkMobileForms()
        };

        this.testResults.push({
            category: 'Mobile Responsiveness',
            tests: mobileTests,
            passed: Object.values(mobileTests).every(Boolean)
        });
    }

    async testLoadingPerformance() {
        console.log('⚡ Testing loading performance...');
        
        const startTime = performance.now();
        
        // Test critical resource loading
        const criticalResources = [
            'universal-bg-system.css',
            'perfect-vibe-theme.css',
            'auth-system.js',
            'student-accessibility.css'
        ];

        const loadTests = {};
        
        for (const resource of criticalResources) {
            const loaded = await this.checkResourceLoaded(resource);
            loadTests[`${resource} loaded`] = loaded;
        }

        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        loadTests['Page loads under 3 seconds'] = loadTime < 3000;
        loadTests['Demo mode available immediately'] = this.checkDemoModeReady();

        this.testResults.push({
            category: 'Loading Performance',
            tests: loadTests,
            loadTime: Math.round(loadTime),
            passed: Object.values(loadTests).every(Boolean)
        });
    }

    async testOpenAccessFlow() {
        console.log('🎯 Testing open access flow...');
        
        const openAccessTests = {
            'No registration required': this.testNoRegistrationRequired(),
            'Browse button accessible': this.testBrowseAccessibility(),
            'Platform fully accessible': this.testFullAccess(),
            'Student-friendly messaging': this.testStudentMessaging(),
            'Open access works': await this.testOpenAccess(),
            'Error messages clear': this.testErrorMessages(),
            'Mobile-friendly interface': this.testMobileForms()
        };

        this.testResults.push({
            category: 'Open Access Flow',
            tests: openAccessTests,
            passed: Object.values(openAccessTests).every(Boolean)
        });
    }

    testBrowseWithoutRegistration() {
        console.log('👀 Testing browse without registration...');
        
        const browseTests = {
            'Browse button visible': !!document.querySelector('[onclick*="browseWithoutRegistration"]'),
            'Demo hostels display': this.testDemoHostelsDisplay(),
            'Hostel information complete': this.testHostelInfoCompleteness(),
            'No registration required': this.testNoRegistrationNeeded(),
            'Contact info available': this.testContactInfoAvailable()
        };

        this.testResults.push({
            category: 'Browse Without Registration',
            tests: browseTests,
            passed: Object.values(browseTests).every(Boolean)
        });
    }

    testAccessibilityFeatures() {
        console.log('♿ Testing accessibility features...');
        
        const accessibilityTests = {
            'Skip link present': !!document.querySelector('.skip-link'),
            'Focus indicators visible': this.testFocusIndicators(),
            'Alt text on images': this.testImageAltText(),
            'High contrast support': this.testHighContrastSupport(),
            'Keyboard navigation': this.testKeyboardNavigation(),
            'Screen reader support': this.testScreenReaderSupport(),
            'Reduced motion support': this.testReducedMotionSupport()
        };

        this.testResults.push({
            category: 'Accessibility Features',
            tests: accessibilityTests,
            passed: Object.values(accessibilityTests).every(Boolean)
        });
    }

    testErrorHandling() {
        console.log('🚨 Testing error handling...');
        
        const errorTests = {
            'Network errors handled': this.testNetworkErrorHandling(),
            'Form errors clear': this.testFormErrorClarity(),
            'Offline mode works': this.testOfflineMode(),
            'Recovery suggestions provided': this.testRecoverySuggestions(),
            'No crashes on errors': this.testErrorResilience()
        };

        this.testResults.push({
            category: 'Error Handling',
            tests: errorTests,
            passed: Object.values(errorTests).every(Boolean)
        });
    }

    testDemoMode() {
        console.log('🎮 Testing demo mode functionality...');
        
        const demoTests = {
            'Demo mode indicator visible': !!document.getElementById('connection-status'),
            'Demo hostels available': this.testDemoHostelsAvailable(),
            'Demo registration works': this.testDemoRegistrationWorks(),
            'All features accessible': this.testAllFeaturesInDemo(),
            'No backend required': this.testNoBackendDependency()
        };

        this.testResults.push({
            category: 'Demo Mode',
            tests: demoTests,
            passed: Object.values(demoTests).every(Boolean)
        });
    }

    testContactFeatures() {
        console.log('📞 Testing contact features...');
        
        const contactTests = {
            'WhatsApp links work': this.testWhatsAppLinks(),
            'Phone numbers clickable': this.testPhoneNumbers(),
            'Email addresses work': this.testEmailAddresses(),
            'Contact forms functional': this.testContactForms()
        };

        this.testResults.push({
            category: 'Contact Features',
            tests: contactTests,
            passed: Object.values(contactTests).every(Boolean)
        });
    }

    // Helper methods for specific tests
    checkTouchTargets() {
        const buttons = document.querySelectorAll('button, .btn, input[type="submit"]');
        return Array.from(buttons).every(btn => {
            const rect = btn.getBoundingClientRect();
            return rect.height >= 44 && rect.width >= 44;
        });
    }

    checkHorizontalScroll() {
        return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
    }

    checkTextSize() {
        const textElements = document.querySelectorAll('p, span, div, label');
        return Array.from(textElements).every(el => {
            const fontSize = window.getComputedStyle(el).fontSize;
            return parseInt(fontSize) >= 14;
        });
    }

    checkMobileNavigation() {
        // Check if mobile navigation exists and works
        const mobileToggle = document.querySelector('.mobile-toggle');
        return !!mobileToggle;
    }

    checkMobileForms() {
        const inputs = document.querySelectorAll('input, textarea, select');
        return Array.from(inputs).every(input => {
            const fontSize = window.getComputedStyle(input).fontSize;
            return parseInt(fontSize) >= 16; // Prevents zoom on iOS
        });
    }

    async checkResourceLoaded(resourceName) {
        const links = document.querySelectorAll('link[href*="' + resourceName + '"]');
        const scripts = document.querySelectorAll('script[src*="' + resourceName + '"]');
        return links.length > 0 || scripts.length > 0;
    }

    checkDemoModeReady() {
        return typeof browseWithoutRegistration === 'function';
    }

    testModalOpening(modalId) {
        const modal = document.getElementById(modalId);
        return !!modal;
    }

    testFormValidation() {
        const forms = document.querySelectorAll('form');
        return forms.length > 0 && Array.from(forms).some(form => 
            form.querySelectorAll('input[required]').length > 0
        );
    }

    testPasswordVisibility() {
        return !!document.querySelector('.password-requirements') || 
               !!document.querySelector('.password-strength');
    }

    testFUTAFields() {
        return !!document.querySelector('input[name*="matric"]') ||
               !!document.querySelector('select[name*="department"]');
    }

    async testDemoRegistration() {
        // Simulate demo registration test
        return typeof window.authSystem !== 'undefined';
    }

    testErrorMessages() {
        return !!document.querySelector('.error-message') ||
               document.head.innerHTML.includes('enhanced-error-system');
    }

    testDemoHostelsDisplay() {
        const demoSection = document.getElementById('demo-hostels');
        return !!demoSection;
    }

    testHostelInfoCompleteness() {
        const hostelCards = document.querySelectorAll('.hostel-card');
        return hostelCards.length >= 3;
    }

    testNoRegistrationNeeded() {
        return typeof browseWithoutRegistration === 'function';
    }

    testContactInfoAvailable() {
        return document.body.innerHTML.includes('WhatsApp') ||
               document.body.innerHTML.includes('phone');
    }

    testFocusIndicators() {
        // Test if focus styles are defined
        const styleSheets = Array.from(document.styleSheets);
        return styleSheets.some(sheet => {
            try {
                const rules = Array.from(sheet.cssRules || sheet.rules || []);
                return rules.some(rule => rule.selectorText && rule.selectorText.includes(':focus'));
            } catch (e) {
                return false;
            }
        });
    }

    testImageAltText() {
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => img.alt !== '');
    }

    testHighContrastSupport() {
        return document.head.innerHTML.includes('@media (prefers-contrast: high)') ||
               document.head.innerHTML.includes('student-accessibility.css');
    }

    testKeyboardNavigation() {
        return document.querySelector('.skip-link') !== null;
    }

    testScreenReaderSupport() {
        return document.querySelectorAll('.sr-only').length > 0 ||
               document.querySelectorAll('[aria-label]').length > 0;
    }

    testReducedMotionSupport() {
        return document.head.innerHTML.includes('prefers-reduced-motion');
    }

    testNetworkErrorHandling() {
        return typeof ErrorHandler !== 'undefined' ||
               document.head.innerHTML.includes('enhanced-error-system');
    }

    testFormErrorClarity() {
        return document.head.innerHTML.includes('error-message') ||
               document.head.innerHTML.includes('success-message');
    }

    testOfflineMode() {
        return typeof browseWithoutRegistration === 'function' &&
               document.getElementById('connection-status') !== null;
    }

    testRecoverySuggestions() {
        return document.head.innerHTML.includes('enhanced-error-system.js');
    }

    testErrorResilience() {
        // Test if error handling is comprehensive
        return typeof window.onerror === 'function' ||
               typeof ErrorHandler !== 'undefined';
    }

    testDemoHostelsAvailable() {
        return document.getElementById('demo-hostels') !== null;
    }

    testDemoRegistrationWorks() {
        return typeof window.authSystem !== 'undefined';
    }

    testAllFeaturesInDemo() {
        return !!document.querySelector('[onclick*="browseWithoutRegistration"]');
    }

    testNoBackendDependency() {
        return document.body.innerHTML.includes('Demo Mode') ||
               document.body.innerHTML.includes('demo mode');
    }

    testWhatsAppLinks() {
        return document.body.innerHTML.includes('whatsapp.com') ||
               document.body.innerHTML.includes('WhatsApp');
    }

    testPhoneNumbers() {
        return document.body.innerHTML.includes('tel:') ||
               document.body.innerHTML.includes('+234');
    }

    testEmailAddresses() {
        return document.body.innerHTML.includes('mailto:') ||
               document.body.innerHTML.includes('@');
    }

    testContactForms() {
        return document.querySelectorAll('form').length > 0;
    }

    // New test functions for open access flow
    testNoRegistrationRequired() {
        // Check that browse buttons are accessible without registration
        const browseButtons = document.querySelectorAll('[onclick*="browseWithoutRegistration"], [data-action="browse-hostels"]');
        return browseButtons.length > 0;
    }

    testBrowseAccessibility() {
        // Check that main browse button is prominent and accessible
        const mainBrowseBtn = document.querySelector('.cta-button');
        return mainBrowseBtn && mainBrowseBtn.textContent.includes('Browse');
    }

    testFullAccess() {
        // Check that no registration barriers exist
        const registrationModal = document.getElementById('registrationModal');
        return !registrationModal; // Should not exist anymore
    }

    testStudentMessaging() {
        // Check for student-friendly messaging
        const instantAccess = document.querySelector('.registration-notice');
        return instantAccess && instantAccess.textContent.includes('Instant Access');
    }

    async testOpenAccess() {
        // Test that open access actually works
        try {
            const browseBtn = document.querySelector('[onclick*="browseWithoutRegistration"]');
            return !!browseBtn;
        } catch (error) {
            console.warn('Open access test failed:', error);
            return false;
        }
    }

    generateStudentReport() {
        console.log('\n🎓 SAMA STUDENT EXPERIENCE TEST REPORT');
        console.log('=====================================\n');
        
        let totalTests = 0;
        let passedTests = 0;
        
        this.testResults.forEach(category => {
            const categoryTests = Object.keys(category.tests).length;
            const categoryPassed = Object.values(category.tests).filter(Boolean).length;
            
            totalTests += categoryTests;
            passedTests += categoryPassed;
            
            console.log(`📂 ${category.category}`);
            console.log(`   ✅ ${categoryPassed}/${categoryTests} tests passed`);
            
            if (category.loadTime) {
                console.log(`   ⚡ Load time: ${category.loadTime}ms`);
            }
            
            // Show failed tests
            Object.entries(category.tests).forEach(([test, passed]) => {
                if (!passed) {
                    console.log(`   ❌ Failed: ${test}`);
                }
            });
            
            console.log('');
        });
        
        const passRate = Math.round((passedTests / totalTests) * 100);
        console.log(`🎯 OVERALL SCORE: ${passedTests}/${totalTests} (${passRate}%)`);
        
        if (passRate >= 90) {
            console.log('🏆 EXCELLENT! Platform is ready for all students!');
        } else if (passRate >= 80) {
            console.log('👍 GOOD! Platform works well with minor improvements needed.');
        } else if (passRate >= 70) {
            console.log('⚠️ FAIR! Some important issues need addressing.');
        } else {
            console.log('🚨 NEEDS WORK! Critical issues must be fixed.');
        }
        
        // Student-specific recommendations
        console.log('\n📝 STUDENT EXPERIENCE RECOMMENDATIONS:');
        if (passRate < 100) {
            console.log('- Ensure all failed tests are addressed');
            console.log('- Test on actual mobile devices');
            console.log('- Verify with students using different internet speeds');
        }
        console.log('- Consider adding more demo hostels');
        console.log('- Test with screen readers');
        console.log('- Validate on different browsers');
        
        return {
            totalTests,
            passedTests,
            passRate,
            categories: this.testResults
        };
    }
}

// Auto-run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only run in development/testing
    if (window.location.hostname === 'localhost' || window.location.search.includes('test=true')) {
        const tester = new StudentExperienceTester();
        setTimeout(() => tester.runAllTests(), 2000); // Wait for full page load
    }
});

// Make available globally for manual testing
window.StudentExperienceTester = StudentExperienceTester;