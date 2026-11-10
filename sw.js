const CACHE_NAME = "miguel-portfolio-pwa-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./styles.css",
    "./script.js",
    "./manifest.json",
    "./icon.svg"
];

// INSTALACIÓN
self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ARCHIVOS))
            .then(() => self.skipWaiting())
    );

});

// ACTIVACIÓN
self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(keys => {

            return Promise.all(
                keys.map(key => {

                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }

                })
            );

        }).then(() => self.clients.claim())
    );

});

// INTERCEPTAR SOLICITUDES
self.addEventListener("fetch", event => {

    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    // Recursos de la propia página
    if (url.origin === self.location.origin) {

        event.respondWith(
            caches.match(request).then(cached => {

                if (cached) return cached;

                return fetch(request).then(response => {

                    if (response && response.ok) {

                        const copia = response.clone();

                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, copia);
                        });

                    }

                    return response;

                }).catch(() => {

                    if (request.mode === "navigate") {
                        return caches.match("./index.html");
                    }

                });

            })
        );

    }

    // Biblioteca jQuery: caché cuando se descarga correctamente
    else if (url.hostname === "code.jquery.com") {

        event.respondWith(
            caches.match(request).then(cached => {

                if (cached) return cached;

                return fetch(request).then(response => {

                    if (response && response.ok) {
                        const copia = response.clone();

                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, copia);
                        });
                    }

                    return response;

                });

            })
        );

    }

});