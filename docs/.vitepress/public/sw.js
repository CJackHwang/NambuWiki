const VERSION = 'v2';
const CACHE_PAGES = `nambuwiki-pages-${VERSION}`;
const CACHE_STATIC = `nambuwiki-static-${VERSION}`;
const OFFLINE_URLS = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_PAGES).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => {
      if (![CACHE_PAGES, CACHE_STATIC].includes(key)) return caches.delete(key);
    })))
  );
  self.clients.claim();
});

// 支持跳过等待，立即启用新版本 SW
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function isHTMLRequest(request) {
  return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}

function isStaticRequest(request) {
  const d = request.destination;
  return ['style', 'script', 'font', 'image', 'audio', 'video'].includes(d);
}

// Network-first for pages; Cache-first (stale-while-revalidate) for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (isHTMLRequest(req)) {
    event.respondWith(
      fetch(req).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_PAGES).then((cache) => cache.put(req, clone)).catch(() => {});
        return res;
      }).catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        return caches.match('/') || caches.match('/index.html');
      })
    );
    return;
  }

  if (isStaticRequest(req)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_STATIC).then((cache) => cache.put(req, clone)).catch(() => {});
          return res;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Fallback: try network, then cache
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
