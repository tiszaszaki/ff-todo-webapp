import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tszSearch'
})
export class TiszaSzakiSearchPipe implements PipeTransform {

  transform(array: any, caseSense: Boolean, rules: Map<String,String>, highlight: Boolean): any[] {
    let result: any[];

    if (Array.isArray(array))
    {
      result = array;
    }
    else
    {
      result = [array];
    }

    if (rules)
    for (let [field,term] of rules) {
      if (field.trim() != '') {
        let temp: any[];

        temp = result;
        result = [];

        for (let elem of temp) {
          let leftval, rightval = term;
          let periodPos = field.search('\\.');

          if (periodPos >= 0) {
            if (periodPos > 0) {
              let arrField = field.substr(0, periodPos);
              let elemField = field.substr(periodPos+1);
              let subArray = elem[arrField];
              let pushable = false;

              if (Array.isArray(subArray)) {
                for (let elem2 of subArray) {
                  let lefttemp = elem2[elemField];
                  let matches;

                  if (typeof(lefttemp) == 'string') {
                    leftval = lefttemp;
                  }
                  else {
                    leftval = lefttemp.toString();
                  }

                  matches = false;
                  matches ||= (caseSense && (leftval.search(rightval as string) >= 0));
                  matches ||= (!caseSense && (leftval.toLowerCase().search(rightval.toLowerCase()) >= 0));
      
                  if (matches) {
                    if (highlight) {
                      const re = RegExp(`${rightval}`, 'g' + (caseSense ? '' : 'i'));
                      const match = leftval.match(re);
                      const res = `<mark>${match[0]}</mark>`;
      
                      elem2[elemField] = leftval.replace(re, res);
                    }
                  }

                  pushable ||= matches;
                }
              }

              if (pushable)
              {
                result.push(elem);
              }
            }
          }
          else {
            let lefttemp = elem[field as string];
            let matches;

            if (typeof(lefttemp) == 'string') {
              leftval = lefttemp;
            }
            else {
              leftval = lefttemp.toString();
            }

            matches = false;
            matches ||= (caseSense && (leftval.search(rightval as string) >= 0));
            matches ||= (!caseSense && (leftval.toLowerCase().search(rightval.toLowerCase()) >= 0));

            if (matches) {
              if (highlight) {
                const re = RegExp(`${rightval}`, 'g' + (caseSense ? '' : 'i'));
                const match = leftval.match(re);
                const res = `<mark>${match[0]}</mark>`;

                elem[field as string] = leftval.replace(re, res);
              }

              result.push(elem);
            }
          }
        }

        console.log(`Filtered ${result.length} Todo(s) with TiszaSzakiSearchPipe(${(caseSense ? 'CASE_SENSITIVE' : 'CASE_INSENSITIVE')}, `
            + `${term}, ${field}, ${(highlight ? 'HIGHLIGHTING' : 'NON_HIGHLIGHTING')})`);
      }
    }

    return result;
  }

}
