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
        let a2=a[field as string];
        let b2=b[field as string];
        var res;

        if ((typeof(a2) == 'string') && (typeof(b2) == 'string')) {
          res = a2.toLowerCase().localeCompare(b2.toLowerCase() as string);
        }
        else {
          if (a2 < b2) {
            res = -1;
          } else if (a2 > b2) {
            res = 1;
          } else {
            res = 0;
          }
        }

        //console.log(`Compared ${JSON.stringify(a2)} with ${JSON.stringify(b2)}: ${res}`);

        res *= (reversed ? -1 : 1);
        return res;
      });
    }
    return array;
  }

}
