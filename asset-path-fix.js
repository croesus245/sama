/**
 * Asset Path Case-Sensitivity Fix for Vercel Deployment
 */

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && (src.startsWith('assets/') || src.startsWith('/assets/'))) {
            const normalizedSrc = src.toLowerCase();
            if (src !== normalizedSrc) {
                console.log(`Normalizing: ${src} -> ${normalizedSrc}`);
                img.setAttribute('src', normalizedSrc);
            }
        }
    });
    
    const elements = document.querySelectorAll('[style*="background-image"]');
    elements.forEach(el => {
        const style = el.getAttribute('style');
        if (style && style.includes('assets/')) {
            const normalizedStyle = style.toLowerCase();
            if (style !== normalizedStyle) {
                el.setAttribute('style', normalizedStyle);
            }
        }
    });
});
