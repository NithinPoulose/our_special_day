const {
  broadcastPushNotification,
  ensureWebPushConfigured,
} = require('../_lib/push-notifications');

function isAuthorizedRequest(req) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return true;
  }

  return req.headers.authorization === `Bearer ${secret}`;
}

function toOptionalString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getPayloadFromRequest(req) {
  const body = req.body && typeof req.body === 'object' ? req.body : null;

  if (!body) {
    return null;
  }

  const title = toOptionalString(body.title);
  const bodyText = toOptionalString(body.body);

  if (!title || !bodyText) {
    return null;
  }

  return {
    title,
    body: bodyText,
    tag: toOptionalString(body.tag) ?? 'scheduled-reminder',
    url: toOptionalString(body.url) ?? '/',
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!isAuthorizedRequest(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const payload = getPayloadFromRequest(req);

  if (!payload) {
    return res.status(400).json({
      error: 'Invalid reminder payload. Provide title and body as strings.',
    });
  }

  try {
    ensureWebPushConfigured();
    const result = await broadcastPushNotification(payload);

    return res.status(200).json({ ok: true, ...result, tag: payload.tag });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : 'Unable to send the scheduled reminder.',
    });
  }
};