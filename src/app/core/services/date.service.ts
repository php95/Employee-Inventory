import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
/** @constructor */
  constructor() { }
  /**
   * @function formatDate
   * check for data validity and format date to 'yyyy-mm-dd'
   * @param date any
   * @returns {string}
   */
  formatDate(date:any) : string{
    let msec = Date.parse(date);
      
    if(!Number.isNaN(msec)){
      let validDate : Date =new Date (msec);
      let month=(+validDate.getMonth()+1).toString();
      month=month.length<=1?`0${month}`:month;
      let day= validDate.getDate().toString();
      day = day.length<=1?`0${day}`:day;
      date=`${validDate.getUTCFullYear()}-${month}-${day}`;
    }
    return date;
  }

  /**
   * @function getDateMsecValue
   * returns date equivilient misec value
   * @param date any
   * @returns {number} 
   */
  getDateMsecValue(date:any){
    let msec = Date.parse(date);
    if(!Number.isNaN(msec)){
      return msec;
    }
    return;

  }
}
