import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TimeFormatService {
    toTimeSpanFormat(date: Date | null): string | null {
        if (!date)
            return null;

        const hours = date.getHours().toString().padStart(2, '0');

        const minutes = date.getMinutes().toString().padStart(2, '0');

        const seconds = '00';

        return `${hours}:${minutes}:${seconds}`;
    }

    fromTimeSpanFormat(timespan: string | null | undefined): Date | null {
        if (!timespan) {
          return null;
        }
      
        const [hours, minutes, seconds] = timespan
          .split(':')
          .map(part => Number(part));
      
        const date = new Date();
        date.setHours(hours, minutes, seconds || 0, 0);
      
        return date;
      }
}