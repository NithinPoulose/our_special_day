import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { WeddingConfigService } from '../../services/wedding-config.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="site-footer">
      <div class="monogram" aria-hidden="true">
        <!-- {{ i18n.t().groomName[0] }} -->
        {{ 'N' }}
        <span class="monogram__amp">&amp;</span>
        <!-- {{ i18n.t().brideName[0] }} -->
        {{ 'N' }}
      </div>
      <time class="footer-date">{{ i18n.t().weddingDateDisplay }}</time>
      <p class="footer-tagline">{{ i18n.t().footer.tagline }}</p>

      <div class="footer-gem" aria-hidden="true">✦ ✦ ✦</div>

      <div class="dev-section">
        <p class="dev-section__eyebrow">{{ i18n.t().footer.craftedBy }}</p>
        <a href="mailto:nithinpoulosek@gmail.com" class="dev-section__name">Nithin Poulose</a>
        <a href="mailto:nithinpoulosek@gmail.com" class="dev-section__email"
          >nithinpoulosek@gmail.com</a
        >
      </div>
    </footer>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .site-footer {
        background: var(--charcoal);
        border-top: 1px solid var(--border-light);
        padding: 4.5rem 2rem 3.5rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .monogram {
        font-family: 'Playfair Display', serif;
        font-weight: 400;
        font-size: 3rem;
        color: var(--gold-light);
        letter-spacing: 0.28em;
        line-height: 1;
      }

      .monogram__amp {
        font-style: italic;
        font-size: 0.6em;
        color: var(--gold);
        opacity: 0.8;
      }

      .footer-date {
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        font-size: 0.65rem;
        letter-spacing: 0.38em;
        text-transform: uppercase;
        color: var(--gold-light);
        opacity: 0.7;
      }

      .footer-tagline {
        font-family: 'Cormorant Garamond', serif;
        font-size: 0.9rem;
        font-weight: 300;
        font-style: italic;
        color: var(--ivory-dark);
        opacity: 0.4;
        letter-spacing: 0.05em;
      }

      .footer-gem {
        font-size: 0.5rem;
        letter-spacing: 1.4rem;
        color: var(--gold);
        opacity: 0.35;
        margin-top: 0.5rem;
      }

      .dev-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        margin-top: 1rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(212, 184, 150, 0.08);
        width: 100%;
        max-width: 320px;
        opacity: 0.55;
        transition: opacity 0.4s ease;

        &:hover {
          opacity: 0.85;
        }
      }

      .dev-section__eyebrow {
        font-family: 'Montserrat', sans-serif;
        font-size: 0.46rem;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: rgba(212, 184, 150, 0.5);
        margin-bottom: 0.15rem;
      }

      .dev-section__name {
        font-family: 'Playfair Display', serif;
        font-weight: 400;
        font-size: 1rem;
        letter-spacing: 0.18em;
        color: rgba(212, 184, 150, 0.7);
        text-decoration: none;
      }

      .dev-section__email {
        font-family: 'Montserrat', sans-serif;
        font-size: 0.52rem;
        letter-spacing: 0.07em;
        color: rgba(212, 184, 150, 0.4);
        text-decoration: none;
        margin-top: 0.05rem;

        &:hover {
          color: rgba(212, 184, 150, 0.7);
          text-decoration: underline;
        }
      }

      .dev-link {
        color: rgba(212, 184, 150, 0.35);
        text-decoration: none;

        &:hover {
          color: rgba(212, 184, 150, 0.65);
        }
      }
    `,
  ],
})
export class FooterComponent {
  protected readonly config = inject(WeddingConfigService);
  protected readonly i18n = inject(I18nService);
}
