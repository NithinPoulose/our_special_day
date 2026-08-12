import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { WeddingConfigService } from '../../services/wedding-config.service';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  protected readonly config = inject(WeddingConfigService);

  protected readonly bokeh = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: 5 + (i * 11) % 24,
    left: (i * 17 + 4) % 98,
    top: (i * 23 + 6) % 95,
    delay: (i * 0.8) % 9,
    duration: 9 + (i * 1.15) % 7,
    opacity: 0.10 + (i % 6) * 0.045,
    dx: `${(i % 2 === 0 ? '' : '-')}${16 + (i * 7) % 28}px`,
  }));
}
