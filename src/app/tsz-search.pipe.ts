import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tszSearch'
})
export class TiszaSzakiSearchPipe implements PipeTransform {

  transform(array: any, executed: Boolean, term: String, field: String): any[] {
    let result: any[];

    if (executed && (field.trim() != ''))
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
        let leftval: String;
        let lefttemp = elem[field as string];
        let rightval = term;

        if (!lefttemp)
        {
          lefttemp = '';
        }

        if (typeof(lefttemp) != 'string')
        {
          leftval = lefttemp.toString();
        }
        else
        {
          leftval = lefttemp;
        }

        if (leftval.search(rightval as string) >= 0)
        {
          result.push(elem);
        }
      }
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
