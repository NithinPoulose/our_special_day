const { Redis } = require('@upstash/redis');

const SUBSCRIPTIONS_KEY = 'push:subscriptions';

function getRedisClient() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

function isValidStoredSubscription(value) {
  return Boolean(
    value &&
      typeof value.endpoint === 'string' &&
      value.keys &&
      typeof value.keys.auth === 'string' &&
      typeof value.keys.p256dh === 'string'
  );
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

  return subscriptions.filter(isValidStoredSubscription);
}

async function saveStoredSubscriptions(subscriptions) {
  const redis = getRedisClient();

  if (!redis) {
    throw new Error(
      'Redis storage is not configured. Add an Upstash Redis integration to Vercel first.'
    );
  }

  await redis.set(SUBSCRIPTIONS_KEY, subscriptions);
}

async function upsertStoredSubscription(subscription) {
  const currentSubscriptions = await getStoredSubscriptions();
  const nextSubscriptions = currentSubscriptions.filter(
    (currentSubscription) => currentSubscription.endpoint !== subscription.endpoint
  );

  nextSubscriptions.push(subscription);
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