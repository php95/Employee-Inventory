import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
      api: 'https://restcountries.com/v2/all?fields=name',
      multiple: false,
    },
    {
      title: 'country',
      type: 'dropdown',
      api: 'https://restcountries.com/v2/all?fields=name',
      multiple: false,
    },
    {
      title: 'Date',
      type: 'date',
    },
  ];
  dropdownUrls:string[] = [];
  constructor(private http: HttpClient) {}

  getFilters(): Observable<FilterData[]> {
    return of(this.filterData);
  }

  getDropdownUrls() {
    this.getFilters().subscribe((res: FilterData[]) => {
      res.forEach((item) => {
        if (item.type === 'dropdown') {
          this.dropdownUrls.push(item.api as string);
        } 
      });
      return this.dropdownUrls;
    });
  }

  getDropdownData(url: string | undefined = this.filterData[2].api):Observable <unknown> {
    if (url) {
     return this.http.get(url);
    }
    return of([]);
  }

}
