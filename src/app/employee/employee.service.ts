import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, Subject } from 'rxjs';
import { EmployeeData } from './models/empModel';
import { employeeApiUrl } from '../core/apiDefines';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) { }

  private filterSubject = new Subject<any>();

  //get employees api and map the data with employee model data
  getEmployees() {
    const url = employeeApiUrl;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.length > 0) {
          return this.mapEmployees(res);
        }
        return of([]);
      })
    );
  }

  // map single employee data 
  mapSingleEmployee(element: any): EmployeeData | undefined {
    const employee: EmployeeData = new EmployeeData();
    if (element) {
      employee.id = element.id;
      employee.name = element.firstName + ' ' + element.lastName;
      employee.email = element.email;
      employee.date = element.dob;
      employee.salary = element.salary;
      employee.country=element.country;
      return employee;
    }
    return;
  }

  // map all employees
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

  // send filtered data through subject
  sendFilter(data: object) {
    this.filterSubject.next({...data});
  }
// get filtered data from subject
  getFilter(): Observable<any> {
    return this.filterSubject.asObservable();
  }
}
