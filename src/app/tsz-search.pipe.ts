import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tszSearch'
})
export class TiszaSzakiSearchPipe implements PipeTransform {

  transform(array: any, executed: Boolean, caseSense: Boolean, term: String, field: String): any[] {
    let result: any[];

    //if (executed)
    if (field.trim() != '')
    {
      let temp: any[];

      result = [];

      if (Array.isArray(array))
      {
        temp = array;
      }
      else
      {
        temp = [array];
      }

      for (let elem of temp)
      {
        let leftval, rightval = term;
        let lefttemp = elem[field as string];

        if (typeof(lefttemp) == 'string')
        {
          leftval = lefttemp;
        }
        else
        {
          leftval = lefttemp.toString();
        }

        if (!caseSense)
        {
          leftval = leftval.toLowerCase();
          rightval = rightval.toLowerCase();
        }

        if (leftval.search(rightval as string) >= 0)
        {
          result.push(elem);
        }
      }

      console.log(`Filtered ${result.length} Todo(s) with TiszaSzakiSearchPipe(${(caseSense ? 'CASE_SENSITIVE' : 'CASE_INSENSITIVE')}, ${term}, ${field})`);
    }
    else
    {
      if (Array.isArray(array))
      {
        result = array;
      }
      else
      {
        result = [array];
      }
    }

    return result;
  }

}
