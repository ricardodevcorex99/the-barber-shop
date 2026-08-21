/**
 * THE BARBER SHOP — Service Worker
 * Cache-first for static assets, network-first for API + pages.
 */

const CACHE_NAME = 'tbs-cache-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/douglas.html',
  '/cristopher.html',
  '/galeria.html',
  '/styles.css',
  '/booking.js',
  '/auth.js',
  '/script.js',
  '/manifest.webmanifest'
];

// Install: pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: Network-first for everything (good for development and frequent updates)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin calls
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin && !url.origin.includes('gstatic.com') && !url.origin.includes('googleapis.com')) return;

  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
