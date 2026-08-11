import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

interface Milestone {
  year: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-story',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './story.html',
  styleUrl: './story.scss',
})
export class StoryComponent {
  protected readonly nithinPhotoPath = '/photos/nithin-cropped.jpeg';
  protected readonly neerajaPhotoPath = '/photos/neeraja-cropped.jpeg';

  protected readonly nithinPhotoMissing = signal(false);
  protected readonly neerajaPhotoMissing = signal(false);

  protected readonly milestones: Milestone[] = [
    {
      year: '2008',
      title: 'Classmates',
      description:
        'Class 5A, St. Joseph\'s HSS Kizhakkambalam — two kids sharing the same classroom, completely unaware of what the future held.',
    },
    {
      year: '2013',
      title: 'Farewell',
      description:
        'SSLC done, school days over. We parted ways — different paths, different dreams, but the same memories.',
    },
    {
      year: '2017',
      title: 'A Chance Reunion',
      description:
        'A random meeting on the road after years apart. Numbers exchanged, casual conversations — just old classmates catching up.',
    },
    {
      year: '2020',
      title: 'Love Begins',
      description:
        'Somewhere between late-night texts and endless calls, friendship quietly turned into something neither of us could ignore.',
    },
    {
      year: '2021',
      title: 'First Date',
      description:
        'Finally together, face to face, hearts racing — the day we stopped pretending it was "just friendship."',
    },
    {
      year: '2026',
      title: 'Official Registration',
      description:
        'August 24th — before the celebration, the moment we became officially, legally, forever each other\'s.',
    },
    {
      year: '2026',
      title: 'Wedding Celebration',
      description:
        'From classmates to soulmates — on August 27th, surrounded by family and love, we celebrate it with the world.',
    },
  ];

  protected onPhotoError(person: 'nithin' | 'neeraja'): void {
    if (person === 'nithin') {
      this.nithinPhotoMissing.set(true);
      return;
    }

    this.neerajaPhotoMissing.set(true);
  }
}
