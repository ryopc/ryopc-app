const CACHE_NAME = 'ryopc-pwa-v4'; // キャッシュを更新するためにバージョンを上げました

// キャッシュするアセット（./index.html に書き換え）
const ASSETS_TO_CACHE = [
  './index.html',
  './offline.html',
  './manifest.json',
  'https://googleapis.com',
  'https://cloudflare.com',
  'https://jsdelivr.net'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(
          ASSETS_TO_CACHE.map(url => 
            cache.add(url).catch(err => console.error(`キャッシュ失敗: ${url}`, err))
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const isNavigation = event.request.mode === 'navigate';

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            if (event.request.url.startsWith('http')) {
              cache.put(event.request, responseToCache);
            }
          });
          return networkResponse;
        });
      }).catch(() => {
        if (isNavigation) {
          return caches.match('./offline.html');
        }
      })
  );
});
