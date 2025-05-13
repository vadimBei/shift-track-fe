import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeSpanHoursMinutesFormat',
  standalone: true
})
export class TimeSpanHoursMinutesFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    const parts = value.split(':');

    if (parts.length < 2)
      return value;

    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1].padStart(2, '0');

    return `${hours}:${minutes}`;
  }
}
