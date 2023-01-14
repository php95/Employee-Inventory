import { Component, Input, OnInit } from '@angular/core';
import { FilterData } from './models/filterModel';
import { FilterService } from './service/filter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee/employee.service';

interface Country {
  name: string;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  constructor(
    private filterService: FilterService,
    private _route: ActivatedRoute,
    private _router: Router,
    private employeeService: EmployeeService) {

  }
  ngOnInit(): void {
    this.getDropdownUrls();
    this.getFiltersFromQueryParam()
  }
  @Input() toggleSideNav: boolean = false;
  showFiller = false;
  dropdownUrls: string[] = [];
  countries: Country[] = [{ name: 'ehtipia' }, { name: 'egypt' }, { name: 'germany' }];
  filters: FilterData[] = []
  filteredParams:any ;
  getDropdownUrls() {
    this.filterService.getFilters().subscribe((res: FilterData[]) => {
      this.filters = res;
      console.log(this.filters)
      // res.forEach((item) => {
      //   if (item.type === 'dropdown') {
      //     this.dropdownUrls.push(item.api as string);
      //  this.filterService.getDropdownData(item.api).subscribe((result)=>{
      //  (result as []).map((item)=>{
      //    console.log({item});

      //  });

      // this.countries = result as [];
      // console.log(result);

      // console.log("countries:",this.countries)
      //})
      //  } 
      //});
      //  return this.dropdownUrls;
    });
  }
  getFiltersFromQueryParam(){
    this._route.queryParams
      .subscribe(params => {
        this.filteredParams = params
      }
    );

  }
  stringifyDate(data: any) {
    for (let item in data) {
      data[item] = data[item] as unknown instanceof Date ? data[item].toString() : data[item];
    }
    return data;
  }
  filterEmployees(data: object) {    
    this.employeeService.sendFilter(data);
    console.log({data})
    data = this.stringifyDate(data);
    var snapshot = this._route.snapshot;
    const params = { ...snapshot.queryParams };
    delete params['pos'];
    this._router.navigate([`.`], {
      queryParams: {
        ...data
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
    })
  }
}
