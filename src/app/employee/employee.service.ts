import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import { EmployeeData } from './models/empModel';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getEmployees() {
    const url = 'https://my-json-server.typicode.com/php95/employees-data/employees';
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res && res.length > 0) {
          return this.mapEmployees(res);
        }
        return of([]);
      })
    );
  }

  mapSingleEmployee(element: any): EmployeeData | undefined {
    const employee: EmployeeData = new EmployeeData();
    if (element) {
      employee.id = element.id;
      employee.name = element.firstName + ' ' + element.lastName;
      employee.email = element.email;
      employee.date = element.dob;
      employee.salary = element.salary;
      return employee;
    }
    return;
  }

  mapEmployees(employeeData: any):EmployeeData[] {
    let employees: EmployeeData[] = [];
    if (employeeData) {
      employeeData.map((element: any) => {
        employees.push(this.mapSingleEmployee(element) as EmployeeData);
      });
    }
    if (employees) return employees;
    return [];
  }
}
