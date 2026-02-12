const CACHE_NAME = 'ahss-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/search.html',
  '/property.html',
  '/css/main.css',
  '/css/layout.css',
  '/css/map.css',
  '/css/components.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/data.js',
  '/js/map.js',
  '/js/filters.js',
  '/js/geolocation.js',
  '/js/realtime.js',
  '/js/listings.js',
  '/js/negotiation.js',
  '/js/lipa-mdogo.js',
  '/js/favorites.js',
  '/js/services.js',
  '/js/ui.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
  '/images/properties/placeholder.jpg',
  '/icons/app/icon-192.png',
  '/icons/app/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});