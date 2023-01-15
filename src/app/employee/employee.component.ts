import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from './employee.service';
import { EmployeeData } from './models/empModel';
import { SearchPipe } from './pipes/search.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { MatTable } from '@angular/material/table';
import { DateService } from '../core/services/date.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  /** hold columns titles */
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'date',
    'country',
    'salary',
  ];
  /** hold the Employee Data  */
  dataSource: EmployeeData[] = [];
  /** hold searched employees*/
  searchedEmployees: EmployeeData[] = [];
  /** determine is salary sorted in ascending way or not */
  isSalaryAscending: boolean = true;
  /** determine is name sorted in ascending way or not */
  isNameAscending: boolean = true;
  /** point to the table in mattable */
  @ViewChild(MatTable) table: MatTable<any> | undefined;
  isOpened: boolean = false;
  /** hold all employee columns names */
  empColsData: string[] = [];

  /**
   * @constructor
   * @param employeeService employee service
   * @param searchPipe search pipe
   * @param sortPipe sort pipe
   * @param dateService date service
   */
  constructor(
    private employeeService: EmployeeService,
    private searchPipe: SearchPipe,
    private sortPipe: SortPipe,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.setAllEmployees();
  }

  // set
  setEmpsCols(empData: EmployeeData[]): void {
    let oneEmpData = empData[0];
    for (let emp in oneEmpData) {
      this.empColsData.push(emp);
    }
  }

  /**
   * @function getIntersetionCols
   * get intersection columns data between filters and employees columns names
   * @param empDataCols any
   * @param filterData any
   * @returns {any[]}
   */
  getIntersetionCols(empDataCols: any, filterData: any) {
    let intersectionCols: any[] = [];
    empDataCols.forEach((empCol: any) => {
      for (let filterCol in filterData) {
        if (empCol === filterCol) {
          let filterObj: any = {};
          if (filterData[filterCol]) {
            filterObj[filterCol] = filterData[filterCol];
            intersectionCols.push(filterObj);
          }
        }
      }
    });
    return intersectionCols;
  }

  /**
   * @function getIntersectionData
   * get intersection data by checking that intersection columns name and data match employee names and data
   * @param intersectionCols
   * @param employees
   * @returns {any[]}
   */
  getIntersectionData(
    intersectionCols: object[],
    employees: EmployeeData[]
  ): any[] {
    let filteredData: any = [];
    intersectionCols.forEach((colData) => {
      let colDataKey = Object.keys(colData)[0];
      let colDataValue = Object.values(colData)[0];
      employees.forEach((employee) => {
        let searchKey = Object.keys(employee).find((key) => key === colDataKey);
        if (searchKey) {
          if (searchKey === 'date') {
            let dateValue1 = this.dateService.getDateMsecValue(
              this.dateService.formatDate(employee['date'])
            );
            let dateValue2 = this.dateService.getDateMsecValue(
              this.dateService.formatDate(colDataValue)
            );
            if (dateValue1 && dateValue2) {
              if (dateValue1 === dateValue2) {
                filteredData.push(employee);
              }
            }
          } else if (searchKey === 'country') {
            if (employee.country?.code === colDataValue) {
              filteredData.push(employee);
            }
          } else if (Object.values(employee).includes(colDataValue)) {
            filteredData.push(employee);
          }
        }
      });
    });
    return filteredData;
  }

  /**
   * @function setAllEmployees
   * set employees data in dataSource and filter it
   */
  setAllEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (employees) => {
        if (employees) {
          this.dataSource = employees as EmployeeData[];
          this.searchedEmployees = this.dataSource;
          this.setEmpsCols(this.searchedEmployees);
          this.filterData();
        }
      },
      (error: any) => {
        throw new Error(`The Error in api is ${error}`);
      }
    );
  }

  /**
   * @function search
   * use search pipe to get the searched employees
   * @param value string
   */
  search(value: string): void {
    this.searchedEmployees = this.searchPipe.transform(this.dataSource, value);
  }
  /**
    @function search
   * entre the columns to be sorted and its type and sort them   
   * @param sortCol string
   * @param type string
   */

  sort(sortCol: string, type: string) {
    if (sortCol === 'salary') {
      this.isSalaryAscending
        ? (this.searchedEmployees = this.sortPipe.transform(
            this.searchedEmployees,
            sortCol,
            type,
            'asc'
          ))
        : (this.searchedEmployees = this.sortPipe.transform(
            this.searchedEmployees,
            sortCol,
            type,
            'desc'
          ));
      this.isSalaryAscending = !this.isSalaryAscending;
    } else if (sortCol === 'name') {
      this.isNameAscending
        ? (this.searchedEmployees = this.sortPipe.transform(
            this.searchedEmployees,
            sortCol,
            type,
            'asc'
          ))
        : (this.searchedEmployees = this.sortPipe.transform(
            this.searchedEmployees,
            sortCol,
            type,
            'desc'
          ));
      this.isNameAscending = !this.isNameAscending;
    }
    this.table?.renderRows(); // i should update the ui of the table by this way in method material
  }
  /**
   * @function toggleFilter
   * toggle side nav variable
   */
  toggleFilter() {
    this.isOpened = !this.isOpened;
  }
  /**
   * @function filterData
   * it make the full flow of filtering the data and finaly make them unique data and update the employees
   */
  filterData() {
    this.searchedEmployees = this.dataSource;
    this.employeeService.getFilter().subscribe((res) => {
      let intesrsectedCols = this.getIntersetionCols(this.empColsData, res);
      let filteredData = this.getIntersectionData(
        intesrsectedCols,
        this.dataSource
      );
      let uniqueData = new Set(filteredData);
      if (filteredData.length === 0) {
        this.searchedEmployees = this.dataSource;
      } else {
        this.searchedEmployees = Array.from(uniqueData);
      }
    });
  }
}
