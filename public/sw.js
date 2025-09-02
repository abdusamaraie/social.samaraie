// Service Worker for Social Link Tree PWA
const CACHE_NAME = 'social-link-tree-v1';
const STATIC_CACHE = 'social-link-tree-static-v1';
const DYNAMIC_CACHE = 'social-link-tree-dynamic-v1';
const API_CACHE = 'social-link-tree-api-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  // Add other static assets as they become available
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/profile',
  '/api/links',
  '/api/analytics',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Service Worker: Caching static assets...');
      return cache.addAll(STATIC_ASSETS);
    }).catch((error) => {
      console.error('Service Worker: Failed to cache static assets:', error);
    })
  );
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients...');
      return self.clients.claim();
    })
  );
});

// Fetch event - handle requests with cache-first strategy for static assets,
// network-first for API calls, and offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    request.method === 'GET' &&
    (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) ||
     STATIC_ASSETS.includes(url.pathname))
  );
}

function isApiRequest(request) {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('supabase') ||
    API_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint))
  );
}

function isImageRequest(request) {
  const url = new URL(request.url);
  return request.method === 'GET' && url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/);
}

// Handle static assets - cache first strategy
function handleStaticAsset(request) {
  return caches.match(request).then((response) => {
    if (response) {
      return response;
    }

    return fetch(request).then((response) => {
      // Cache successful responses
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(STATIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return response;
    }).catch(() => {
      // Return offline fallback for failed requests
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    });
  });
}

// Handle API requests - network first strategy with background sync
function handleApiRequest(request) {
  return fetch(request).then((response) => {
    // Cache successful GET requests
    if (request.method === 'GET' && response.status === 200) {
      const responseClone = response.clone();
      caches.open(API_CACHE).then((cache) => {
        cache.put(request, responseClone);
      });
    }
    return response;
  }).catch(() => {
    // Try cache for offline support
    return caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      // Queue for background sync if it's a POST/PUT/DELETE
      if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
        return queueForSync(request);
      }

      return new Response(JSON.stringify({ error: 'Offline', cached: false }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });
}

// Handle images - cache first with network fallback
function handleImageRequest(request) {
  return caches.match(request).then((response) => {
    if (response) {
      return response;
    }

    return fetch(request).then((response) => {
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return response;
    });
  });
}

// Handle page requests - network first with offline fallback
function handlePageRequest(request) {
  return fetch(request).then((response) => {
    // Cache successful page responses
    if (response.status === 200 && request.method === 'GET') {
      const responseClone = response.clone();
      caches.open(DYNAMIC_CACHE).then((cache) => {
        cache.put(request, responseClone);
      });
    }
    return response;
  }).catch(() => {
    // Try cache first
    return caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      // Return offline page
      return caches.match('/index.html').then((response) => {
        return response || new Response('Offline', { status: 503 });
      });
    });
  });
}

// Queue requests for background sync
function queueForSync(request) {
  return request.clone().text().then((body) => {
    const syncData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: body,
      timestamp: Date.now()
    };

    return idbKeyval.set(`sync-${Date.now()}`, syncData).then(() => {
      return new Response(JSON.stringify({
        message: 'Request queued for sync',
        queued: true
      }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });
}

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(processQueuedRequests());
  }
});

async function processQueuedRequests() {
  const keys = await idbKeyval.keys();
  const syncKeys = keys.filter(key => key.startsWith('sync-'));

  for (const key of syncKeys) {
    try {
      const syncData = await idbKeyval.get(key);
      if (syncData) {
        const response = await fetch(syncData.url, {
          method: syncData.method,
          headers: syncData.headers,
          body: syncData.body
        });

        if (response.ok) {
          await idbKeyval.del(key);
          console.log('Background sync successful:', syncData.url);
        }
      }
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }
}

// Push notification event (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: data
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Simple IndexedDB wrapper for background sync
const idbKeyval = {
  async get(key) {
    return new Promise((resolve) => {
      const request = indexedDB.open('pwa-sync-db', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('sync-store');
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('sync-store', 'readonly');
        const store = tx.objectStore('sync-store');
        const getRequest = store.get(key);
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => resolve(null);
      };
    });
  },

  async set(key, value) {
    return new Promise((resolve) => {
      const request = indexedDB.open('pwa-sync-db', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('sync-store');
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('sync-store', 'readwrite');
        const store = tx.objectStore('sync-store');
        store.put(value, key);
        tx.oncomplete = () => resolve(true);
      };
    });
  },

  async del(key) {
    return new Promise((resolve) => {
      const request = indexedDB.open('pwa-sync-db', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('sync-store');
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('sync-store', 'readwrite');
        const store = tx.objectStore('sync-store');
        store.delete(key);
        tx.oncomplete = () => resolve(true);
      };
    });
  },

  async keys() {
    return new Promise((resolve) => {
      const request = indexedDB.open('pwa-sync-db', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('sync-store');
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('sync-store', 'readonly');
        const store = tx.objectStore('sync-store');
        const getAllKeysRequest = store.getAllKeys();
        getAllKeysRequest.onsuccess = () => resolve(getAllKeysRequest.result);
        getAllKeysRequest.onerror = () => resolve([]);
      };
    });
  }
};
