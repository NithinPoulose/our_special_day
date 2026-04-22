const webPush = require('web-push');
const { getStoredSubscriptions, removeStoredSubscription } = require('./push-store');

const WEDDING_DATE = '2026-08-27T00:00:00';

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getWebPushConfiguration() {
  return {
    publicKey: process.env.WEB_PUSH_PUBLIC_KEY ?? '',
    privateKey: process.env.WEB_PUSH_PRIVATE_KEY ?? '',
    subject: process.env.WEB_PUSH_SUBJECT ?? 'mailto:notifications@example.com',
  };
}

function ensureWebPushConfigured() {
  const configuration = getWebPushConfiguration();

  if (!configuration.publicKey || !configuration.privateKey) {
    throw new Error(
      'Web Push is not configured. Add WEB_PUSH_PUBLIC_KEY and WEB_PUSH_PRIVATE_KEY in Vercel.'
    );
  }

  webPush.setVapidDetails(
    configuration.subject,
    configuration.publicKey,
    configuration.privateKey
  );

  return configuration;
}

function getCountdownDays() {
  const weddingDate = new Date(WEDDING_DATE);
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    return 0;
  }

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function createWelcomePayload() {
  return {
    title: '🔔 Push Notifications Enabled',
    body: 'You will now receive wedding updates even after Chrome is closed.',
    tag: 'push-enabled',
    url: '/',
  };
}

function createCountdownPayload() {
  const days = getCountdownDays();

  if (days <= 0) {
    return {
      title: '💍 Happy Wedding Day!',
      body: 'Today is Nithin & Neeraja\'s wedding day! Wishing eternal love and happiness!',
      tag: 'wedding-day',
      url: '/',
    };
  }

  const messages = [
    `${days} days until Nithin & Neeraja become one! 💕`,
    `Only ${days} days left until the big day! ✨`,
    `${days} more sunrises until forever begins! 🌅`,
    `Counting down... ${days} days to the wedding! 💒`,
    `${days} days of waiting, a lifetime of love ahead! 💑`,
    `${days} sleeps until the most magical day! 🌟`,
    `Another day closer to "I do"... ${days} left! 💐`,
    `${days} days — the universe is aligning for you two! 🪐`,
  ];

  return {
    title: '💍 Nithin & Neeraja Wedding Countdown',
    body: randomItem(messages),
    tag: 'wedding-countdown',
    url: '/',
  };
}

function createLoveNotePayload() {
  const days = getCountdownDays();
  const titles = [
    '💌 A Little Love Note',
    '🦋 Thinking of You',
    '🌸 A Whisper of Love',
    '🧸 Sending Hugs',
    '🫶 My Favorite Person',
    '🌙 A Sweet Thought',
  ];
  const messages = [
    `Just thinking about you... ${days} days to go! 💭`,
    `You + Me = Forever. ${days} days left! 💕`,
    `Every moment brings us closer... ${days} days! ✨`,
    `You're my today, tomorrow, and always. ${days} days! 🥰`,
    `${days} days until I get to hold your hand forever! 🤝`,
    `You make ${days} days feel like a beautiful adventure! 🦋`,
    `Psst... you're my favorite notification! ${days} days 📱`,
    `Life is better with you in it. ${days} days to forever! 🌈`,
  ];

  return {
    title: randomItem(titles),
    body: randomItem(messages),
    tag: 'wedding-love-note',
    url: '/',
  };
}

async function sendPushToSubscription(subscription, payload) {
  ensureWebPushConfigured();

  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (error) {
    if (error && (error.statusCode === 404 || error.statusCode === 410)) {
      await removeStoredSubscription(subscription.endpoint);
      return false;
    }

    throw error;
  }
}

async function broadcastPushNotification(payload) {
  ensureWebPushConfigured();
  const subscriptions = await getStoredSubscriptions();
  const deliveryResults = await Promise.allSettled(
    subscriptions.map((subscription) => sendPushToSubscription(subscription, payload))
  );

  const delivered = deliveryResults.filter(
    (result) => result.status === 'fulfilled' && result.value
  ).length;
  const failed = deliveryResults.length - delivered;

  return {
    delivered,
    failed,
    total: subscriptions.length,
  };
}

module.exports = {
  ensureWebPushConfigured,
  createWelcomePayload,
  createCountdownPayload,
  createLoveNotePayload,
  broadcastPushNotification,
  sendPushToSubscription,
  getWebPushConfiguration,
};