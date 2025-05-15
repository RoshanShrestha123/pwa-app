const VERSION = "v1";

const CACHE_NAME = `period-tracer-${VERSION}`;

const APP_STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/public/android/android-launchericon-48-48.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(APP_STATIC_RESOURCES);
  })();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const names = await caches.keys();

      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );

      await clients.claim();
    })()
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    e.respondWith(caches.match("/"));
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request.url);
      if (cachedResponse) {
        // Return the cached response if it's available.
        return cachedResponse;
      }
      // Respond with a HTTP 404 response status.
      return new Response(null, { status: 404 });
    })()
  );
});
