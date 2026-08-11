import { Component, ChangeDetectionStrategy, signal, viewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <audio #audioEl src="/songs/our-song.mp3" loop preload="none"></audio>

    <button
      class="bgm-btn"
      type="button"
      (click)="toggle()"
      [class.bgm-btn--playing]="isPlaying()"
      [attr.aria-label]="isPlaying() ? 'Pause background music' : 'Play background music'"
      [attr.aria-pressed]="isPlaying()"
      title="{{ isPlaying() ? 'Pause music' : 'Play music' }}"
    >
      <span class="bgm-btn__ring" aria-hidden="true"></span>

      @if (isPlaying()) {
        <svg class="bgm-btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6" y="4" width="4" height="16" rx="1.5"/>
          <rect x="14" y="4" width="4" height="16" rx="1.5"/>
        </svg>
      } @else {
        <svg class="bgm-btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 4.5v15l13-7.5L7 4.5z"/>
        </svg>
      }

      <span class="bgm-btn__note" aria-hidden="true">♪</span>
    </button>
  `,
  styles: [`
    :host { display: block; }

    .bgm-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 100;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 1px solid rgba(176, 141, 87, 0.45);
      background: rgba(30, 24, 16, 0.82);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: var(--gold-light);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.3s ease, transform 0.2s ease, background 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(176, 141, 87, 0);
    }

    .bgm-btn:hover {
      border-color: var(--gold);
      transform: scale(1.1);
      background: rgba(30, 24, 16, 0.95);
    }

    .bgm-btn:focus-visible {
      outline: 2px solid var(--gold);
      outline-offset: 3px;
    }

    /* Pulse ring when playing */
    .bgm-btn--playing {
      border-color: rgba(176, 141, 87, 0.7);
      animation: btnPulse 2.4s ease-in-out infinite;
    }

    .bgm-btn__ring {
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 1px solid rgba(176, 141, 87, 0);
      pointer-events: none;
      transition: border-color 0.3s ease;
    }

    .bgm-btn--playing .bgm-btn__ring {
      animation: ringExpand 2.4s ease-out infinite;
    }

    .bgm-btn__icon {
      width: 17px;
      height: 17px;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    /* Small music note tucked at top-right of button */
    .bgm-btn__note {
      position: absolute;
      top: 2px;
      right: 4px;
      font-size: 0.5rem;
      color: var(--gold);
      opacity: 0.5;
      line-height: 1;
      pointer-events: none;
    }

    @keyframes btnPulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(176, 141, 87, 0.3); }
      50%       { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 8px rgba(176, 141, 87, 0); }
    }

    @keyframes ringExpand {
      0%   { transform: scale(1);   opacity: 0.5; }
      100% { transform: scale(1.5); opacity: 0;   }
    }
  `],
})
export class AudioPlayerComponent {
  private readonly audioRef = viewChild<ElementRef<HTMLAudioElement>>('audioEl');
  protected readonly isPlaying = signal(false);

  protected toggle(): void {
    const audio = this.audioRef()?.nativeElement;
    if (!audio) return;
    if (this.isPlaying()) {
      audio.pause();
      this.isPlaying.set(false);
    } else {
      audio.play().then(() => this.isPlaying.set(true)).catch(() => {});
    }
  }
}
