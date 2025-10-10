// Add to index.html for testing

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
            registration.unregister();
            console.log('✅ Service worker unregistered');
        });
    });
    
    caches.keys().then(keys => {
        keys.forEach(key => {
            caches.delete(key);
            console.log('✅ Cache deleted:', key);
        });
    });
}