const CACHE_NAME = 'ahss-v1';
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
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});