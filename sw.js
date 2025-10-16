// MWG Hostels Service Worker - Enhanced PWA Features
const CACHE_VERSION = 'v1.4'; // Increment this with each deploy
const CACHE_NAME = `mwg-hostels-${CACHE_VERSION}`;
const STATIC_CACHE = 'mwg-static-v1.2';
const DYNAMIC_CACHE = 'mwg-dynamic-v1.2';
const IMAGE_CACHE = 'mwg-images-v1.2';

// Resources to cache immediately
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/realtor-dashboard.html',
  '/roommate-finder.html',
  '/universal-bg-system.css',
  '/perfect-vibe-theme.css',
  '/glass-morphism-global.css',
  '/student-accessibility.css',
  '/responsive-fixes.css',
  '/auth-system.js',
  '/enhanced-error-system.js',
  '/modal-system.js',
  '/sama.png',
  '/MWG logo@300x.png',
  '/background.jpg',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache core assets
self.addEventListener('install', event => {
event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
return cache.addAll(CORE_ASSETS.map(url => {
        return new Request(url, { mode: 'no-cors' });
      })).catch(error => {
// Continue anyway - cache what we can
        return Promise.resolve();
      });
    })
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('mwg-hostels-') && name !== CACHE_NAME)
          .map(name => {
return caches.delete(name);
          })
      );
    }).then(() => {
      // Force immediate control of all clients
      return self.clients.claim();
    })
  );
});

// Fetch event - smart caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Network First for API calls
    if (url.pathname.includes('/api/')) {
      return await networkFirst(request);
    }
    
    // Strategy 2: Cache First for static assets
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request);
    }
    
    // Strategy 3: Stale While Revalidate for images
    if (isImage(url.pathname)) {
      return await staleWhileRevalidate(request);
    }
    
    // Strategy 4: Network First with cache fallback for HTML pages
    if (isHTMLPage(url.pathname)) {
      return await networkFirstWithFallback(request);
    }
    
    // Default: Network with cache fallback
    return await networkWithCacheFallback(request);
    
  } catch (error) {
return await getOfflineFallback(request);
  }
}

// Caching Strategies
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || getOfflineResponse();
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return getOfflineResponse();
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request).then(async networkResponse => {
    if (networkResponse && networkResponse.ok) {
      try {
        const cache = await caches.open(IMAGE_CACHE);
        // Clone before using the response
        const responseToCache = networkResponse.clone();
        await cache.put(request, responseToCache);
      } catch (err) {
}
    }
    return networkResponse;
  }).catch(() => null);
  
  return cachedResponse || await networkResponsePromise || getOfflineResponse();
}

async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.ok) {
      try {
        const cache = await caches.open(DYNAMIC_CACHE);
        // Clone before using the response
        const responseToCache = networkResponse.clone();
        await cache.put(request, responseToCache);
      } catch (err) {
}
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept').includes('text/html')) {
      return getOfflineHTML();
    }
    
    return getOfflineResponse();
  }
}

async function networkWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || getOfflineResponse();
  }
}

// Utility Functions
function isStaticAsset(pathname) {
  return /\.(css|js|woff|woff2|ttf|eot)$/.test(pathname) ||
         pathname.includes('font') ||
         pathname.includes('cdnjs.cloudflare.com');
}

function isImage(pathname) {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/.test(pathname) ||
         pathname.includes('images.unsplash.com');
}

function isHTMLPage(pathname) {
  return pathname === '/' ||
         pathname.endsWith('/') ||
         pathname.endsWith('.html') ||
         !pathname.includes('.');
}

function getOfflineResponse() {
  return new Response('Offline - Please check your connection', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({
      'Content-Type': 'text/plain'
    })
  });
}

function getOfflineHTML() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - MWG Hostels</title>
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #3b82f6, #9333ea);
          color: white;
          text-align: center;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
        }
        .offline-container {
          max-width: 500px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .offline-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.8;
        }
        h1 { margin-bottom: 1rem; }
        p { margin-bottom: 2rem; opacity: 0.9; }
        .retry-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .retry-btn:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">📶</div>
        <h1>You're Offline</h1>
        <p>No internet connection detected. The MWG Hostels platform works best with an active connection.</p>
        <button class="retry-btn" onclick="location.reload()">
          🔄 Try Again
        </button>
        <p style="margin-top: 2rem; font-size: 0.9rem;">
          <strong>Demo Mode Available:</strong><br>
          Visit the homepage to browse hostels in demo mode.
        </p>
      </div>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    headers: new Headers({
      'Content-Type': 'text/html'
    })
  });
}

// Background Sync for form submissions
self.addEventListener('sync', event => {
if (event.tag === 'background-registration') {
    event.waitUntil(handleBackgroundRegistration());
  }
  
  if (event.tag === 'background-contact') {
    event.waitUntil(handleBackgroundContact());
  }
});

async function handleBackgroundRegistration() {
  try {
    // Get pending registrations from IndexedDB
    const pendingRegistrations = await getPendingData('registrations');
    
    for (const registration of pendingRegistrations) {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registration.data)
        });
        
        if (response.ok) {
          await removePendingData('registrations', registration.id);
}
      } catch (error) {
}
    }
  } catch (error) {
    console.error('🚨 Background sync error:', error);
  }
}

async function handleBackgroundContact() {
  try {
    const pendingContacts = await getPendingData('contacts');
    
    for (const contact of pendingContacts) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contact.data)
        });
        
        if (response.ok) {
          await removePendingData('contacts', contact.id);
}
      } catch (error) {
}
    }
  } catch (error) {
    console.error('🚨 Background contact sync error:', error);
  }
}

// Push notifications
self.addEventListener('push', event => {
const options = {
    body: event.data ? event.data.text() : 'New update from MWG Hostels',
    icon: '/sama.png',
    badge: '/sama.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Hostels',
        icon: '/sama.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/sama.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('MWG Hostels', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/?notification=explore')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// IndexedDB helpers for background sync
async function getPendingData(storeName) {
  // Simplified implementation - in production, use proper IndexedDB
  return [];
}

async function removePendingData(storeName, id) {
  // Simplified implementation - in production, use proper IndexedDB
  return true;
}

// Cache cleanup on quota exceeded
self.addEventListener('quotaexceeded', event => {
event.waitUntil(
    caches.open(IMAGE_CACHE).then(cache => {
      return cache.keys().then(keys => {
        // Remove oldest images
        return Promise.all(
          keys.slice(0, Math.floor(keys.length / 2)).map(key => {
            return cache.delete(key);
          })
        );
      });
    })
  );
});

// Add update notification
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
