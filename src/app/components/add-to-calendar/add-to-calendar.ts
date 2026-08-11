import { Component, ChangeDetectionStrategy, signal, inject, ElementRef, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WeddingConfigService } from '../../services/wedding-config.service';

@Component({
  selector: 'app-add-to-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-to-calendar.html',
  styleUrl: './add-to-calendar.scss',
})
export class AddToCalendarComponent {
  private readonly config = inject(WeddingConfigService);
  private readonly el     = inject(ElementRef<HTMLElement>);
  private readonly doc    = inject(DOCUMENT);

  protected readonly isOpen = signal(false);

  // Wedding: 27 Aug 2026, 6:00–9:30 PM IST (UTC+5:30) → 12:30–16:00 UTC
  private readonly dtStart  = '20260827T123000Z';
  private readonly dtEnd    = '20260827T160000Z';
  private readonly isoStart = '2026-08-27T12:30:00Z';
  private readonly isoEnd   = '2026-08-27T16:00:00Z';

  private readonly titleRaw    = `Wedding Reception – ${this.config.groomName} & ${this.config.brideName}`;
  private readonly titleEnc    = encodeURIComponent(this.titleRaw);
  private readonly locationEnc = encodeURIComponent(`${this.config.venue}, ${this.config.venueAddress}`);
  private readonly detailsEnc  = encodeURIComponent(`You are cordially invited to the wedding reception of ${this.config.groomName} & ${this.config.brideName}.`);

  protected readonly googleUrl  = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${this.titleEnc}&dates=${this.dtStart}/${this.dtEnd}&details=${this.detailsEnc}&location=${this.locationEnc}`;
  protected readonly outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${this.titleEnc}&startdt=${this.isoStart}&enddt=${this.isoEnd}&location=${this.locationEnc}&body=${this.detailsEnc}&path=/calendar/action/compose&rru=addevent`;
  protected readonly yahooUrl   = `https://calendar.yahoo.com/?v=60&title=${this.titleEnc}&st=${this.dtStart}&et=${this.dtEnd}&in_loc=${this.locationEnc}&desc=${this.detailsEnc}`;

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

  protected downloadIcs(): void {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'PRODID:-//Our Special Day//Wedding//EN',
      'BEGIN:VEVENT',
      `DTSTART:${this.dtStart}`,
      `DTEND:${this.dtEnd}`,
      `SUMMARY:${this.titleRaw}`,
      `DESCRIPTION:You are cordially invited to the wedding reception of ${this.config.groomName} & ${this.config.brideName}.`,
      `LOCATION:${this.config.venue}\\, ${this.config.venueAddress}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Wedding Reception tomorrow!',
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
