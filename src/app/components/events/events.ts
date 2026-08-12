import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { WeddingConfigService } from '../../services/wedding-config.service';
import { I18nService } from '../../services/i18n.service';
import { RevealDirective } from '../../directives/reveal.directive';
import { AddToCalendarComponent } from '../add-to-calendar/add-to-calendar';

@Component({
  selector: 'app-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, AddToCalendarComponent],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class EventsComponent {
  protected readonly config = inject(WeddingConfigService);
  protected readonly i18n   = inject(I18nService);
}
