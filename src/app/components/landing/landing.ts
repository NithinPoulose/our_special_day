import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { WeddingConfigService } from '../../services/wedding-config.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {
  protected readonly config = inject(WeddingConfigService);
  protected readonly i18n  = inject(I18nService);
}
