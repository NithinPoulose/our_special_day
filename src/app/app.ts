import {
  Component,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { NotificationService } from './services/notification.service';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '(document:click)': 'onScreenClick($event)',
  },
})
export class App implements OnInit, OnDestroy {
  private readonly notificationService = inject(NotificationService);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  protected readonly weddingDate = new Date('2026-08-27T00:00:00');
  protected readonly groomName = 'Nithin';
  protected readonly brideName = 'Neeraja';

  protected readonly timeLeft = signal<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  protected readonly isWeddingDay = computed(() => {
    const t = this.timeLeft();
    return t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0;
  });

  protected readonly notificationEnabled = this.notificationService.subscriptionActive;
  protected readonly notificationSupported = this.notificationService.pushSupported;
  protected readonly notificationMessage = this.notificationService.statusMessage;

  protected readonly showNotificationBanner = signal(true);

  protected readonly particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 10 + Math.random() * 20,
    size: 4 + Math.random() * 8,
  }));

  protected readonly clickHearts = signal<{ id: number; x: number; y: number }[]>([]);
  private heartCounter = 0;

  ngOnInit(): void {
    this.updateCountdown();
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateCountdown(): void {
    const now = new Date();
    const diff = this.weddingDate.getTime() - now.getTime();

    if (diff <= 0) {
      this.timeLeft.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    this.timeLeft.set({
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    });
  }

  protected async enableNotifications(): Promise<void> {
    const enabled = await this.notificationService.requestPermission();

    if (enabled) {
      this.showNotificationBanner.set(false);
    }
  }

  protected dismissBanner(): void {
    this.showNotificationBanner.set(false);
  }

  protected pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

  protected onScreenClick(event: MouseEvent): void {
    const heart = { id: ++this.heartCounter, x: event.clientX, y: event.clientY };
    this.clickHearts.update((hearts) => [...hearts, heart]);

    setTimeout(() => {
      this.clickHearts.update((hearts) => hearts.filter((h) => h.id !== heart.id));
    }, 1000);
  }
}
