const CACHE_NAME = 'cuckoo-suite-v1.0'; // Cambia questo nome (es. v1.1) quando fai futuri aggiornamenti ai file HTML

const urlsToCache = [
  './',
  './index.html',
  './cuckoo_box.html',
  './cuckoo_nest.html',
  './cuckoo_view.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-box.png',
  './icon-nest.png',
  // Non servono librerie esterne qui (p5.js e xlsx) se vuoi che l'app pesi pochissimo, 
  // il browser le cacherà in automatico se c'è internet la prima volta.
];

// FASE DI INSTALLAZIONE: Salva i file in cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta. Salvataggio file in corso...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// FASE DI ATTIVAZIONE: Pulisce le cache vecchie se cambi CACHE_NAME
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminazione vecchia cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// FASE DI FETCH (Quando l'app chiede un file)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se il file è nella cache (anche offline), restituiscilo!
        if (response) {
          return response;
        }
        // Altrimenti, prova a scaricarlo da internet/server locale
        return fetch(event.request).catch(() => {
            console.log("Sei offline e la risorsa non è in cache.");
        });
      })
  );
});