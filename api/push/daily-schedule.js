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

function isAuthorizedRequest(req) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return true;
  }

  return req.headers.authorization === `Bearer ${secret}`;
}

function buildBaseUrl() {
  const configuredBaseUrl = process.env.PUSH_BASE_URL;

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, '');
  }

  return 'https://neerajanithin-specialday.vercel.app';
}

function isValidRandomState(value) {
  return Boolean(
    value && Number.isInteger(value.targetMinute) && typeof value.sent === 'boolean'
  );
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

    const { dateKey, secondOfDay } = getTimeParts();
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
      const callbackUrl = `${buildBaseUrl()}/api/push/random-dispatch?date=${dateKey}`;
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