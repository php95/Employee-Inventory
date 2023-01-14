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
    this.filterService.paginationNext.subscribe((paginate)=>{

      if(paginate){
        this.filterService.getDropdownData(paginate.next).subscribe((result)=>{
          console.log("get dropdown data");
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
        
         console.log("dropdowns:",this.dropdowns)
         });

      }

    });
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
          dataList:result.dataList as [],
          next:result.next?result.next:null
        }         
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
