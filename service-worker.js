// service-worker.js
const CACHE_NAME = 'airhost-v1';
const urlsToCache = [
  './',
  './index.html',
  './search.html',
  './property.html',
  './css/main.css',
  './js/app.js',
  './js/data.js',
  './js/map.js',
  './js/filters.js',
  './manifest.json',
  './images/logo.svg',
  './images/placeholder-property.svg',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});