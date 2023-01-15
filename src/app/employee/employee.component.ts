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
  displayedColumns: string[] = ['id', 'name', 'email', 'date','country', 'salary'];
  dataSource: EmployeeData[] = [];
  searchedEmployees: EmployeeData[] = [];
  isSalaryAscending: boolean = true;
  isNameAscending: boolean = true;
  @ViewChild(MatTable) table: MatTable<any> | undefined;
  isOpened: boolean = false;
  empColsData: string[] = [];

  constructor(
    private employeeService: EmployeeService,
    private searchPipe: SearchPipe,
    private sortPipe: SortPipe,
    private dateService: DateService
  ) { }

  ngOnInit(): void {
    this.setAllEmployees();
    this.filterData();
  }

  setEmpsCols(empData: EmployeeData[]): void {
    let oneEmpData = empData[0];
    for (let emp in oneEmpData) {
      this.empColsData.push(emp);
    }
  }

  getIntersetionCols(empDataCols: any, filterData: any) {
    let intersectionCols: any[] = [];
    empDataCols.forEach((empCol: any) => {
      for (let filterCol in filterData) {
        if (empCol === filterCol) {
          let filterObj:any={};
          if (filterData[filterCol]) {            
            filterObj[filterCol] = filterData[filterCol]
            intersectionCols.push(filterObj)
          }
        }
      }
    });
    return intersectionCols;
  }

  getIntersectionData(intersectionCols: object[]) :any[] {
    let filteredData :any = []
    intersectionCols.forEach((colData)=>{
      let colDataKey =Object.keys(colData)[0];
      let colDataValue =Object.values(colData)[0];      
      this.searchedEmployees.forEach((employee)=>{
       let searchKey= Object.keys(employee).find((key)=>key===colDataKey)
        if(searchKey){
          if(searchKey==='date'){
          let dateValue1= this.dateService.getDateMsecValue(this.dateService.formatDate(employee['date']));
          let dateValue2= this.dateService.getDateMsecValue(this.dateService.formatDate(colDataValue));
          if(dateValue1 && dateValue2)
          {
            if(dateValue1===dateValue2){

              filteredData.push(employee);
            }

          }
      }
      else if(searchKey==='country'){
        if(employee.country?.code===colDataValue){
          filteredData.push(employee);
        }

      }
       else if (Object.values(employee).includes(colDataValue)){
          filteredData.push(employee);
        }
      }
      })
    })
    return filteredData;
  }

  setAllEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (employees) => {
        if (employees) {
          this.dataSource = employees as EmployeeData[];
          this.searchedEmployees = this.dataSource;
          this.setEmpsCols(this.searchedEmployees);
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
      this.isSalaryAscending ? this.searchedEmployees = this.sortPipe.transform(
        this.searchedEmployees,
        sortCol,
        type,
        'asc'
      ) : this.searchedEmployees = this.sortPipe.transform(
        this.searchedEmployees,
        sortCol,
        type,
        'desc'
      );
      this.isSalaryAscending = !this.isSalaryAscending;
    }
    else if (sortCol === 'name') {
      this.isNameAscending ? this.searchedEmployees = this.sortPipe.transform(
        this.searchedEmployees,
        sortCol,
        type,
        'asc'
      ) : this.searchedEmployees = this.sortPipe.transform(
        this.searchedEmployees,
        sortCol,
        type,
        'desc'
      );
      this.isNameAscending = !this.isNameAscending;
    }
    this.table?.renderRows(); // i should update the ui of the table by this way in method material
  }
  toggleFilter() {
    this.isOpened = !this.isOpened;
  }
  filterData() {
    this.employeeService.getFilter().subscribe((res) => {
      let intesrsectedCols = this.getIntersetionCols(this.empColsData, res);
      let filteredData = this.getIntersectionData(intesrsectedCols);
      let uniqueData = new Set(filteredData);
      if(filteredData.length === 0 ){
        this.searchedEmployees = this.dataSource;
      }
      else {
        this.searchedEmployees = Array.from(uniqueData);
      }
    })
  }
}
