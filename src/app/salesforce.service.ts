import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SalesforceService {
  constructor(private http: HttpClient) {}

  getListViewOfObjects(val) {
    let headers = {
      Authorization:
        'Bearer 00D5j0000036d6I!AQ4AQKs5E9C0jYLVWsscocHUmZ20w.eUq78D01is1EHh_EKFwPA9daxXL82dtE411Vb_rUX3w04z5GFWlGvgO.3ieAR1gEsT',
    };
    let query =
      "Select Id,Name,DeveloperName,sobjecttype from Listview where sobjecttype ='" +
      val +
      "'";
    return this.http.get(
      'https://sharingtest-dev-ed.my.salesforce.com/services/data/v53.0/query/?q=' +
        query,
      {
        headers,
      }
    );
  }
  getListViewRecords(listViewId, objectName) {
    let headers = {
      Authorization:
        'Bearer 00D5j0000036d6I!AQ4AQKs5E9C0jYLVWsscocHUmZ20w.eUq78D01is1EHh_EKFwPA9daxXL82dtE411Vb_rUX3w04z5GFWlGvgO.3ieAR1gEsT',
    };
    return this.http.get(
      'https://sharingtest-dev-ed.my.salesforce.com/services/data/v50.0/sobjects/' +
        objectName +
        '/listviews/' +
        listViewId +
        '/results',
      {
        headers,
      }
    );
  }
}
