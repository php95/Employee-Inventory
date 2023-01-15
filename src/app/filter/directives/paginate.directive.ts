import { Directive, ElementRef, Input } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import {FilterService} from '../service/filter.service'

@Directive({
  selector: '[paginate]'
})

export class PaginateDirective {

  @Input() paginate:{title?:string,next?:string}={}
    constructor(private select:MatSelect,public filterService: FilterService) {

       this.select.openedChange.subscribe((event) =>{if(event){ this.registerPanelScrollEvent()}});
   }
   
   registerPanelScrollEvent() {
    const panel = this.select.panel.nativeElement;
    panel.addEventListener('scroll', (event:any) => this.loadAllOnScroll(event));
  }
  
  loadAllOnScroll(event:any) {
    if(event.target.scrollTop===event.target.scrollTopMax){
      if(this.paginate.next){
        this.filterService.paginationNext.next(this.paginate);
      }
      
    }
  }

}
