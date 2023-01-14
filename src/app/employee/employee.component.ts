import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from './employee.service';
import { EmployeeData } from './models/empModel';
import { SearchPipe } from './pipes/search.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'date', 'salary'];
  dataSource: EmployeeData[] = [];
  searchedEmployees: EmployeeData[] = [];
  isSalaryAscending: boolean = true;
  isNameAscending: boolean = true;
  @ViewChild(MatTable) table: MatTable<any> | undefined;
  isOpened: boolean =false;

  constructor(
    private employeeService: EmployeeService,
    private searchPipe: SearchPipe,
    private sortPipe: SortPipe
  ) {}

  ngOnInit(): void {
    this.setAllEmployees();
  }

  setAllEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (employees) => {
        if (employees) {
          this.dataSource = employees as EmployeeData[];
          this.searchedEmployees = this.dataSource;
        }
      },
      (error: any) => {
        throw new Error(`The Error in api is ${error}`);
      }
    );
  }

  search(value: string): void {
    this.searchedEmployees = this.searchPipe.transform(this.dataSource, value);
  }

  sort(sortCol: string, type: string) {
    if (sortCol === 'salary') {
      this.isSalaryAscending ?  this.searchedEmployees = this.sortPipe.transform(
        this.searchedEmployees,
        sortCol,
        type,
        'asc'
      ): this.searchedEmployees = this.sortPipe.transform(
        this.searchedEmployees,
        sortCol,
        type,
        'desc'
      );
      this.isSalaryAscending = !this.isSalaryAscending;
    }
    else if (sortCol === 'name') {
      this.isNameAscending ?  this.searchedEmployees = this.sortPipe.transform(
        this.searchedEmployees,
        sortCol,
        type,
        'asc'
      ): this.searchedEmployees = this.sortPipe.transform(
        this.searchedEmployees,
        sortCol,
        type,
        'desc'
      );
      this.isNameAscending = !this.isNameAscending;
    }
    this.table?.renderRows(); // i should update the ui of the table by this way in method material
  }
  toggleFilter(){
    this.isOpened = ! this.isOpened;
  }
}
