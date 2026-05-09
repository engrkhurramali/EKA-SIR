const CACHE_NAME = 'ekasir-cache-v3';

// Core assets to cache immediately
const PRE_CACHE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './notes.html',
    './test.html',
    './games.html',
    './mcq-practice.html',
    './mcq_test.html',
    './chapter_select.html',
    './vocabulary.js',
    './info.html',
    './calculator.html',
    './unitconverter.html',
    './eks_sir_logo_92.png',
    './eks_sir_logo_512.png'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRE_CACHE_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
});

// Fetch Event: Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    // Update cache with the new version from network
                    if (networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(() => {
                    // If network fails, we already have the cachedResponse
                });

                // Return cached version immediately, or wait for network if not in cache
                return cachedResponse || fetchPromise;
            });
        })
    );
});