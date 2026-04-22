// Temporary endpoint to trigger a custom notification at 21:45 (9:45pm) and 21:50 (9:50pm) IST today
// Does not affect existing scheduling logic

const { broadcastPushNotification, ensureWebPushConfigured } = require('../_lib/push-notifications');
const { getRedisClient } = require('../_lib/push-store');
const { PUSH_TIME_ZONE, formatMinuteOfDay, getTimeParts } = require('../_lib/push-schedule');

// Customize your notification here
const customNotifications = [
  {
    hour: 21,
    minute: 45,
    title: 'Cute Night Reminder',
    body: 'Here’s a cute reminder for you at 9:45pm! 💖',
    tag: 'custom-cute-945',
    url: '/special',
  },
  {
    hour: 21,
    minute: 50,
    title: 'Extra Cute Night!',
    body: 'Here’s an extra cute reminder at 9:50pm! 🥰',
    tag: 'custom-cute-950',
    url: '/special',
  },
];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    ensureWebPushConfigured();
    const redis = getRedisClient();
    if (!redis) {
      throw new Error('Redis storage is not configured.');
    }

    const now = new Date();
    const { dateKey } = getTimeParts(now);
    const results = [];

    for (const notif of customNotifications) {
      // Only trigger if today
      const scheduledDate = new Date(now);
      scheduledDate.setHours(notif.hour, notif.minute, 0, 0);
      if (scheduledDate > now) {
        // Schedule with setTimeout (for demo; in production, use a job queue or QStash)
        const delay = scheduledDate - now;
        setTimeout(async () => {
          await broadcastPushNotification({
            title: notif.title,
            body: notif.body,
            tag: notif.tag,
            url: notif.url,
          });
        }, delay);
        results.push({ scheduledFor: `${notif.hour}:${notif.minute}`, status: 'scheduled' });
      } else {
        results.push({ scheduledFor: `${notif.hour}:${notif.minute}`, status: 'skipped (time passed)' });
      }
    }

    return res.status(200).json({ ok: true, results, timeZone: PUSH_TIME_ZONE });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unable to schedule custom notification.' });
  }
};
