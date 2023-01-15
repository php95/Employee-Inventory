import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { FilterData } from '../models/filterModel';
import { filterFormApiUrl } from '../../core/apiDefines';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  paginationNext =new Subject<{title?:string,next?:string}>();
  dropdownUrls:{title:string,url?:string}[] = [];
  constructor(private http: HttpClient) {
  }

  // get filtered data api
  getFilters(): Observable<FilterData[]> {
    return this.http.get(filterFormApiUrl) as Observable<FilterData[]>;
  }

  //get all dropdown api urls from filtered data
  
  getDropdownUrls(filters:FilterData[]) {
      filters.forEach((item) => {
        if (item.type === 'dropdown') {
          this.dropdownUrls.push({title:item.title,url:item.api});
        } 
      });
      return this.dropdownUrls;
  }



  // get dropdown data from the api

  getDropdownData(url: string | undefined):Observable <{dataList:[],next:""}> {
    if (url) {
     return this.http.get(url) as Observable <{dataList:[],next:""}>;
    }
    return of();
  }



  
}
