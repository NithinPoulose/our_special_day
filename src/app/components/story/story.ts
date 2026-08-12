import { Component, ChangeDetectionStrategy, computed, signal, inject } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-story',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './story.html',
  styleUrl: './story.scss',
})
export class StoryComponent {
  protected readonly i18n = inject(I18nService);

  protected readonly nithinPhotoPath  = '/photos/nithin-cropped.jpeg';
  protected readonly neerajaPhotoPath = '/photos/neeraja-cropped.jpeg';

  protected readonly nithinPhotoMissing  = signal(false);
  protected readonly neerajaPhotoMissing = signal(false);

  protected readonly milestones = computed(() => this.i18n.t().story.milestones);

  protected onPhotoError(person: 'nithin' | 'neeraja'): void {
    if (person === 'nithin') {
      this.nithinPhotoMissing.set(true);
      return;
    }

    this.neerajaPhotoMissing.set(true);
  }
}
