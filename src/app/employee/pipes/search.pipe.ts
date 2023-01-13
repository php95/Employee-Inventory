import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: Array<any>, filterString: any) {
    if (value.length === 0 || filterString === '') {
      return value;
    }
    let resultArray = [];
    resultArray = value.filter((item) => {
        let nameLower = item?.name.toLowerCase();
        let salary = item?.salary;
        let id = item?.id;
        let date = item?.date;
        let email = item?.email.toLowerCase();
        let isMatchName = nameLower.includes(filterString.toLowerCase());
        let isMatchemail = email.includes(filterString.toLowerCase());
        let isMatchSalary = salary.toString() === filterString;
        let isMatchid = id.toString() === filterString;
        let isMatchDate = date.toString() === filterString;
        return (
          isMatchName ||
          isMatchemail ||
          isMatchSalary ||
          isMatchid ||
          isMatchDate
        );
    });

    return resultArray;
  }
}
