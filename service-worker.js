const sw = () => {
    const cacheName = 'vitaaccredo';
    const cache = async (req) => {
        const cache = await caches.open(cacheName);
        const cached = await cache.match(req);
        return cached || fetch(req);
    };
    const netCache = async (req) => {
        const cache = await caches.open(cacheName)
        try {
            const fresh = await fetch(req);
            return await cache.put(req, fresh.clone());
        } catch (e) {
            return await cache.match(req);;
        }
    };
    self.addEventListener('install', async e => {
        const cache = await caches.open(cacheName);
        await cache.addAll([
            './',
            './404.html',
            './index.html',
            './scripts.js',
            './styles.css',
            './dashboard.html',
            './dashboard.js',
            './home.html',
            './home.js',
            './sign-in.html',
            './sign-in.js',
            './sign-in-2.html',
            './sign-in-2.js',
        ]);
        return self.skipWaiting();
    });
    self.addEventListener('activate', e => {
        self.clients.claim;
    });
    self.addEventListener('fetch', async e => {
        const req = e.request;
        const url = new URL(req.url);
    
        if (url.origin === location.origin) {
            e.respondWith(cache(req));
        } else {
            e.respondWith(netCache(req));
        }
    });
};
sw();