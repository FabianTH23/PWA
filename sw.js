// Asignar nombre y version de cache
const CACHE_NAME = 'v5_cache_mi_pwa';

// Archivos a cachear
const urlsToCache = [
  '/',
  './index.html',
  './manifest.json',
  './styles.css',
  './main.js',

  // ICONOS
  '/images/icono-16x16.png',
  '/images/icono-32x32.png',
  '/images/icono-64x64.png',
  '/images/icono-96x96.png',
  '/images/icono-128x128.png',
  '/images/icono-144x144.png',
  '/images/icono-192x192.png',
  '/images/icono-240x240.png',
  '/images/icono-256x256.png',
  '/images/icono-384x384.png',
  '/images/icono-512x512.png',
  '/images/icono-1024x1024.png'
];

// INSTALL
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      .catch((err) => console.log('No se ha registrado el cache', err))
  );
});

// ACTIVATE
self.addEventListener('activate', (e) => {
  const cacheWhitelist = [CACHE_NAME];

  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// FETCH (Offline seguro)
self.addEventListener('fetch', (e) => {

  // Navegación (cargar páginas)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Archivos (css/js/img): cache first
  e.respondWith(
    caches.match(e.request)
      .then((response) => {
        if (response) return response;

        // Si no está en cache, intenta red
        return fetch(e.request).then((networkResponse) => {
          // Guardar en cache lo que se descargue
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
      .catch(() => {
        // fallback final: siempre un Response válido
        return new Response('Sin conexión y recurso no disponible en caché.', {
          status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
  );
});