const { upsertStoredSubscription } = require('../_lib/push-store');
const { ensureWebPushConfigured } = require('../_lib/push-notifications');

function parseRequestBody(req) {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  return req.body ?? null;
}

function isValidSubscription(value) {
  return Boolean(
    value &&
      typeof value.endpoint === 'string' &&
      value.keys &&
      typeof value.keys.auth === 'string' &&
      typeof value.keys.p256dh === 'string'
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    ensureWebPushConfigured();

    const subscription = parseRequestBody(req);

    if (!isValidSubscription(subscription)) {
      return res.status(400).json({ error: 'Invalid push subscription payload.' });
    }

    await upsertStoredSubscription(subscription);

    return res.status(201).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to save the push subscription right now.',
    });
  }
};