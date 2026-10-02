/**
 * Majedaar Restaurant Admin - Service Worker for Web Push Notifications
 * Handles incoming push events and notification clicks with deep-linking to Admin Panel.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: 'Majedaar Restaurant',
      body: event.data ? event.data.text() : '',
    };
  }

  const title = data.title || 'Majedaar Restaurant';
  const options = {
    body: data.body || '',
    icon: data.icon || '/brand/logo-full.png',
    badge: data.badge || '/brand/logo-full.png',
    data: data.data || {},
    vibrate: [200, 100, 200],
    tag: (data.data?.type || 'general') + '-' + Date.now(),
    renotify: true,
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        for (const client of clients) {
          client.postMessage({ type: 'PUSH_NOTIFICATION', payload: data });
        }
      }),
    ])
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const rawUrl = event.notification.data?.url || '/dashboard';
  const fullTargetUrl = new URL(rawUrl, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If an existing admin tab is open on this origin, focus and navigate it
      for (const client of clientList) {
        try {
          const clientOrigin = new URL(client.url, self.location.origin).origin;
          if (clientOrigin === self.location.origin && 'focus' in client) {
            if ('navigate' in client && fullTargetUrl) {
              return client.navigate(fullTargetUrl).then((navClient) => {
                return navClient ? navClient.focus() : client.focus();
              }).catch(() => client.focus());
            }
            return client.focus();
          }
        } catch (_) {}
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(fullTargetUrl);
      }
    })
  );
});
