import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(
    value: Array<any>,
    sortColumn: string,
    type: string,
    sortType: string
  ) {
    if (sortColumn == '') return value;

    if (type === 'number') {
      value = value.sort((item1: any, item2: any) => {
        if (sortType === 'asc') {
          return item1[sortColumn] - item2[sortColumn];
        } else {
          return item2[sortColumn] - item1[sortColumn];
        }
      });
    } else if (type === 'string') {
      value = value.sort(function (x, y) {
        if (sortType === 'asc') {
          if (x[sortColumn] < y[sortColumn]) return -1;
          if (x[sortColumn] > y[sortColumn]) return 1;
          return 0; 
        } else {
          if (x[sortColumn] > y[sortColumn]) return -1;
          if (x[sortColumn] < y[sortColumn]) return 1;
          return 0;
        }
      });
    }
    return value;
  }
}
