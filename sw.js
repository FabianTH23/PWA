const CACHE_NAME = 'v1_cache_mi_pwa';

const urlsTuCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './main.js',

  // OJO: deja SOLO los íconos que realmente existen en tu carpeta /images
  './images/icono-16x16.png',
  './images/icono-32x32.png',
  './images/icono-64x64.png',
  './images/icono-96x96.png',
  './images/icono-128x128.png',
  './images/icono-144x144.png',
  './images/icono-152x152.png',
  './images/icono-192x192.png',
  './images/icono-384x384.png',
  './images/icono-512x512.png'
];

// INSTALL
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // En vez de addAll (que truena si uno falla), agregamos uno por uno
      const results = await Promise.all(
        urlsTuCache.map((url) =>
          cache.add(url).catch((err) => {
            console.log('No se pudo cachear:', url, err);
            return null;
          })
        )
      );

      self.skipWaiting();
      return results;
    }).catch((err) => {
      console.log('No se ha registrado el cache', err);
    })
  );
});

// ACTIVATE (limpia caches viejas)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))
      )
    )
  );
  self.clients.claim();
});

// FETCH (siempre devuelve Response)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;

      return fetch(e.request)
        .then((response) => {
          // Guardar en cache solo GET y solo si es mismo origen (opcional)
          if (e.request.method === 'GET' && response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
          }
          return response;
        })
        .catch(() => {
          // Fallback: si es navegación, regresamos index.html cacheado
          if (e.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          // Para otros recursos, regresamos un Response válido
          return new Response('Offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
    })
  );
});