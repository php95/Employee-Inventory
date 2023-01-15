import { Directive, ElementRef, Input } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import {FilterService} from '../service/filter.service'

@Directive({
  selector: '[paginate]'
})

export class PaginateDirective {
  /**
   * input holds the input data needed for pagination
   */
  @Input() paginate:{title?:string,next?:string}={};
    /**
     * @constructor
     * @param select MatSelect
     * @param filterService FilterService
     */
    constructor(private select:MatSelect,public filterService: FilterService) {

       this.select.openedChange.subscribe((event) =>{if(event){ this.registerPanelScrollEvent()}});
   }
   /**
    * @function registerPanelScrollEvent
    * access element panel 
    * add event listener to scroll event on panel
    */
   registerPanelScrollEvent() {
    const panel = this.select.panel.nativeElement;
    panel.addEventListener('scroll', (event:any) => this.loadAllOnScroll(event));
  }
  /**
   * @function loadAllOnScroll
   * detect when scroller reaches last element to fire the pagination calls 
   * @param event 
   */
  loadAllOnScroll(event:any) {
    if(event.target.scrollTop===event.target.scrollTopMax){
      if(this.paginate.next){
        this.filterService.paginationNext.next(this.paginate);
      }
      
    }
  }

}
