import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WeddingConfigService {
  readonly groomName = 'Nithin';
  readonly brideName = 'Neeraja';
  readonly weddingDate = new Date('2026-08-27T18:00:00');
  readonly weddingDateDisplay = 'Thursday, 27 August 2026';
  readonly eventTime = '6:00 PM to 9:30 PM';
  readonly venue = 'St. Pius Xth Auditorium';
  readonly venueAddress = 'Choondy, Aluva, Ernakulam';
  readonly groomParents = 'Mr. K A Poulose & Mrs. Julie Poulose';
  readonly groomFamily = 'Koorely House, Banglavumparamb Road, Nazreth Road, Aluva, Ernakulam';
  readonly brideParents = 'Mr. Venugopalan Nair & Mrs. A N Ushakumari';
  readonly brideFamily = 'Usha Bhavan (Ambalakkadu), Maliyekkapadi, Pukkattupadi, Ernakulam';
}
