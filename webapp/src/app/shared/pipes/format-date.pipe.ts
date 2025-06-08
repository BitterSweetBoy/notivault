import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  pure: true
})
export class FormatDatePipe implements PipeTransform {

  private formatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  transform(date: Date | string | null | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return this.formatter.format(d);
  }

}
