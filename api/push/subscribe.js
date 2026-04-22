const { upsertStoredSubscription } = require('../_lib/push-store');
const { ensureWebPushConfigured } = require('../_lib/push-notifications');
const { sanitizePushSubscription } = require('../_lib/push-security');

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
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    ensureWebPushConfigured();

    const subscription = sanitizePushSubscription(parseRequestBody(req));

    if (!subscription) {
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