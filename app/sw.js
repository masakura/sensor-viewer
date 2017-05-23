self.addEventListener('install', ev => {
  const data = caches.open('cache')
    .then(cache => cache.addAll([
      '/',
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

self.addEventListener('fetch', ev => {
  if (/browser-sync/.test(ev.request.url)) return;
  if (!(/readirn/.test(ev.request.url) ||
    /localhost/.test(ev.request.url) ||
    /j21/.test(ev.request.url))) return;

  console.log(`Request ${ev.request.url}`);

  const fetchRequest = ev.request.clone();

  const data = caches.match(ev.request)
    .then(response => {
      if (response) {
        console.log(`Hit ${ev.request.url}`);
        return response;
      }

      fetch(fetchRequest)
        .then(res => {
          console.log(res.status);
          if (!(res && res.status === 200)) return res;

          const responseToCache = res.clone();

          caches.open('cache')
            .then(cache => cache.put(ev.request, responseToCache))
            .then(() => console.log(`Put ${ev.request.url}`));

          return res;
        });
    });

  ev.respondWith(data);
});
