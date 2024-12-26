self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('RSO-Canteen').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        './assets/main2logo.png',
        '/styles.css',
        '/main.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
