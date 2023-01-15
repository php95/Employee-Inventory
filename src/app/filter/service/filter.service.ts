import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { FilterData } from '../models/filterModel';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filterData = [
    {
      title: 'Email',
      type: 'text',
    },
    {
      title: 'Phone',
      type: 'text',
    },
    {
      title: 'Name',
      type: 'text',
    },
    {
      title: 'country',
      type: 'dropdown',
      api: 'https://my-json-server.typicode.com/php95/countries-api/page1?_limit=12',
      multiple: false,
    },
    {
      title: 'country2',
      type: 'dropdown',
      api: 'https://my-json-server.typicode.com/php95/countries-api/page2?_limit=12',
      multiple: false,
    },
    {
      title: 'Date',
      type: 'date',
    },
  ];
  paginationNext =new Subject<{title?:string,next?:string}>();
  dropdownUrls:{title:string,url?:string}[] = [];
  constructor(private http: HttpClient) {
  }

  getFilters(): Observable<FilterData[]> {
    this.getDropdownUrls();
    return of(this.filterData);
  }

  getDropdownUrls() {
      this.filterData.forEach((item) => {
        if (item.type === 'dropdown') {
          this.dropdownUrls.push({title:item.title,url:item.api});
        } 
      });
      return this.dropdownUrls;
  }

  getDropdownData(url: string | undefined):Observable <{dataList:[],next:""}> {
    if (url) {
     return this.http.get(url) as Observable <{dataList:[],next:""}>;
    }
    return of();
  }



  
}
