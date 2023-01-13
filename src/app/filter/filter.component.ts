import { Component, Input, OnInit} from '@angular/core';
import { FilterData } from './models/filterModel';
import { FilterService } from './service/filter.service';

interface Country {
  name: string;
}

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
  countries:Country[] = [{name:'ehtipia'},{name:'egypt'},{name:'germany'}];
  filters:FilterData[] = []

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
  filterEmployees(data:unknown){
    console.log(data);
    

  }
}
