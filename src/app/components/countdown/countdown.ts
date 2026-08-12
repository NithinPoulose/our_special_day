import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { WeddingConfigService } from '../../services/wedding-config.service';
import { I18nService } from '../../services/i18n.service';
import { RevealDirective } from '../../directives/reveal.directive';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-countdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
})
export class CountdownComponent implements OnInit, OnDestroy {
  protected readonly config = inject(WeddingConfigService);
  protected readonly i18n   = inject(I18nService);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  protected readonly timeLeft = signal<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  protected readonly isPast = computed(() => {
    const t = this.timeLeft();
    return t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0;
  });

  protected readonly units = computed(() => {
    const u = this.i18n.t().countdown.units;
    return [
      { label: u.days,    value: this.pad(this.timeLeft().days) },
      { label: u.hours,   value: this.pad(this.timeLeft().hours) },
      { label: u.minutes, value: this.pad(this.timeLeft().minutes) },
      { label: u.seconds, value: this.pad(this.timeLeft().seconds) },
    ];
  });

  protected readonly countdownAriaLabel = computed(() =>
    this.units().map(unit => `${unit.value} ${unit.label}`).join(' ')
  );

  ngOnInit(): void {
    this.tick();
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) clearInterval(this.intervalId);
  }

  private tick(): void {
    const diff = Math.max(0, this.config.weddingDate.getTime() - Date.now());
    this.timeLeft.set({
      days:    Math.floor(diff / 86_400_000),
      hours:   Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    });
  }

  protected pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
