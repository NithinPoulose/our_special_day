import { Component, ChangeDetectionStrategy, signal, inject, ElementRef, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WeddingConfigService } from '../../services/wedding-config.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-add-to-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-to-calendar.html',
  styleUrl: './add-to-calendar.scss',
})
export class AddToCalendarComponent {
  private readonly config  = inject(WeddingConfigService);
  private readonly el      = inject(ElementRef<HTMLElement>);
  private readonly doc     = inject(DOCUMENT);
  protected readonly i18n  = inject(I18nService);

  protected readonly isOpen = signal(false);

  // Wedding: 27 Aug 2026, 6:00–9:30 PM IST (UTC+5:30) → 12:30–16:00 UTC
  private readonly dtStart  = '20260827T123000Z';
  private readonly dtEnd    = '20260827T160000Z';
  private readonly isoStart = '2026-08-27T12:30:00Z';
  private readonly isoEnd   = '2026-08-27T16:00:00Z';

  private get titleRaw(): string {
    return `${this.i18n.t().events.cardType} – ${this.i18n.t().groomName} & ${this.i18n.t().brideName}`;
  }

  private get locationRaw(): string {
    return `${this.i18n.t().venue}, ${this.i18n.t().venueAddress}`;
  }

  private get detailsRaw(): string {
    if (this.i18n.lang() === 'ml') {
      return `${this.i18n.t().groomName}യും ${this.i18n.t().brideName}യും നടത്തുന്ന വിവാഹ സ്വീകരണത്തിൽ സ്നേഹത്തോടെ പങ്കുചേരണമെന്ന് ഹൃദയം നിറഞ്ഞ് അഭ്യർത്ഥിക്കുന്നു.`;
    }

    return `Together with our families, we warmly invite you to join us for the wedding reception of ${this.i18n.t().groomName} & ${this.i18n.t().brideName}.`;
  }

  protected get googleUrl(): string {
    const titleEnc = encodeURIComponent(this.titleRaw);
    const locationEnc = encodeURIComponent(this.locationRaw);
    const detailsEnc = encodeURIComponent(this.detailsRaw);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEnc}&dates=${this.dtStart}/${this.dtEnd}&details=${detailsEnc}&location=${locationEnc}`;
  }

  protected get outlookUrl(): string {
    const titleEnc = encodeURIComponent(this.titleRaw);
    const locationEnc = encodeURIComponent(this.locationRaw);
    const detailsEnc = encodeURIComponent(this.detailsRaw);
    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${titleEnc}&startdt=${this.isoStart}&enddt=${this.isoEnd}&location=${locationEnc}&body=${detailsEnc}&path=/calendar/action/compose&rru=addevent`;
  }

  protected get yahooUrl(): string {
    const titleEnc = encodeURIComponent(this.titleRaw);
    const locationEnc = encodeURIComponent(this.locationRaw);
    const detailsEnc = encodeURIComponent(this.detailsRaw);
    return `https://calendar.yahoo.com/?v=60&title=${titleEnc}&st=${this.dtStart}&et=${this.dtEnd}&in_loc=${locationEnc}&desc=${detailsEnc}`;
  }

  constructor() {
    const destroyRef = inject(DestroyRef);
    const handler = (e: Event) => {
      if (this.isOpen() && !this.el.nativeElement.contains(e.target as Node)) {
        this.isOpen.set(false);
      }
    };
    this.doc.addEventListener('click', handler, true);
    destroyRef.onDestroy(() => this.doc.removeEventListener('click', handler, true));
  }

  protected toggleMenu(): void {
    this.isOpen.update(open => !open);
  }

  protected closeMenu(): void {
    this.isOpen.set(false);
  }

  private escapeIcs(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\r?\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  protected downloadIcs(): void {
    const reminder = this.i18n.lang() === 'ml' ? 'നാളെ വിവാഹ സ്വീകരണം!' : 'Wedding Reception tomorrow!';
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'PRODID:-//Our Special Day//Wedding//EN',
      'BEGIN:VEVENT',
      `DTSTART:${this.dtStart}`,
      `DTEND:${this.dtEnd}`,
      `SUMMARY:${this.escapeIcs(this.titleRaw)}`,
      `DESCRIPTION:${this.escapeIcs(this.detailsRaw)}`,
      `LOCATION:${this.escapeIcs(this.locationRaw)}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${this.escapeIcs(reminder)}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([lines], { type: 'text/calendar;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = this.doc.createElement('a');
    a.href     = url;
    a.download = 'nithin-neeraja-wedding.ics';
    a.style.display = 'none';
    this.doc.body.appendChild(a);
    a.click();
    this.doc.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.isOpen.set(false);
  }
}
