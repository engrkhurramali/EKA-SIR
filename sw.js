const CACHE_NAME = 'ekasir-v1';
const ASSETS = [
    './',
    './index.html',
    './notes.html',
    './test.html',
    './games.html',
    './mcq-practice.html',
    './mcq_test.html',
    './calculator.html',
    './unitconverter.html',
    './info.html',
    './manifest.json'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});