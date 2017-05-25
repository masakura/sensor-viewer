self.addEventListener('install', ev => {
  const data = caches.open('cache')
    .then(cache => cache.addAll([
      '/',
      '/manifest.json',
      '/favicon.ico',
      '/apple-touch-icon.png',
      '/styles/main.css',
      '/styles/vendor.css',
      '/scripts/main.js',
      '/scripts/plugins.js',
      '/scripts/vendor.js',
      '/fonts/glyphicons-halflings-regular.eot',
      '/fonts/glyphicons-halflings-regular.svg',
      '/fonts/glyphicons-halflings-regular.ttf',
      '/fonts/glyphicons-halflings-regular.woff',
      '/fonts/glyphicons-halflings-regular.woff2',
    ]));
  ev.waitUntil(data);
});

const util = {
  fetch(req) {
    return fetch(req.clone())
      .then((res) => {
        if (res && res.status === 200) {
          console.log(`Fetch ${req.url}`);
          return res;
        }
        return Promise.reject(res);
      });
  },
  registerCache(req, res) {
    return caches.open('cache')
      .then(cache => {
        cache.put(req.clone(), res.clone());
        return res;
      });
  },
  cache(req, originalRes) {
    return caches.match(req.clone())
      .then((res) => {
        if (res) {
          console.log(`Hit ${req.url}`);
          return res;
        }
        return Promise.reject(originalRes);
      });
  }
};

self.addEventListener('fetch', ev => {
  if (/browser-sync/.test(ev.request.url)) return;
  if (!(/readirn/.test(ev.request.url) ||
    /localhost/.test(ev.request.url) ||
    /j21/.test(ev.request.url))) return;

  console.log(`Request ${ev.request.url}`);

  const result = Promise.resolve()
    .then(() => util.fetch(ev.request))
    .then(res => util.registerCache(ev.request, res))
    .catch(res => util.cache(ev.request, res));
  ev.respondWith(result);
});
