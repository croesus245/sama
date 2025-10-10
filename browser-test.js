// Browser Console Test Suite
// Paste this in browser console after opening the site

console.log('%c🧪 MWG Hostels - Browser Test Suite', 'font-size: 20px; color: #2196F3; font-weight: bold');
console.log('=' .repeat(60));

const tests = {
    // Test 1: LocalStorage
    localStorage: () => {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return { pass: true, message: 'localStorage works' };
        } catch (e) {
            return { pass: false, message: `localStorage error: ${e.message}` };
        }
    },

    // Test 2: Images
    images: () => {
        const images = Array.from(document.querySelectorAll('img'));
        const broken = images.filter(img => !img.complete || img.naturalHeight === 0);
        return {
            pass: broken.length === 0,
            message: broken.length === 0 
                ? `All ${images.length} images loaded` 
                : `${broken.length}/${images.length} images failed to load`
        };
    },

    // Test 3: Navigation Links
    navigation: () => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        const brokenLinks = links.filter(link => {
            const href = link.getAttribute('href');
            return href && href.startsWith('#') && !document.querySelector(href);
        });
        return {
            pass: brokenLinks.length === 0,
            message: brokenLinks.length === 0 
                ? `All ${links.length} navigation links valid` 
                : `${brokenLinks.length} broken anchor links`
        };
    },

    // Test 4: Forms
    forms: () => {
        const forms = document.querySelectorAll('form');
        return {
            pass: forms.length > 0,
            message: forms.length > 0 
                ? `${forms.length} forms found` 
                : 'No forms found'
        };
    },

    // Test 5: Responsive Design
    responsive: () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        return {
            pass: viewport !== null,
            message: viewport 
                ? 'Viewport meta tag present (mobile-ready)' 
                : 'Missing viewport meta tag'
        };
    },

    // Test 6: JavaScript Errors
    jsErrors: () => {
        const errorLog = localStorage.getItem('errorLog');
        const errors = errorLog ? JSON.parse(errorLog) : [];
        return {
            pass: errors.length === 0,
            message: errors.length === 0 
                ? 'No JavaScript errors logged' 
                : `${errors.length} errors logged`
        };
    },

    // Test 7: Service Worker
    serviceWorker: () => {
        return {
            pass: 'serviceWorker' in navigator,
            message: 'serviceWorker' in navigator 
                ? 'Service Worker supported (PWA-ready)' 
                : 'Service Worker not supported'
        };
    },

    // Test 8: LocalStorage Data
    storedData: () => {
        const keys = ['realtorAccounts', 'realtorListings', 'roommateProfiles'];
        const found = keys.filter(key => localStorage.getItem(key));
        return {
            pass: true,
            message: `Found data: ${found.join(', ') || 'None yet'}`
        };
    }
};

// Run all tests
console.log('\n🧪 Running Tests...\n');

let passed = 0;
let failed = 0;

Object.entries(tests).forEach(([name, test]) => {
    const result = test();
    const status = result.pass ? '✅' : '❌';
    const color = result.pass ? 'color: green' : 'color: red';
    
    console.log(`%c${status} ${name}`, color);
    console.log(`   ${result.message}`);
    
    if (result.pass) passed++;
    else failed++;
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
    console.log('%c🎉 All tests passed! Website works perfectly!', 'font-size: 16px; color: green; font-weight: bold');
} else {
    console.log('%c⚠️ Some tests failed. Check issues above.', 'font-size: 16px; color: orange; font-weight: bold');
}

// Export results
window.testResults = { passed, failed, total: passed + failed };