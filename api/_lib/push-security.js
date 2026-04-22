const SAFE_APP_URL_BASE = 'https://app.local';
const MAX_PUSH_ENDPOINT_LENGTH = 2048;
const MAX_PUSH_KEY_LENGTH = 256;
const PUSH_KEY_PATTERN = /^[A-Za-z0-9_-]+$/;

function getCronSecret() {
  return typeof process.env.CRON_SECRET === 'string' ? process.env.CRON_SECRET.trim() : '';
}

function isAuthorizedRequest(req) {
  const secret = getCronSecret();

  if (!secret) {
    return false;
  }

  return req.headers.authorization === `Bearer ${secret}`;
}

function getAuthorizationError() {
  return 'Unauthorized. Configure CRON_SECRET and send a matching bearer token.';
}

function toOptionalString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function toSafeAppPath(value) {
  const normalizedValue = toOptionalString(value);

  if (!normalizedValue) {
    return '/';
  }

  if (!normalizedValue.startsWith('/') || normalizedValue.startsWith('//')) {
    return null;
  }

  try {
    const parsedUrl = new URL(normalizedValue, SAFE_APP_URL_BASE);

    if (parsedUrl.origin !== SAFE_APP_URL_BASE) {
      return null;
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return null;
  }
}

function isSafePushEndpoint(endpoint) {
  try {
    const parsedUrl = new URL(endpoint);

    return (
      parsedUrl.protocol === 'https:' &&
      Boolean(parsedUrl.hostname) &&
      !parsedUrl.username &&
      !parsedUrl.password
    );
  } catch {
    return false;
  }
}

function isValidPushKey(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= MAX_PUSH_KEY_LENGTH &&
    PUSH_KEY_PATTERN.test(value)
  );
}

function sanitizePushSubscription(value) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const endpoint = toOptionalString(value.endpoint);
  const keys = value.keys && typeof value.keys === 'object' ? value.keys : null;
  const auth = typeof keys?.auth === 'string' ? keys.auth.trim() : '';
  const p256dh = typeof keys?.p256dh === 'string' ? keys.p256dh.trim() : '';

  if (
    !endpoint ||
    endpoint.length > MAX_PUSH_ENDPOINT_LENGTH ||
    !isSafePushEndpoint(endpoint) ||
    !isValidPushKey(auth) ||
    !isValidPushKey(p256dh)
  ) {
    return null;
  }

  return {
    endpoint,
    expirationTime: Number.isFinite(value.expirationTime) ? value.expirationTime : null,
    keys: {
      auth,
      p256dh,
    },
  };
}

module.exports = {
  getAuthorizationError,
  isAuthorizedRequest,
  sanitizePushSubscription,
  toOptionalString,
  toSafeAppPath,
};