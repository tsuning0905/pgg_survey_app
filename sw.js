/* Service worker for PGG Post-Experiment Survey
 * Offline-first PWA cache. Bump CACHE_VERSION whenever any app file changes
 * so returning devices pick up the new version on next launch.
 */
const CACHE_VERSION = 'pgg-survey-v1';
const APP_SHELL = [
  './',
  './questionnaire_app.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Pre-cache the app shell on install.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Remove old caches on activation.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first for same-origin GET requests; fall back to the cached page when offline.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Cache a copy of successful basic responses for next time.
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => {
        // Offline navigation fallback -> the cached app page.
        if (req.mode === 'navigate') return caches.match('./questionnaire_app.html');
      });
    })
  );
});
