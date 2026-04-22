const {
  broadcastPushNotification,
  ensureWebPushConfigured,
} = require('../_lib/push-notifications');
const { getRedisClient } = require('../_lib/push-store');

const PUSH_TIME_ZONE = process.env.PUSH_TIME_ZONE ?? 'Asia/Kolkata';
const SPECIAL_DATE_KEY = '2026-04-22';
const TARGETS = [
  {
    minuteOfDay: 16 * 60 + 30,
    title: '🌙 Evening Love Note',
    body: '4:30 already... sending one more hug through Chrome before the evening begins! 🫶',
    key: '1630',
  },
];

function getTimeParts(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: PUSH_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const hour = Number(values.hour);
  const minute = Number(values.minute);

  return {
    dateKey: `${values.year}-${values.month}-${values.day}`,
    minuteOfDay: hour * 60 + minute,
  };
}

function formatMinuteOfDay(minuteOfDay) {
  const hours = String(Math.floor(minuteOfDay / 60)).padStart(2, '0');
  const minutes = String(minuteOfDay % 60).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function isAuthorizedRequest(req) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return true;
  }

  return req.headers.authorization === `Bearer ${secret}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!isAuthorizedRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    ensureWebPushConfigured();

    const redis = getRedisClient();

    if (!redis) {
      throw new Error(
        'Redis storage is not configured. Add an Upstash Redis integration to Vercel first.'
      );
    }

    const { dateKey, minuteOfDay } = getTimeParts();

    if (dateKey !== SPECIAL_DATE_KEY) {
      return res.status(200).json({
        ok: true,
        skipped: 'outside-special-date',
        timeZone: PUSH_TIME_ZONE,
      });
    }

    const target = TARGETS.find(
      (currentTarget) =>
        minuteOfDay >= currentTarget.minuteOfDay && minuteOfDay < currentTarget.minuteOfDay + 5
    );

    if (!target) {
      return res.status(200).json({
        ok: true,
        skipped: 'outside-special-window',
        currentTime: formatMinuteOfDay(minuteOfDay),
        timeZone: PUSH_TIME_ZONE,
      });
    }

    const sentStateKey = `push:special:${SPECIAL_DATE_KEY}:${target.key}`;
    const alreadySent = await redis.get(sentStateKey);

    if (alreadySent) {
      return res.status(200).json({
        ok: true,
        skipped: 'already-sent',
        targetTime: formatMinuteOfDay(target.minuteOfDay),
        timeZone: PUSH_TIME_ZONE,
      });
    }

    const result = await broadcastPushNotification({
      title: target.title,
      body: target.body,
      tag: `special-${target.key}`,
      url: '/',
    });

    await redis.set(sentStateKey, {
      sent: true,
      sentAt: formatMinuteOfDay(minuteOfDay),
    });

    return res.status(200).json({
      ok: true,
      ...result,
      targetTime: formatMinuteOfDay(target.minuteOfDay),
      timeZone: PUSH_TIME_ZONE,
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to send the special push notification.',
    });
  }
};