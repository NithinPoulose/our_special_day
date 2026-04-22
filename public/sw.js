/// Service Worker for push-style notifications on mobile browsers

const WEDDING_DATE = '2026-08-27T00:00:00';
const GROOM = 'Nithin';
const BRIDE = 'Neeraja';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for messages from the app to show notifications
self.addEventListener('message', (event) => {
  const { type, title, body, tag } = event.data || {};
  if (type === 'SHOW_NOTIFICATION') {
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: 'favicon.ico',
        badge: 'favicon.ico',
        tag: tag || 'wedding-countdown',
        renotify: true,
        requireInteraction: false,
      })
    );
  }
});

// Handle notification click — focus or open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow('/');
    })
  );
});
