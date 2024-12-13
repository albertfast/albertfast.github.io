const cacheName = 'PhoneGapCordova-Flutter-ReactNative'; // Define the cache name
const assetsToCache = [
    'hybrid.html', // Main HTML file
    'hybrid.js', // JavaScript logic
    'manifest.json', // Manifest Json
    'greenbird.jpg', // Background image: 
    'greenbird.ico', // Favicon
    'greenbird2.ico', // Favicon
    'greenbird144.png', // image/png
    'greenbird144.webp', // image/webp
    'greenbird192.png', // image/png
    'greenbird512.png', // image/png
    'greenbird1280.png', // image/png
    'greenbird720.png', // image/png
    
];

                        
// Install event: Cache all required assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing Service Worker...');
    self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all assets...');
            return cache.addAll(assetsToCache);
        }).catch((error) => console.error('[Service Worker] Caching failed:', error))
    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating new Service Worker...');
    const cacheWhitelist = ['ajax-assignment-cache-v1'];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (!cacheWhitelist.includes(cache)) {
                        console.log(`[Service Worker] Deleting old cache: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});


// Fetch event: Serve cached content when available, fallback to network
self.addEventListener('fetch', (event) => {
    console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                console.log(`[Service Worker] Found resource in cache: ${event.request.url}`);
                return response; // Return cached resource
            }
            console.log(`[Service Worker] Resource not in cache, fetching: ${event.request.url}`);
            return fetch(event.request).catch((error) => {
                console.error(`[Service Worker] Fetch failed: ${event.request.url}`, error);
                throw error;
            });
        })
    );
});
