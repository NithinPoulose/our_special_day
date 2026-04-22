const {
  broadcastPushNotification,
  createLoveNotePayload,
  ensureWebPushConfigured,
} = require('../_lib/push-notifications');
const { getRedisClient } = require('../_lib/push-store');

const RANDOM_NOTE_STATE_KEY = 'push:love-note-state';
const PUSH_TIME_ZONE = process.env.PUSH_TIME_ZONE ?? 'Asia/Kolkata';
const RANDOM_WINDOW_START_MINUTE = 10 * 60;
const RANDOM_WINDOW_END_MINUTE = 22 * 60;
const RANDOM_INTERVAL_MINUTES = 5;

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

function createRandomTargetMinute() {
  const totalSteps =
    (RANDOM_WINDOW_END_MINUTE - RANDOM_WINDOW_START_MINUTE) / RANDOM_INTERVAL_MINUTES;
  const randomStep = Math.floor(Math.random() * (totalSteps + 1));

  return RANDOM_WINDOW_START_MINUTE + randomStep * RANDOM_INTERVAL_MINUTES;
}

function isValidState(value) {
  return Boolean(
    value &&
      typeof value.dateKey === 'string' &&
      Number.isInteger(value.targetMinute) &&
      typeof value.sent === 'boolean'
  );
}

async function getDailyRandomState() {
  const redis = getRedisClient();

  if (!redis) {
    throw new Error(
      'Redis storage is not configured. Add an Upstash Redis integration to Vercel first.'
    );
  }

  const { dateKey } = getTimeParts();
  const storedState = await redis.get(RANDOM_NOTE_STATE_KEY);

  if (isValidState(storedState) && storedState.dateKey === dateKey) {
    return { redis, state: storedState };
  }

  const nextState = {
    dateKey,
    targetMinute: createRandomTargetMinute(),
    sent: false,
  };

  await redis.set(RANDOM_NOTE_STATE_KEY, nextState);

  return { redis, state: nextState };
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
    const { minuteOfDay } = getTimeParts();

    if (
      minuteOfDay < RANDOM_WINDOW_START_MINUTE ||
      minuteOfDay > RANDOM_WINDOW_END_MINUTE
    ) {
      return res.status(200).json({
        ok: true,
        skipped: 'outside-random-window',
        timeZone: PUSH_TIME_ZONE,
      });
    }

    ensureWebPushConfigured();
    const { redis, state } = await getDailyRandomState();

    if (state.sent) {
      return res.status(200).json({
        ok: true,
        skipped: 'already-sent-today',
        targetTime: formatMinuteOfDay(state.targetMinute),
        timeZone: PUSH_TIME_ZONE,
      });
    }

    if (minuteOfDay < state.targetMinute) {
      return res.status(200).json({
        ok: true,
        skipped: 'not-time-yet',
        targetTime: formatMinuteOfDay(state.targetMinute),
        timeZone: PUSH_TIME_ZONE,
      });
    }

    const result = await broadcastPushNotification(createLoveNotePayload());

    await redis.set(RANDOM_NOTE_STATE_KEY, {
      ...state,
      sent: true,
      sentAt: formatMinuteOfDay(minuteOfDay),
    });

    return res.status(200).json({
      ok: true,
      ...result,
      targetTime: formatMinuteOfDay(state.targetMinute),
      timeZone: PUSH_TIME_ZONE,
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to send the love note push notification.',
    });
  }
};