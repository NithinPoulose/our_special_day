import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { LandingComponent } from './components/landing/landing';
import { HeroComponent } from './components/hero/hero';
import { CountdownComponent } from './components/countdown/countdown';
import { StoryComponent } from './components/story/story';
import { EventsComponent } from './components/events/events';
import { FooterComponent } from './components/footer/footer';
import { AudioPlayerComponent } from './components/audio-player/audio-player';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LandingComponent, HeroComponent, CountdownComponent, StoryComponent, EventsComponent, FooterComponent, AudioPlayerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly opened  = signal(false);
  protected readonly leaving = signal(false);

  protected enter(): void {
    if (this.leaving()) return;
    this.leaving.set(true);
    setTimeout(() => this.opened.set(true), 950);
  }
}
