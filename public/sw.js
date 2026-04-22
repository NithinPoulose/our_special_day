/// Service Worker for background web push notifications

function toSafeAppUrl(value) {
  if (typeof value !== 'string') {
    return `${self.location.origin}/`;
  }

  const normalizedValue = value.trim();

  if (!normalizedValue || !normalizedValue.startsWith('/') || normalizedValue.startsWith('//')) {
    return `${self.location.origin}/`;
  }

  try {
    const parsedUrl = new URL(normalizedValue, self.location.origin);

    if (parsedUrl.origin !== self.location.origin) {
      return `${self.location.origin}/`;
    }

    return parsedUrl.toString();
  } catch {
    return `${self.location.origin}/`;
  }
}

function showNotification(payload = {}) {
  const title = payload.title || '💕 Nithin & Neeraja';
  const body = payload.body || 'A new love note is waiting for you.';
  const tag = payload.tag || 'wedding-countdown';
  const url = toSafeAppUrl(payload.url);

  return self.registration.showNotification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
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
  const targetUrl = toSafeAppUrl(event.notification.data?.url);

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
