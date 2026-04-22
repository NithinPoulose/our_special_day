const {
  broadcastPushNotification,
  createCountdownPayload,
  createLoveNotePayload,
  ensureWebPushConfigured,
} = require('../_lib/push-notifications');
const { getRedisClient } = require('../_lib/push-store');

const PUSH_TIME_ZONE = process.env.PUSH_TIME_ZONE ?? 'Asia/Kolkata';
const SPECIAL_DATE_KEY = '2026-04-22';
const COUNTDOWN_START_DATE_KEY = '2026-04-23';
const RANDOM_WINDOW_START_MINUTE = 10 * 60;
const RANDOM_WINDOW_END_MINUTE = 22 * 60;
const RANDOM_INTERVAL_MINUTES = 5;
const SPECIAL_TARGET = {
  minuteOfDay: 16 * 60 + 55,
  title: '🌙 Evening Love Note',
  body: '4:55 already... sending one special love note through Chrome just to verify it is working! 🫶',
  key: '1655',
};

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

function isInFiveMinuteWindow(minuteOfDay, targetMinuteOfDay) {
  return minuteOfDay >= targetMinuteOfDay && minuteOfDay < targetMinuteOfDay + 5;
}

function createRandomTargetMinute() {
  const totalSteps =
    (RANDOM_WINDOW_END_MINUTE - RANDOM_WINDOW_START_MINUTE) / RANDOM_INTERVAL_MINUTES;
  const randomStep = Math.floor(Math.random() * (totalSteps + 1));

  return RANDOM_WINDOW_START_MINUTE + randomStep * RANDOM_INTERVAL_MINUTES;
}

function isValidRandomState(value) {
  return Boolean(value && Number.isInteger(value.targetMinute) && typeof value.sent === 'boolean');
}

async function getDailyRandomState(redis, dateKey) {
  const stateKey = `push:random-love-note:${dateKey}`;
  const storedState = await redis.get(stateKey);

  if (isValidRandomState(storedState)) {
    return { stateKey, state: storedState };
  }

  const nextState = {
    targetMinute: createRandomTargetMinute(),
    sent: false,
  };

  await redis.set(stateKey, nextState);

  return { stateKey, state: nextState };
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

    if (dateKey === SPECIAL_DATE_KEY && isInFiveMinuteWindow(minuteOfDay, SPECIAL_TARGET.minuteOfDay)) {
      const sentStateKey = `push:special:${SPECIAL_DATE_KEY}:${SPECIAL_TARGET.key}`;
      const alreadySent = await redis.get(sentStateKey);

      if (alreadySent) {
        return res.status(200).json({
          ok: true,
          skipped: 'already-sent',
          targetTime: formatMinuteOfDay(SPECIAL_TARGET.minuteOfDay),
          timeZone: PUSH_TIME_ZONE,
        });
      }

      const result = await broadcastPushNotification({
        title: SPECIAL_TARGET.title,
        body: SPECIAL_TARGET.body,
        tag: `special-${SPECIAL_TARGET.key}`,
        url: '/',
      });

      await redis.set(sentStateKey, {
        sent: true,
        sentAt: formatMinuteOfDay(minuteOfDay),
      });

      return res.status(200).json({
        ok: true,
        ...result,
        targetTime: formatMinuteOfDay(SPECIAL_TARGET.minuteOfDay),
        timeZone: PUSH_TIME_ZONE,
      });
    }

    if (
      dateKey >= COUNTDOWN_START_DATE_KEY &&
      isInFiveMinuteWindow(minuteOfDay, 0)
    ) {
      const sentStateKey = `push:countdown:${dateKey}`;
      const alreadySent = await redis.get(sentStateKey);

      if (alreadySent) {
        return res.status(200).json({
          ok: true,
          skipped: 'already-sent',
          targetTime: '00:00',
          timeZone: PUSH_TIME_ZONE,
        });
      }

      const result = await broadcastPushNotification(createCountdownPayload());

      await redis.set(sentStateKey, {
        sent: true,
        sentAt: formatMinuteOfDay(minuteOfDay),
      });

      return res.status(200).json({
        ok: true,
        ...result,
        targetTime: '00:00',
        timeZone: PUSH_TIME_ZONE,
      });
    }

    if (dateKey >= COUNTDOWN_START_DATE_KEY) {
      const { stateKey, state } = await getDailyRandomState(redis, dateKey);

      if (state.sent) {
        return res.status(200).json({
          ok: true,
          skipped: 'already-sent',
          targetTime: formatMinuteOfDay(state.targetMinute),
          timeZone: PUSH_TIME_ZONE,
        });
      }

      if (isInFiveMinuteWindow(minuteOfDay, state.targetMinute)) {
        const result = await broadcastPushNotification(createLoveNotePayload());

        await redis.set(stateKey, {
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
      }

      if (
        minuteOfDay >= RANDOM_WINDOW_START_MINUTE &&
        minuteOfDay < RANDOM_WINDOW_END_MINUTE + RANDOM_INTERVAL_MINUTES
      ) {
        return res.status(200).json({
          ok: true,
          skipped: 'waiting-for-random-window',
          targetTime: formatMinuteOfDay(state.targetMinute),
          currentTime: formatMinuteOfDay(minuteOfDay),
          timeZone: PUSH_TIME_ZONE,
        });
      }
    }

    if (dateKey < SPECIAL_DATE_KEY) {
      return res.status(200).json({
        ok: true,
        skipped: 'before-schedule-window',
        timeZone: PUSH_TIME_ZONE,
      });
    }

    return res.status(200).json({
      ok: true,
      skipped: 'outside-send-window',
      currentTime: formatMinuteOfDay(minuteOfDay),
      timeZone: PUSH_TIME_ZONE,
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to send the scheduled push notification.',
    });
  }
};