const {
  broadcastPushNotification,
  createLoveNotePayload,
  ensureWebPushConfigured,
} = require('../_lib/push-notifications');
const { getRedisClient } = require('../_lib/push-store');
const {
  PUSH_TIME_ZONE,
  formatMinuteOfDay,
  formatSecondOfDay,
  getTimeParts,
} = require('../_lib/push-schedule');
const { getAuthorizationError, isAuthorizedRequest } = require('../_lib/push-security');

function getDateKeyFromRequest(req) {
  if (typeof req.query?.date === 'string') {
    return req.query.date;
  }

  const url = new URL(req.url, 'https://example.com');

  return url.searchParams.get('date');
}

function isValidRandomState(value) {
  return Boolean(
    value && Number.isInteger(value.targetMinute) && typeof value.sent === 'boolean'
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!isAuthorizedRequest(req)) {
    return res.status(401).json({ error: getAuthorizationError() });
  }

  try {
    ensureWebPushConfigured();

    const redis = getRedisClient();

    if (!redis) {
      throw new Error(
        'Redis storage is not configured. Add an Upstash Redis integration to Vercel first.'
      );
    }

    const dateKey = getDateKeyFromRequest(req);

    if (!dateKey) {
      return res.status(400).json({ error: 'Missing date query parameter.' });
    }

    const stateKey = `push:random-love-note:${dateKey}`;
    const state = await redis.get(stateKey);

    if (!isValidRandomState(state)) {
      return res.status(200).json({
        ok: true,
        skipped: 'missing-random-state',
        dateKey,
        timeZone: PUSH_TIME_ZONE,
      });
    }

    if (state.sent) {
      return res.status(200).json({
        ok: true,
        skipped: 'already-sent',
        dateKey,
        targetTime: formatMinuteOfDay(state.targetMinute),
        timeZone: PUSH_TIME_ZONE,
      });
    }

    const result = await broadcastPushNotification(createLoveNotePayload());
    const { secondOfDay } = getTimeParts();

    await redis.set(stateKey, {
      ...state,
      sent: true,
      sentAt: formatSecondOfDay(secondOfDay),
    });

    return res.status(200).json({
      ok: true,
      ...result,
      dateKey,
      targetTime: formatMinuteOfDay(state.targetMinute),
      timeZone: PUSH_TIME_ZONE,
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to send the random push notification.',
    });
  }
};