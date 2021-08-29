import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tszSort'
})
export class TiszaSzakiSortPipe implements PipeTransform {

  transform(array: any, field: String, reversed: Boolean): any[] {
    if (!Array.isArray(array)) {
      return [array];
    }
    if (field && (reversed !== undefined))
    if (field != "")
    {
      array.sort((a: any, b: any) => {
        var res;
        if ((a instanceof String) && (b instanceof String)) {
          res = a.localeCompare(b as string);
        }
        else {
          if (a[field as string] < b[field as string]) {
            res = -1;
          } else if (a[field as string] > b[field as string]) {
            res = 1;
          } else {
            res = 0;
          }
        }
        res *= (reversed ? -1 : 1);
        return res;
      });
    }
    return array;
  }

}
