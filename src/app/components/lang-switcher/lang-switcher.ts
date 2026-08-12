import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-lang-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lang-switcher" role="group" [attr.aria-label]="i18n.t().a11y.languageSwitcher">
      <button
        class="lang-btn"
        [class.lang-btn--active]="i18n.lang() === 'en'"
        [attr.aria-pressed]="i18n.lang() === 'en'"
        (click)="i18n.setLang('en')"
        [attr.aria-label]="i18n.t().a11y.switchToEnglish"
      >EN</button>
      <span class="lang-sep" aria-hidden="true">|</span>
      <button
        class="lang-btn"
        [class.lang-btn--active]="i18n.lang() === 'ml'"
        [attr.aria-pressed]="i18n.lang() === 'ml'"
        (click)="i18n.setLang('ml')"
        [attr.aria-label]="i18n.t().a11y.switchToMalayalam"
      >മല</button>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
    }

    .lang-switcher {
      display: flex;
      align-items: center;
      background: rgba(250, 247, 242, 0.88);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(176, 141, 87, 0.28);
      border-radius: 6px;
      overflow: hidden;
    }

    .lang-btn {
      background: none;
      border: none;
      padding: 0.38rem 0.7rem;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.62rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      cursor: pointer;
      transition: color 0.2s, background 0.2s;
      line-height: 1;

      &--active {
        color: var(--gold-dark);
        background: rgba(176, 141, 87, 0.1);
      }

      &:hover:not(.lang-btn--active) {
        color: var(--text-dark);
      }

      &:focus-visible {
        outline: 2px solid var(--gold-dark);
        outline-offset: -2px;
        border-radius: 4px;
      }
    }

    .lang-sep {
      color: rgba(176, 141, 87, 0.3);
      font-size: 0.6rem;
      pointer-events: none;
      user-select: none;
    }

    @media (max-width: 640px) {
      :host {
        top: calc(env(safe-area-inset-top, 0px) + 0.9rem);
        left: 50%;
        right: auto;
        transform: translateX(-50%);
      }

      .lang-switcher {
        border-radius: 999px;
        box-shadow: 0 10px 24px rgba(176, 141, 87, 0.12);
      }

      .lang-btn {
        padding: 0.42rem 0.85rem;
      }
    }
  `],
})
export class LangSwitcherComponent {
  protected readonly i18n = inject(I18nService);
}
