import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { FilterData } from '../models/filterModel';
import { filterFormApiUrl } from '../../core/apiDefines';

@Injectable({
  providedIn: 'root',
})
/** 
 * @class FilterService
 */
export class FilterService {
  /** subject to hold stream of pagination updates */
  paginationNext = new Subject<{ title?: string, next?: string }>();
  /** array holds dropdown urls */
  dropdownUrls: { title: string, url?: string }[] = [];
  /**
   * @constructor
   * @param http http client
   */
  constructor(private http: HttpClient) {
  }
  /**
   * @function getFilters
   * fires http request to get dynamci filter form inputs
   * @returns {Observable<FilterData[]>}
   */
  getFilters(): Observable<FilterData[]> {
    return this.http.get(filterFormApiUrl) as Observable<FilterData[]>;
  }
  /**
   * @function getDropdownUrls
   * search in dynamic filters for dropdown type inputs
   * create object holds the dropdown title attached with the dropdown data url
   * @param filters {FilterData[]}
   * @returns 
   */
  getDropdownUrls(filters: FilterData[]) {
    filters.forEach((item) => {
      if (item.type === 'dropdown') {
        this.dropdownUrls.push({ title: item.title, url: item.api });
      }
    });
    return this.dropdownUrls;
  }
  /**
   * @function getDropdownData
   * fires http request to get dropdown input data
   * @param url string
   * @returns {Observable <{dataList:[],next:""}>}
   */
  getDropdownData(url: string | undefined): Observable<{ dataList: [], next: "" }> {
    if (url) {
      return this.http.get(url) as Observable<{ dataList: [], next: "" }>;
    }
    return of();
  }




}
