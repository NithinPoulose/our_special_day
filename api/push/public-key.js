const { getWebPushConfiguration } = require('../_lib/push-notifications');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { publicKey } = getWebPushConfiguration();

  if (!publicKey) {
    return res.status(500).json({
      error: 'WEB_PUSH_PUBLIC_KEY is not configured on the server.',
    });
  }

  return res.status(200).json({ publicKey });
};