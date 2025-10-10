// Global image error handler

document.addEventListener('DOMContentLoaded', function() {
    // Handle all image errors globally
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
            const originalSrc = img.src;
            
            console.warn('Image failed:', originalSrc);
            
            // Try lowercase version
            if (originalSrc.includes('/assets/')) {
                const lowercaseSrc = originalSrc.replace(/\/assets\/.*/, (match) => match.toLowerCase());
                if (lowercaseSrc !== originalSrc) {
                    console.log('Trying lowercase:', lowercaseSrc);
                    img.src = lowercaseSrc;
                    return;
                }
            }
            
            // Fallback to default
            img.src = 'assets/default-hostel.jpg';
            img.alt = 'Image unavailable';
        }
    }, true);
    
    // Normalize all existing image paths
    document.querySelectorAll('img[src]').forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('assets/')) {
            img.setAttribute('src', src.toLowerCase());
        }
    });
});