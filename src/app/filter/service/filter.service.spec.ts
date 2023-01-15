import { HttpClient, HttpHandler } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { FilterService } from './filter.service';

const filterData = {
  filters: [
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
  ],
};

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http get filters from http service', inject(
    [HttpClient],
    (http: HttpClient) => {
      let filters = spyOn(http, 'get');
      service.getFilters();
      expect(filters).toHaveBeenCalled();
    }
  ));
  it('should return two dropdown data urls with filters with two dropdowns ', () => {
    let urls = service.getDropdownUrls(filterData.filters);
    expect(urls.length).toEqual(2);
  });
  it('should get with url from http service', inject(
    [HttpClient],
    (http: HttpClient) => {
      let dropdownData = spyOn(http, 'get');
      service.getDropdownData('url');
      expect(dropdownData).toHaveBeenCalled();
    }
  ));
  it('should get without url from http service', inject(
    [HttpClient],
    (http: HttpClient) => {
      let dropdownData = spyOn(http, 'get');
      service.getDropdownData(undefined);
      expect(dropdownData).not.toHaveBeenCalled();
    }
  ));
});
