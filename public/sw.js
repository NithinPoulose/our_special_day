/// Service Worker for background web push notifications

function showNotification(payload = {}) {
  const title = payload.title || '💕 Nithin & Neeraja';
  const body = payload.body || 'A new love note is waiting for you.';
  const tag = payload.tag || 'wedding-countdown';
  const url = payload.url || '/';

  return self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag,
    renotify: true,
    requireInteraction: false,
    data: { url },
  });
}

function readPushPayload(event) {
  if (!event.data) {
    return {};
  }

  try {
    return event.data.json();
  } catch {
    return { body: event.data.text() };
  }
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for messages from the app to show notifications
self.addEventListener('push', (event) => {
  const payload = readPushPayload(event);
  event.waitUntil(showNotification(payload));
});

self.addEventListener('message', (event) => {
  const { type, title, body, tag, url } = event.data || {};

  if (type === 'SHOW_NOTIFICATION') {
    event.waitUntil(showNotification({ title, body, tag, url }));
  }
});

// Handle notification click — focus or open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
