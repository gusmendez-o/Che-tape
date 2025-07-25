const CACHE_NAME = "che-tape-cache-v1";
const OFFLINE_URL = "/che-tape/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL]))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then((res) => res || caches.match(OFFLINE_URL)))
  );
});
