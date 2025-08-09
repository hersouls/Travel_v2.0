const CACHE_NAME = 'moonwave-travel-v1.0.1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/moonwave-icon.svg',
  '/manifest.json'
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

  // 자산 파일은 캐시 우선 (immutable)
  const isAsset = new URL(request.url).pathname.startsWith('/assets/');
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