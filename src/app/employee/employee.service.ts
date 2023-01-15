import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, Subject } from 'rxjs';
import { EmployeeData } from './models/empModel';
import { employeeApiUrl } from '../core/apiDefines';

@Injectable({
  providedIn: 'root',
})
/** 
 * @service EmployeeService
 */
export class EmployeeService {
  /**
   * @constructor
   * @param http http client service
   */
  constructor(private http: HttpClient) { }
  /** filter subject to hold stream contains filter form updates  */
  private filterSubject = new Subject<any>();

  /**
   * @function getEmployees
   * get employees rows
   * @returns observable<[]>
   */
  getEmployees() {
    const url = employeeApiUrl;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.length > 0) {
          return this.mapEmployees(res);
        }
        return of([]);
      }, catchError(error => {
        console.log(error);
        return of([]);
      }))
    );
  }
  /**
   * @function mapSingleEmployee
   * map employee data came from bk to relaiable model
   * @param element any
   * @returns EmployeeData | undefined
   */
  mapSingleEmployee(element: any): EmployeeData | undefined {
    const employee: EmployeeData = new EmployeeData();
    if (element) {
      employee.id = element.id;
      employee.name = element.firstName + ' ' + element.lastName;
      employee.email = element.email;
      employee.date = element.dob;
      employee.salary = element.salary;
      employee.country = element.country;
      return employee;
    }
    return;
  }
  /**
   * @function mapEmployees 
   * map employees data[] come from bk to reliable[]  EmployeeData[]
   * @param employeeData[]
   * @returns {EmployeeData[]} 
   */
  mapEmployees(employeeData: any): EmployeeData[] {
    let employees: EmployeeData[] = [];
    if (employeeData) {
      employeeData.map((element: any) => {
        employees.push(this.mapSingleEmployee(element) as EmployeeData);
      });
    }
    if (employees) return employees;
    return [];
  }
  /**
   * @function sendFilter
   * add data to the stream of filter Subject
   * @param data {}
   */
  sendFilter(data: object) {
    this.filterSubject.next({ ...data });
  }
  /**
   * @function getFilter
   * get function to get access to the private service subject 
   * @returns Observable<any>
   */
  getFilter(): Observable<any> {
    return this.filterSubject.asObservable();
  }
}
