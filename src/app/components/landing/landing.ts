import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { WeddingConfigService } from '../../services/wedding-config.service';

@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {
  protected readonly config = inject(WeddingConfigService);
}
