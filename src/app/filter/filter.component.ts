import { Component, Input, OnInit} from '@angular/core';
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
export class FilterComponent implements OnInit{
  @Input() toggleSideNav:boolean =false; 
  constructor(private filterService: FilterService,
    private _route: ActivatedRoute,
    private _router: Router,
    private employeeService: EmployeeService,
    private dateService:DateService){

  }
  ngOnInit(): void {
    this.getDropdownUrls();
    this.getFiltersFromQueryParam();
    this.filterService.paginationNext.subscribe((paginate)=>{

      if(paginate){
        this.filterService.getDropdownData(paginate.next).subscribe((result)=>{
          if(this.dropdowns[paginate.title??''] && this.dropdowns[paginate.title??''].dataList.length){
            (this.dropdowns[paginate.title??''].dataList as []).push(...result.dataList);
            if(!result.next){
              this.dropdowns[paginate.title??''].next=null;
            }
          }
        else{
          this.dropdowns[paginate.title??'']={
            dataList:result.dataList as [],
            next:result.next?result.next:null
          } 
        }
         });

      }

    });
  }
  showFiller = false;
  dropdownUrls:string[] = [];
  dropdowns:any={};
  filters:FilterData[] = [];
  filteredParams:any ;

  getDropdownUrls() {
    this.filterService.getFilters().subscribe((res: FilterData[]) => {
      this.filters = res;
      this.filterService.getDropdownUrls(this.filters);
      this.filterService.dropdownUrls.forEach((dropdownData)=>{

        this.filterService.getDropdownData(dropdownData.url).subscribe((result)=>{
 
        this.dropdowns[dropdownData.title]={
          dataList:result.dataList as [],
          next:result.next?result.next:null
        }         
         });

      });
    });
  }
  getFiltersFromQueryParam(){
    this._route.queryParams
      .subscribe(params => {
        this.filteredParams = params;
      }
    );

  }
  stringifyDate(data: any) {
    for (let item in data) {
      let msec = Date.parse(data[item]);
      if(!Number.isNaN(msec)){
       data[item]=this.dateService.formatDate(data[item]);
      }
    }
    return data;
  }


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
  loadmore = (event:any) => {
    var target = event.target
    if ( target.scrollTop + target.offsetHeight === target.scrollHeight) {
    }
  }

 
}
