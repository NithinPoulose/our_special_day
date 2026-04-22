const QSTASH_BASE_URL = process.env.QSTASH_BASE_URL ?? 'https://qstash.upstash.io';

function ensureQStashConfigured() {
  const token = process.env.QSTASH_TOKEN;

  if (!token) {
    throw new Error('QStash is not configured. Add QSTASH_TOKEN in Vercel.');
  }

  return {
    token,
    baseUrl: QSTASH_BASE_URL,
  };
}

async function scheduleQStashRequest({ destinationUrl, delaySeconds, body, forwardAuthorization }) {
  const { token, baseUrl } = ensureQStashConfigured();
  const response = await fetch(`${baseUrl}/v2/publish/${destinationUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Upstash-Delay': `${Math.max(delaySeconds, 0)}s`,
      ...(forwardAuthorization
        ? {
            'Upstash-Forward-Authorization': forwardAuthorization,
          }
        : {}),
    },
    body: JSON.stringify(body ?? {}),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`QStash scheduling failed: ${errorText}`);
  }

  return response.json();
}

module.exports = {
  ensureQStashConfigured,
  scheduleQStashRequest,
};