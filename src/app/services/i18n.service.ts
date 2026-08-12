import { Injectable, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Lang, Translations, translations } from '../i18n/translations';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly doc = inject(DOCUMENT);

  readonly lang = signal<Lang>(this.initLang());
  readonly t = computed<Translations>(() => translations[this.lang()]);

  private initLang(): Lang {
    const params = new URLSearchParams(this.doc.defaultView?.location.search ?? '');
    const raw = params.get('lang');
    const lang: Lang = raw === 'ml' ? 'ml' : 'en';
    this.doc.documentElement.lang = lang;
    return lang;
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
    this.doc.documentElement.lang = lang;
    const url = new URL(this.doc.defaultView!.location.href);
    if (lang === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    this.doc.defaultView!.history.replaceState(null, '', url.toString());
  }
}
