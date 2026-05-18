// Service Worker for Life Weeks Tracker
// Enables offline functionality and performance optimization through caching

const CACHE_NAME = 'life-weeks-tracker-v1';
const RUNTIME_CACHE = 'life-weeks-runtime-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/index.js',
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch((err) => {
          console.log('Cache addAll error:', err);
          // Continue even if some resources fail to cache
          return Promise.resolve();
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions
  if (request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    // Try network first
    fetch(request)
      .then((response) => {
        // Don't cache if not successful
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone response for caching
        const responseToCache = response.clone();
        
        const cacheName = request.url.includes('/assets/') ? CACHE_NAME : RUNTIME_CACHE;
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Fall back to cache when offline
        return caches.match(request)
          .then((response) => {
            if (response) {
              return response;
            }

            // Return offline fallback for documents
            if (request.headers.get('Accept')?.includes('text/html')) {
              return caches.match('/index.html');
            }

            return new Response('Offline - Resource not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});
