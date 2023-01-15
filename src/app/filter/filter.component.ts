import { Component, Input, OnInit } from '@angular/core';
import { FilterData } from './models/filterModel';
import { FilterService } from './service/filter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee/employee.service';
import { DateService } from '../core/services/date.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  /** toggle side view nav bar flag input from parent component */
  @Input() toggleSideNav: boolean = false;
  /**  */
  showFiller = false;
  /** holds dropdowns pagination urls */
  dropdownUrls: string[] = [];
  /** holds dropdown filters */
  dropdowns: any = {};
  /** holds all dynamic filters */
  filters: FilterData[] = [];
  /** holds filters query params */
  filteredParams: any;

  /** @function constructor  */
  constructor(private filterService: FilterService,
    private _route: ActivatedRoute,
    private _router: Router,
    private employeeService: EmployeeService,
    private dateService: DateService) {

  }
  /**
 * @function ngOnInit 
 * initialize the dynamic filter form 
 * get filters from api and fill dropdowns with dynamic data 
 * check for query strings to initialze the form with.
 * @returns {void}
 */
  ngOnInit(): void {
    this.getDropdownUrls();
    this.getFiltersFromQueryParam();
    this.paginateDropdown();

  }

  paginateDropdown() {
    this.filterService.paginationNext.subscribe((paginate) => {
      if (paginate) {
        this.filterService.getDropdownData(paginate.next).subscribe((result) => {
          if (this.dropdowns[paginate.title ?? ''] && this.dropdowns[paginate.title ?? ''].dataList.length) {
            (this.dropdowns[paginate.title ?? ''].dataList as []).push(...result.dataList);
            if (!result.next) {
              this.dropdowns[paginate.title ?? ''].next = null;
            }
          }
          else {
            this.dropdowns[paginate.title ?? ''] = {
              dataList: result.dataList as [],
              next: result.next ? result.next : null
            }
          }
        });

      }

    });
  }

  /** 
   * @function getDropdownUrls
   * get dynamic filters from the api
   * get dynamci dropdown data from api
   * @returns {void}
   */
  getDropdownUrls() {
    this.filterService.getFilters().subscribe((res: FilterData[]) => {
      this.filters = res;
      this.filterService.getDropdownUrls(this.filters);
      this.filterService.dropdownUrls.forEach((dropdownData) => {

        this.filterService.getDropdownData(dropdownData.url).subscribe((result) => {

          this.dropdowns[dropdownData.title] = {
            dataList: result.dataList as [],
            next: result.next ? result.next : null
          }
        });

      });
    });
  }
    /**
   * @function getFiltersFromQueryParam
   * check url for query params 
   * @returns {void}
   */
  getFiltersFromQueryParam() {
    this._route.queryParams
      .subscribe(params => {
        this.filteredParams = params;
      }
      );

  }
    /**
   * @function stringifyDate
   * @param data any
   * search for data of type date
   * check for date validity
   * re-assign date value with new date format YYYY-MM-DD
   * @returns updated data with date formated
   */
  stringifyDate(data: any) {
    for (let item in data) {
      let msec = Date.parse(data[item]);
      if (!Number.isNaN(msec)) {
        data[item] = this.dateService.formatDate(data[item]);
      }
    }
    return data;
  }

  /**
   * @function filterEmployees
   * @param data {object}
   * collect filter data values from the dynamic form 
   * update the route with the new filter query params 
   * call employee service to start filtering the employees
   * @returns {void}
   */
  filterEmployees(data: object) {
    data = this.stringifyDate(data);
    this.employeeService.sendFilter(data);
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
