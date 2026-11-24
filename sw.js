// Locker Notes service worker (offline support).
// IMPORTANT: when you add, rename or delete a site file, update ASSETS below
// and change the number in CACHE_NAME so visitors get the new version.
const CACHE_NAME = 'locker-notes-v4';
const ASSETS = [
  './',
  './index.html',
  './class.html',
  './style.css',
  './data.js',
  './index.js',
  './class.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
    ))
  );
  self.clients.claim();
});

// Network first, cache as a backup: visitors always get the newest files
// when they're online, and the saved copy when they're offline.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only handle GET requests for this site's own files.
  // Everything else (like asking the AI Teacher a question) goes straight to the network.
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
      }
      return res;
    }).catch(() =>
      caches.match(req, { ignoreSearch: true }).then((cached) => cached || caches.match('./index.html'))
    )
  );
});
