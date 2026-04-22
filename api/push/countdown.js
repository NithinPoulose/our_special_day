const {
  broadcastPushNotification,
  createCountdownPayload,
  ensureWebPushConfigured,
} = require('../_lib/push-notifications');
const { getAuthorizationError, isAuthorizedRequest } = require('../_lib/push-security');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!isAuthorizedRequest(req)) {
    return res.status(401).json({ error: getAuthorizationError() });
  }

  try {
    ensureWebPushConfigured();
    const result = await broadcastPushNotification(createCountdownPayload());

    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to send the countdown push notification.',
    });
  }
};