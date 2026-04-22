const {
  broadcastPushNotification,
  createCountdownPayload,
  ensureWebPushConfigured,
} = require('../_lib/push-notifications');
const { getRedisClient } = require('../_lib/push-store');
const { scheduleQStashRequest } = require('../_lib/qstash');
const {
  PUSH_TIME_ZONE,
  createRandomTargetMinute,
  formatMinuteOfDay,
  formatSecondOfDay,
  getTimeParts,
} = require('../_lib/push-schedule');

const TEST_MODE = true;
const TEST_DATE_KEY = '2026-04-22';
const TEST_TARGET_MINUTE = 17 * 60 + 15;
const TEST_NOTIFICATION = {
  title: '🔔 Push Test',
  body: 'This is the 5:15 PM test notification to verify push is working.',
  tag: 'push-test-1715',
};

function isAuthorizedRequest(req) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return true;
  }

  return req.headers.authorization === `Bearer ${secret}`;
}

function buildBaseUrl(req) {
  const host = req.headers['x-forwarded-host'] ?? req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] ?? 'https';

  if (!host) {
    throw new Error('Unable to resolve the production host for QStash scheduling.');
  }

  return `${protocol}://${host}`;
}

function isValidRandomState(value) {
  return Boolean(
    value && Number.isInteger(value.targetMinute) && typeof value.sent === 'boolean'
  );
}

function isInFiveMinuteWindow(minuteOfDay, targetMinute) {
  return minuteOfDay >= targetMinute && minuteOfDay < targetMinute + 5;
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

    const { dateKey, minuteOfDay, secondOfDay } = getTimeParts();

    if (TEST_MODE) {
      if (dateKey !== TEST_DATE_KEY || !isInFiveMinuteWindow(minuteOfDay, TEST_TARGET_MINUTE)) {
        return res.status(200).json({
          ok: true,
          skipped: 'test-window-only',
          currentTime: formatMinuteOfDay(minuteOfDay),
          timeZone: PUSH_TIME_ZONE,
        });
      }

      const testStateKey = `push:test:${TEST_DATE_KEY}:${TEST_TARGET_MINUTE}`;
      const alreadySent = await redis.get(testStateKey);

      if (alreadySent) {
        return res.status(200).json({
          ok: true,
          skipped: 'already-sent',
          targetTime: formatMinuteOfDay(TEST_TARGET_MINUTE),
          timeZone: PUSH_TIME_ZONE,
        });
      }

      const result = await broadcastPushNotification({
        ...TEST_NOTIFICATION,
        url: '/',
      });

      await redis.set(testStateKey, {
        sent: true,
        sentAt: formatSecondOfDay(secondOfDay),
      });

      return res.status(200).json({
        ok: true,
        ...result,
        targetTime: formatMinuteOfDay(TEST_TARGET_MINUTE),
        timeZone: PUSH_TIME_ZONE,
      });
    }

    const countdownStateKey = `push:countdown:${dateKey}`;
    const countdownAlreadySent = await redis.get(countdownStateKey);
    let countdownResult = null;

    if (!countdownAlreadySent) {
      const result = await broadcastPushNotification(createCountdownPayload());

      await redis.set(countdownStateKey, {
        sent: true,
        sentAt: formatSecondOfDay(secondOfDay),
      });

      countdownResult = result;
    }

    const randomStateKey = `push:random-love-note:${dateKey}`;
    const storedRandomState = await redis.get(randomStateKey);
    const randomState = isValidRandomState(storedRandomState)
      ? storedRandomState
      : {
          targetMinute: createRandomTargetMinute(),
          sent: false,
        };

    if (!isValidRandomState(storedRandomState)) {
      await redis.set(randomStateKey, randomState);
    }

    if (!randomState.scheduledAt) {
      const delaySeconds = Math.max(randomState.targetMinute * 60 - secondOfDay, 0);
      const callbackUrl = `${buildBaseUrl(req)}/api/push/random-dispatch?date=${dateKey}`;
      const scheduleResult = await scheduleQStashRequest({
        destinationUrl: callbackUrl,
        delaySeconds,
        body: { dateKey },
        forwardAuthorization: process.env.CRON_SECRET
          ? `Bearer ${process.env.CRON_SECRET}`
          : undefined,
      });

      await redis.set(randomStateKey, {
        ...randomState,
        scheduledAt: formatSecondOfDay(secondOfDay),
        scheduleId:
          typeof scheduleResult?.messageId === 'string' ? scheduleResult.messageId : null,
      });

      return res.status(200).json({
        ok: true,
        countdown: countdownResult,
        randomTargetTime: formatMinuteOfDay(randomState.targetMinute),
        timeZone: PUSH_TIME_ZONE,
      });
    }

    return res.status(200).json({
      ok: true,
      skipped: 'already-scheduled',
      countdown: countdownResult,
      randomTargetTime: formatMinuteOfDay(randomState.targetMinute),
      timeZone: PUSH_TIME_ZONE,
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to send the daily push notification.',
    });
  }
};