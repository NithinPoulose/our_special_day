const { Redis } = require('@upstash/redis');
const { sanitizePushSubscription } = require('./push-security');

const SUBSCRIPTIONS_KEY = 'push:subscriptions';
const DEFAULT_MAX_STORED_SUBSCRIPTIONS = 250;

function getRedisClient() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

function getMaxStoredSubscriptions() {
  const configuredLimit = Number.parseInt(process.env.MAX_STORED_PUSH_SUBSCRIPTIONS ?? '', 10);

  if (Number.isInteger(configuredLimit) && configuredLimit > 0) {
    return configuredLimit;
  }

  return DEFAULT_MAX_STORED_SUBSCRIPTIONS;
}

function isValidStoredSubscription(value) {
  return Boolean(sanitizePushSubscription(value));
}

async function getStoredSubscriptions() {
  const redis = getRedisClient();

  if (!redis) {
    return [];
  }

  const subscriptions = await redis.get(SUBSCRIPTIONS_KEY);

  if (!Array.isArray(subscriptions)) {
    return [];
  }

  return subscriptions.map(sanitizePushSubscription).filter(Boolean);
}

async function saveStoredSubscriptions(subscriptions) {
  const redis = getRedisClient();

  if (!redis) {
    throw new Error(
      'Redis storage is not configured. Add an Upstash Redis integration to Vercel first.'
    );
  }

  if (subscriptions.length > getMaxStoredSubscriptions()) {
    throw new Error('Push subscription limit reached. Remove inactive subscriptions or raise MAX_STORED_PUSH_SUBSCRIPTIONS.');
  }

  await redis.set(SUBSCRIPTIONS_KEY, subscriptions);
}

async function upsertStoredSubscription(subscription) {
  const sanitizedSubscription = sanitizePushSubscription(subscription);

  if (!sanitizedSubscription) {
    throw new Error('Invalid push subscription payload.');
  }

  const currentSubscriptions = await getStoredSubscriptions();
  const nextSubscriptions = currentSubscriptions.filter(
    (currentSubscription) => currentSubscription.endpoint !== sanitizedSubscription.endpoint
  );

  nextSubscriptions.push(sanitizedSubscription);
  await saveStoredSubscriptions(nextSubscriptions);

  return nextSubscriptions;
}

async function removeStoredSubscription(endpoint) {
  const currentSubscriptions = await getStoredSubscriptions();
  const nextSubscriptions = currentSubscriptions.filter(
    (currentSubscription) => currentSubscription.endpoint !== endpoint
  );

  if (nextSubscriptions.length === currentSubscriptions.length) {
    return nextSubscriptions;
  }

  await saveStoredSubscriptions(nextSubscriptions);

  return nextSubscriptions;
}

module.exports = {
  getRedisClient,
  getStoredSubscriptions,
  upsertStoredSubscription,
  removeStoredSubscription,
};