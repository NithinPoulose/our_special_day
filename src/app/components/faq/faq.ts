import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class FaqComponent {
  protected readonly openIndex = signal<number | null>(null);

  protected readonly items: FaqItem[] = [
    {
      question: 'When should guests arrive?',
      answer:
        'The reception begins at 6:00 PM. We warmly recommend arriving by 5:45 PM so you can be seated and settled before the celebrations begin.',
    },
    {
      question: 'Where exactly is the venue?',
      answer:
        'St. Pius Xth Auditorium, Choondy, Aluva, Ernakulam. You can find us easily on Google Maps — a link is available in the Join Us section above.',
    },
    {
      question: 'Is parking available?',
      answer:
        'Yes, ample parking space is available at and near the auditorium. We suggest arriving a few minutes early if you are driving.',
    }
  ];

  protected toggle(index: number): void {
    this.openIndex.set(this.openIndex() === index ? null : index);
  }
}
