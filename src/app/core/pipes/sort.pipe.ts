import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(sessions: any[], field: string): any[] {
    return sessions?.slice().sort((a, b) => a[field] - b[field]) || [];
    }

}
