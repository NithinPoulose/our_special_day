import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly permissionGranted = signal(false);
  private midnightTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.checkPermission();
    this.scheduleMidnightNotification();
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

  sendNotification(title: string, body: string): void {
    if (!this.permissionGranted()) return;
    const notification = new Notification(title, {
      body,
      icon: 'favicon.ico',
      badge: 'favicon.ico',
      tag: 'wedding-countdown',
    } as NotificationOptions);
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
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

  private sendMidnightCountdown(): void {
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
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];

    this.sendNotification('💍 Wedding Countdown', message);
  }
}
