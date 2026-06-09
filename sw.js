const CACHE_NAME = "johnfissel-site-cache-v11";
// Precache only the critical shell. Everything else (images, icons,
// manifest) is cached at runtime by the fetch handler on first use, so
// first-time visitors don't download assets their device never displays
// (e.g. both the 1x and 2x profile photos).
const urlsToCache = [
  "/",
  "/index.html",
  "/404.html",
  "/css/base.css",
  "/css/main.css",
  "/js/main.js",
  "/js/particle-cluster.js",
  "/images/hero-bg-1920.webp",
];

// Install event - cache assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
    ])
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            if (event.request.url.startsWith(self.location.origin)) {
              cache.put(event.request, responseToCache);
            }
          });

          return response;
        })
        .catch(() => {
          // Offline: serve the cached homepage for navigations, the
          // cached 404 page as a final fallback for anything else.
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
          return caches.match("/404.html");
        });
    })
  );
});
