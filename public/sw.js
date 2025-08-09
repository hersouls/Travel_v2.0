const CACHE_NAME = 'moonwave-travel-v1.0.2';
const SCOPE_URL = new URL(self.registration.scope);

const PRECACHE_URLS = [
  '.',
  'index.html',
  'moonwave-icon.svg',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Early exit for non-GET requests: do not intercept or cache
  if (request.method !== 'GET') {
    return;
  }

  // 자산 파일은 캐시 우선 (immutable)
  const assetsPrefix = new URL('assets/', SCOPE_URL).toString();
  const isAsset = request.url.startsWith(assetsPrefix);
  if (isAsset) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached || fetch(request).then((response) => {
            const respClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, respClone));
            return response;
          })
        );
      })
    );
    return;
  }

  // HTML 및 기타는 네트워크 우선
  event.respondWith(
    fetch(request)
      .then((response) => {
        // 성공 시 최신 응답을 캐시에 백그라운드로 저장
        const respClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, respClone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});