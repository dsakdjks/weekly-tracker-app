// Service Worker for Life Weeks Tracker
// Enables offline functionality and performance optimization through caching

const CACHE_NAME = "life-weeks-tracker-v1";
const RUNTIME_CACHE = "life-weeks-runtime-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/index.js",
  "/manifest.json",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
  "/icons/maskable-icon-512.svg",
];

// Install event - cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Always try to cache root and index.html
      try {
        await cache.addAll(urlsToCache).catch((err) => {
          console.log("Cache addAll error:", err);
        });
      } catch (e) {
        console.log("Precache basic assets failed:", e);
      }

      // Attempt to fetch the built index.html and extract /assets/ references
      try {
        const resp = await fetch("/index.html");
        if (resp && resp.ok) {
          const text = await resp.text();
          const matches = Array.from(
            text.matchAll(/\/(assets\/[^"'\s>]+)/g),
          ).map((m) => "/" + m[1]);
          const unique = [...new Set(matches)];
          await Promise.all(
            unique.map(async (url) => {
              try {
                const r = await fetch(url);
                if (r && r.ok) {
                  await cache.put(url, r.clone());
                }
              } catch (err) {
                // ignore individual asset failures
              }
            }),
          );
        }
      } catch (err) {
        console.log("Failed to prefetch assets from index.html", err);
      }

      await self.skipWaiting();
    })(),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch event - network first with cache fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome extensions
  if (request.url.startsWith("chrome-extension://")) {
    return;
  }

  event.respondWith(
    // Try network first
    fetch(request)
      .then((response) => {
        // Don't cache if not successful
        if (!response || response.status !== 200 || response.type === "error") {
          return response;
        }

        // Clone response for caching
        const responseToCache = response.clone();

        const cacheName = request.url.includes("/assets/")
          ? CACHE_NAME
          : RUNTIME_CACHE;
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Fall back to cache when offline
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }

          // Return offline fallback for documents
          if (request.headers.get("Accept")?.includes("text/html")) {
            return caches.match("/index.html");
          }

          return new Response("Offline - Resource not available", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          });
        });
      }),
  );
});
