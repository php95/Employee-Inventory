import { Component, Input, OnInit} from '@angular/core';
import { FilterData } from './models/filterModel';
import { FilterService } from './service/filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit{
  constructor(private filterService:FilterService){

  }
  ngOnInit(): void {
    this.getDropdownUrls();
  }
  @Input() toggleSideNav:boolean =false; 
  showFiller = false;
  dropdownUrls:string[] = [];
  dropdowns:any={};
  filters:FilterData[] = []

  getDropdownUrls() {
    this.filterService.getFilters().subscribe((res: FilterData[]) => {
      this.filters = res;
      this.filterService.dropdownUrls.forEach((dropdownData)=>{

        this.filterService.getDropdownData(dropdownData.url).subscribe((result)=>{
 
        this.dropdowns[dropdownData.title]={
          dataList:result as []
        }
         console.log(result);
         
         console.log("dropdowns:",this.dropdowns)
         });

      });
    });
  }
  filterEmployees(data:unknown){
    console.log(data);
    

  }
  loadmore = (event:any) => {
    console.log(event)
    var target = event.target
    if ( target.scrollTop + target.offsetHeight === target.scrollHeight) {
      console.log("load")
    }
  }
}
