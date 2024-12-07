const cacheName = 'pwa-demo-cache-v1'; // Define the cache name
const assetsToCache = [
    'hw4.html', // Main HTML file
    'hw4.css', // Stylesheet
    'hw4.js', // JavaScript logic
    'manifest.json', // Manifest Json
    'lightblue.jpg', // Background image: light blue
    'lightgold.jpg', // Background image: light gold
    'favicon.ico', // Favicon
    'favicon1.ico', // Favicon
    'high_quality_image_34_144.png', // image/png
    'high_quality_image_34.png', // image/png
    'high_quality_image_34_512.png', // image/png
    'screenshot-desktop.png', // image/png
    'screenshot-mobile.png', // image/png
    
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
    const cacheWhitelist = ['pwa-demo-cache-v1']; // Yeni cache ismini buraya yazın

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
        }).then(() => self.clients.claim()) // Yeni Service Worker hemen aktif olur
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
