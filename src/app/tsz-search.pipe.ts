import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tszSearch'
})
export class TiszaSzakiSearchPipe implements PipeTransform {

  transform(array: any, executed: Boolean, caseSense: Boolean, rules: Map<String,String>, highlight: Boolean): any[] {
    let result: any[];

    //if (executed) {

    if (Array.isArray(array))
    {
      result = array;
    }
    else
    {
      result = [array];
    }

    for (let [field,term] of rules) {
      if (field.trim() != '') {
        let temp: any[];

        temp = result;
        result = [];

        for (let elem of temp) {
          let leftval, rightval = term;
          let lefttemp = elem[field as string];

          if (typeof(lefttemp) == 'string') {
            leftval = lefttemp;
          }
          else {
            leftval = lefttemp.toString();
          }

          if (!caseSense) {
            leftval = leftval.toUpperCase();
            rightval = rightval.toUpperCase();
          }

          if (leftval.search(rightval as string) >= 0) {
            if (highlight) {
              const re = RegExp(`${rightval}`, 'g')
              const match = leftval.match(re);
              const res = `(${match[0]})`;

              leftval = leftval.replace(re, res);
              elem[field as string] = leftval;
            }

            result.push(elem);
          }
        }

        console.log(`Filtered ${result.length} Todo(s) with TiszaSzakiSearchPipe(${(caseSense ? 'CASE_SENSITIVE' : 'CASE_INSENSITIVE')}, ${term}, ${field})`);
      }
    }
    //}

    return result;
  }

}
