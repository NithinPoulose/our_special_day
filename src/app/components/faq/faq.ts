import { Component, ChangeDetectionStrategy, computed, signal, inject } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class FaqComponent {
  protected readonly i18n      = inject(I18nService);
  protected readonly openIndex = signal<number | null>(null);
  protected readonly items     = computed(() => this.i18n.t().faq.items);

  protected toggle(index: number): void {
    this.openIndex.set(this.openIndex() === index ? null : index);
  }
}

