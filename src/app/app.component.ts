import { Component } from '@angular/core';
import {
  DataStateChangeEvent,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { SalesforceService } from './salesforce.service';

@Component({
  selector: 'my-app',
  template: `
        <div>
        <h1 class="display-1">Salesforce Record View</h1>
        <br/>
        <kendo-combobox
          [data]="objectItems"
          textField="text"
          (valueChange)="objectChange($event)"
          valueField="value"
          placeholder="Select Object"
        >
        </kendo-combobox>   


        <br/>
        <br/>
        <kendo-combobox
        [data]="listItems"
        textField="text"
        (valueChange)="valueChange($event)"
        valueField="value"
        placeholder="Select View Type"
        >
        </kendo-combobox>    

        <br/>
        <br/>
        <kendo-grid [data]="gridData" filterable="menu" [pageSize]="state.take" [skip]="state.skip"
         [pageable]="true" [filter]="state.filter" (dataStateChange)="dataStateChange($event)">
            <ng-template kendoGridToolbarTemplate>
              <button kendoGridPDFCommand icon="file-pdf">Export to PDF</button>
            </ng-template>
            <kendo-grid-column *ngFor="let each of columns" [filterable]="each.value == 'Name'" [field]="each.value" [title]="each.text"> </kendo-grid-column>
            
            
            <kendo-grid-pdf
                fileName="Accounts.pdf"
                [allPages]="true"
                paperSize="A4"
                [repeatHeaders]="true"
                [landscape]="true"
            >
              <kendo-grid-pdf-margin
                top="2cm"
                left="1cm"
                right="1cm"
                bottom="2cm"
               ></kendo-grid-pdf-margin>
              <ng-template
                kendoGridPDFTemplate
                let-pageNum="pageNum"
                let-totalPages="totalPages"
              >
              <div class="page-template">
                   <div class="header">
                      <div style="float: right">
                          Page {{ pageNum }} of {{ totalPages }}
                      </div>
                   Multi-page grid with automatic page breaking
                </div>
              <div class="footer">Page {{ pageNum }} of {{ totalPages }}</div>
            </div>
          </ng-template>
        </kendo-grid-pdf>
      </kendo-grid>

      </div>
    `,
})
export class AppComponent {
  constructor(private sfservice: SalesforceService) {}

  public objectItems: Array<{ text: string; value: string }> = [
    { text: 'Account', value: 'Account' },
    { text: 'Contact', value: 'Contact' },
    { text: 'Opportunity', value: 'Opportunity' },
    { text: 'Case', value: 'Case' },
  ];
  public listItems: Array<{ text: string; value: string }> = [];
  public state: State = {
    skip: 0,
    take: 5,
    filter: {
      logic: 'and',
      filters: [],
    },
  };

  public records: any = [];
  public columns: any = [];
  public gridData: GridDataResult;
  public object: string;

  public valueChange(value: any): void {
    this.getRecordsAccordingToView(value.value);
  }
  public objectChange(value: any): void {
    this.object = value.value;
    console.log(this.object);
    this.listItems = [];
    this.getListViewOfObject();
  }

  ngOnInit() {}

  getListViewOfObject() {
    this.sfservice.getListViewOfObjects(this.object).subscribe((result) => {
      console.log(result);
      let data: any = result;
      for (let i = 0; i < data.records.length; i++) {
        if (!data.records[i].Name.includes('All')) {
          this.listItems.push({
            text: data.records[i].Name,
            value: data.records[i].Id,
          });
        }
      }
    });
  }
  getRecordsAccordingToView(id) {
    this.sfservice.getListViewRecords(id, this.object).subscribe((result) => {
      let response: any = result;
      console.log('response', response);
      let data = [];
      let columns = [];
      for (let i = 0; i < response.columns.length; i++) {
        columns.push({
          text: response.columns[i].label,
          value: response.columns[i].fieldNameOrPath,
        });
        if (columns.length == 6) {
          break;
        }
      }
      this.columns = [...columns];
      console.log('columns', this.columns);
      for (let i = 0; i < response.records.length; i++) {
        let obj = {};
        for (let j = 0; j < response.records[i].columns.length; j++) {
          // console.log(response.records[i].columns[j].value);
          let key = response.records[i].columns[j].fieldNameOrPath.toString();
          let value = response.records[i].columns[j].value;
          obj[key] = value;
        }
        data.push({ ...obj });
      }
      this.records = [...data];
      console.log(this.records);
      this.gridData = process(this.records, this.state);
    });
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    console.log(this.columns);
    this.state = state;
    this.gridData = process(this.records, this.state);
  }
}
