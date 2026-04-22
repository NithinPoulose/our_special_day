import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly permissionGranted = signal(false);
  private midnightTimer: ReturnType<typeof setTimeout> | null = null;
  private randomTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.checkPermission();
    this.scheduleMidnightNotification();
    this.scheduleRandomNotification();
    this.scheduleOneTime();
  }

  private checkPermission(): void {
    if (!('Notification' in window)) return;
    this.permissionGranted.set(Notification.permission === 'granted');
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    const granted = result === 'granted';
    this.permissionGranted.set(granted);
    return granted;
  }

  /**
   * Show a notification via the Service Worker (works on Android Chrome & iOS Safari).
   * Falls back to the basic Notification API on desktop if SW is unavailable.
   */
  async sendNotification(title: string, body: string, tag = 'wedding-countdown'): Promise<void> {
    if (!this.permissionGranted()) return;

    const swReg = await this.getServiceWorkerRegistration();
    if (swReg) {
      // Preferred path — works on mobile browsers
      await swReg.showNotification(title, {
        body,
        icon: 'favicon.ico',
        badge: 'favicon.ico',
        tag,
        renotify: true,
      } as NotificationOptions & { renotify: boolean });
    } else if ('Notification' in window) {
      // Desktop fallback
      const notification = new Notification(title, {
        body,
        icon: 'favicon.ico',
        badge: 'favicon.ico',
        tag,
      } as NotificationOptions);
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  private async getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) return null;
    try {
      return await navigator.serviceWorker.ready;
    } catch {
      return null;
    }
  }

  scheduleMidnightNotification(): void {
    if (this.midnightTimer) {
      clearTimeout(this.midnightTimer);
    }

    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    this.midnightTimer = setTimeout(() => {
      this.sendMidnightCountdown();
      this.scheduleMidnightNotification();
    }, msUntilMidnight);
  }

  private scheduleOneTime(): void {
    const targets = [
      { time: '2026-04-22T15:10:00', title: '💕 Nithin & Neeraja', body: '127 days to go... Every second with you is a gift! ✨' },
      { time: '2026-04-22T15:12:00', title: '💕 Nithin & Neeraja', body: '127 days to go... Can\'t wait to start forever with you! 💍' },
      { time: '2026-04-22T15:15:00', title: '💕 Nithin & Neeraja', body: '127 days to go... Goodnight my love, dreaming of our forever! 🌙' },
    ];
    for (const { time, title, body } of targets) {
      const delay = new Date(time).getTime() - Date.now();
      if (delay <= 0) continue;
      setTimeout(() => this.sendNotification(title, body), delay);
    }
  }

  private sendMidnightCountdown(): void {
    this.sendCountdownNotification('💍 Nithin & Neeraja Wedding Countdown');
  }

  private scheduleRandomNotification(): void {
    if (this.randomTimer) {
      clearTimeout(this.randomTimer);
    }

    // Pick a random time between 10:00 AM and 10:00 PM today (or tomorrow if past 10 PM)
    const now = new Date();
    const target = new Date(now);
    const randomHour = 10 + Math.random() * 12; // 10.0 to 22.0
    const hour = Math.floor(randomHour);
    const minute = Math.floor((randomHour - hour) * 60);
    target.setHours(hour, minute, 0, 0);

    // If target is in the past, schedule for tomorrow
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    const delay = target.getTime() - now.getTime();

    this.randomTimer = setTimeout(() => {
      this.sendRandomLoveNote();
      this.scheduleRandomNotification();
    }, delay);
  }

  private sendRandomLoveNote(): void {
    const weddingDate = new Date('2026-08-27T00:00:00');
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    const titles = [
      '💌 A Little Love Note',
      '🦋 Thinking of You',
      '🌸 A Whisper of Love',
      '🧸 Sending Hugs',
      '🫶 My Favorite Person',
      '🌙 A Sweet Thought',
      '🎀 Just Because',
      '🐾 Following My Heart',
    ];
    const notes = [
      `Just thinking about you... ${days} days to go! 💭`,
      `Can't wait to say "I do" — ${days} days! 💫`,
      `You + Me = Forever. ${days} days left! 💕`,
      `Every moment brings us closer... ${days} days! ✨`,
      `My heart is counting too — ${days} days! 🤍`,
      `You're my today, tomorrow, and always. ${days} days! 🥰`,
      `${days} days until I get to hold your hand forever! 🤝`,
      `Somewhere between ${days} days and forever, I fell for you 🌹`,
      `Roses are red, violets are blue, ${days} days left and I'm crazy about you! 🌷`,
      `If I had a flower for every time I thought of you... ${days} days! 🌼`,
      `You make ${days} days feel like a beautiful adventure! 🦋`,
      `Counting stars until our day... ${days} to go! ⭐`,
      `My heart does a little dance... ${days} more days! 💃`,
      `You're the peanut butter to my jelly. ${days} days! 🥜`,
      `I love you more than coffee... and that's saying a lot! ${days} days ☕`,
      `${days} days until our happily ever after begins! 🏰`,
      `Psst... you're my favorite notification! ${days} days 📱`,
      `Life is better with you in it. ${days} days to forever! 🌈`,
      `You stole my heart but I'll let you keep it. ${days} days! 💝`,
      `Falling for you was the best decision. ${days} days left! 🍂`,
    ];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const note = notes[Math.floor(Math.random() * notes.length)];

    this.sendNotification(title, note);
  }

  private sendCountdownNotification(title: string): void {
    const weddingDate = new Date('2026-08-27T00:00:00');
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();

    if (diff <= 0) {
      this.sendNotification(
        '💍 Happy Wedding Day!',
        'Today is Nithin & Neeraja\'s wedding day! Wishing eternal love & happiness!'
      );
      return;
    }

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const messages = [
      `${days} days until Nithin & Neeraja become one! 💕`,
      `Only ${days} days left until the big day! ✨`,
      `${days} more sunrises until forever begins! 🌅`,
      `Counting down... ${days} days to the wedding! 💒`,
      `${days} days of waiting, a lifetime of love ahead! 💑`,
      `${days} sleeps until the most magical day! 🌟`,
      `Another day closer to "I do"... ${days} left! 💐`,
      `${days} days — the universe is aligning for you two! 🪐`,
      `${days} days to your forever! 💑`,
      `The countdown is real — ${days} days and getting closer! 🎯`,
      `${days} more days of being engaged... then MARRIED! 💒✨`,
      `Two hearts, one dream, ${days} days away! 👫`,
      `Mark your calendars — only ${days} days remain! 📅`,
      `${days} days until the greatest love story continues! 📖`,
      `Tick tock... ${days} days and the fairy tale begins! 🕐🧚`,
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];

    this.sendNotification(title, message);
  }
}
