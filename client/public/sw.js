const CACHE_NAME = 'executive-society-v5-cache-bust-20251106-1910';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/logo.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - network first, fall back to cache ONLY for images/icons
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip WebSocket and other non-HTTP(S) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // NEVER cache HTML/JS/CSS/API - only cache images and icons
  const url = new URL(event.request.url);
  const isCacheable = /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i.test(url.pathname) || 
                      url.pathname === '/manifest.json';

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache images and manifest
        if (isCacheable && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
        }
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache (only for images/manifest)
        if (isCacheable) {
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
            
              // If not in cache, return offline page for navigation requests
              if (event.request.mode === 'navigate') {
                return caches.match('/');
              }
            });
        }
      })
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body || '',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View',
      },
      {
        action: 'close',
        title: 'Close',
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'The Executive Society', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // For Spark It! notifications (/spark), always open a new window
      // This prevents focusing the wrong user's session when multiple users are logged in
      if (urlToOpen === '/spark' || urlToOpen.startsWith('/spark')) {
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
        return;
      }
      
      // For other notifications, try to focus existing window
      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        const targetPath = new URL(urlToOpen, self.location.origin).pathname;
        
        if (clientUrl.pathname === targetPath && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no matching window found, open new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Push subscription change handler
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('Push subscription changed');
});
