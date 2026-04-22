const {
  broadcastPushNotification,
  ensureWebPushConfigured,
} = require('../_lib/push-notifications');
const {
  getAuthorizationError,
  isAuthorizedRequest,
  toOptionalString,
  toSafeAppPath,
} = require('../_lib/push-security');

function getPayloadFromRequest(req) {
  const body = req.body && typeof req.body === 'object' ? req.body : null;

  if (!body) {
    return null;
  }

  const title = toOptionalString(body.title);
  const bodyText = toOptionalString(body.body);
  const url = toSafeAppPath(body.url);

  if (!title || !bodyText || !url) {
    return null;
  }

  return {
    title,
    body: bodyText,
    tag: toOptionalString(body.tag) ?? 'scheduled-reminder',
    url,
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!isAuthorizedRequest(req)) {
    return res.status(401).json({ error: getAuthorizationError() });
  }

  const payload = getPayloadFromRequest(req);

  if (!payload) {
    return res.status(400).json({
      error: 'Invalid reminder payload. Provide title and body as strings and an optional same-origin path starting with /.',
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