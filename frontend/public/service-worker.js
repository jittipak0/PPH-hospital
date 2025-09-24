const CACHE_NAME = 'pph-hospital-cache-v1'
const OFFLINE_URL = '/'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL, '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png']))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response
          }

          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {
              // Ignore cache errors (e.g. opaque requests)
            })
          })

          return response
        })
        .catch(async () => {
          if (event.request.mode === 'navigate') {
            const offline = await caches.match(OFFLINE_URL)
            if (offline) return offline
          }
          throw new Error('Network request failed and no cache available')
        })
    })
  )
})
