import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tszSort'
})
export class TiszaSzakiSortPipe implements PipeTransform {

  transform(array: any, executed: Boolean, field: String, reversed: Boolean): any[] {
    if (!Array.isArray(array)) {
      return [array];
    }

    //if (executed)
    if (field && (reversed !== undefined))
    if (field != "")
    {
      let result: any[] = [];

      for (let elem of array) result.push(elem);

      result.sort((a: any, b: any) => {
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

        res *= (reversed ? -1 : 1);
        return res;
      });

      console.log(`Sorting with TiszaSzakiSortPipe(${field},${(reversed ? 'DESCENDING' : 'ASCENDING')})...`);
      console.log({sorting_input: array, sorting_output: result});

      return result;
    }

    return array;
  }

}
