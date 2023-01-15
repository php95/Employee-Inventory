import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})

export class SortPipe implements PipeTransform {
  /**
   * @function transform
   * sort data depend on it's type string or number and it's sortype ascending and descinding 
   * @param value 
   * @param sortColumn 
   * @param type 
   * @param sortType 
   * @returns {Array<any>}
   */
  transform(
    value: Array<any>,
    sortColumn: string,
    type: string,
    sortType: string
  ):Array<any> {
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
