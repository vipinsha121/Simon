import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { pageFilter } from '../../models/pagefilter.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Inbox } from '../../models/inbox.model';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { simonGridService } from './simpon-grid-service';
import { Observable } from 'rxjs';
import { InboxServiceProxy, RequirementServiceProxy } from '../../services/service-proxy/service-proxies';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { jqxLoaderComponent } from 'jqwidgets-ng/jqxloader';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../services/local-storage/localstorage.service';
import { jqxMenuComponent } from 'jqwidgets-ng/jqxmenu';
import { jqxInputComponent } from 'jqwidgets-ng/jqxinput';
import { jqxNumberInputComponent } from 'jqwidgets-ng/jqxnumberinput';
import { jqxWindowComponent } from 'jqwidgets-ng/jqxwindow';
import { Message } from '@stomp/stompjs';
import { AmqpService } from '../../services/amqp/amqp.service';
import { AppConsts } from 'src/app/shared/app-constants';
import { PageEvent } from '@angular/material';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import{ MatMenuTrigger } from '@angular/material';
import { SimonSharedService } from '../../services/SimonGlobalService';

declare var $:any
@Component({
    selector: 'simon-grid',
    templateUrl: './simon-grid.component.html',
    styleUrls: ['./simon-grid.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class SimonGridComponent implements OnInit {
    constructor(private store: Store<AppState>, public confirmService: confirmModalPopupService, private simonSharedSvc: SimonSharedService,
        public simonGrid: simonGridService, private _inboxService: InboxServiceProxy, private _requirementService: RequirementServiceProxy,
        private router: Router, private localStorageService: LocalstorageService, private amqpServie: AmqpService, ) {
        this.store.select(state => state.inbox).subscribe(res => {
            this.currentInboxData = res.filter(x => x.active == true)[0];
        });
        this.inboxObservable$ = store.select(state => state.inbox);

        this.simonSharedSvc.clearSearch$.subscribe(data => {
            this.filterValue = 'null';
            $('#searchBox').val('');
        });
    }

    @ViewChild('myGrid') myGrid: jqxGridComponent;
    @ViewChild('jqxLoader') jqxLoader: jqxLoaderComponent;
    @ViewChild('myWindow') myWindow: jqxWindowComponent;
    @ViewChild('Deal') Deal: jqxInputComponent;
    @ViewChild('Name') Name: jqxInputComponent;
    @ViewChild('myMenu') myMenu: jqxMenuComponent;

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;

    contextMenuPosition = { x: '0px', y: '0px'};

    // @Input() inboxId: any;
    @Output() onPaginationChange: EventEmitter<any> = new EventEmitter();
    @Output() veiwDealdata: EventEmitter<any> = new EventEmitter();
    currentInboxData: Inbox;
    currentMenu: Inbox;
    public isTableLoading = false;
    currentPageFilter = new pageFilter();
    inboxDef: any = [];
    nestedInboxDef: any = {};
    source: any = {};
    NestedSource: any = {};
    dataAdapter: any; NesteddataAdapter: any; gridColumns: any[];
    NestedgridColumns: any[]; filterValue = 'null'; inboxDefData: any;
    NestedinboxDefData: any; inboxObservable$: Observable<Inbox[]>;
    isUpdateBoundData = false; nestedGrids: any[] = new Array();
    nestedInboxcolumns: any; counter = 1; editrow = -1;
    public receivedMessages: string[] = []; currentDealData: any = {};
    keys = [];
    hyperdatakeys = [];
    length = 100;
    pageSize = 10;
    pageSizeOptions: number[] = [10, 15, 25, 100];
    pageEvent: PageEvent;
    datasource = [];
    modalRef: NgbModalRef;
    activePageDataChunk = [];
    rowdetailstemplate: any = {
        rowdetails: '<div id="nestedGrid" style="margin: 10px;"></div>', rowdetailsheight: 220, rowdetailshidden: true
    };

    ngOnInit() {
        this.store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
            this.subscribeInbox(this.currentDealData.dealId);
        });
        this.getGridData();
    }
    ngAfterViewInit(): void {
        document.addEventListener('contextmenu', event => event.preventDefault());
    }
    pageevent(event) {
        this.currentPageFilter.page = event.page;
        this._inboxService.getInbox(this.currentMenu.id, 'mmcbroom', this.filterValue , this.currentPageFilter.orderBy, event.pageSize, event.pageIndex + 1, this.currentPageFilter.reverseSort).subscribe(res => {
            this.inboxDef = res;
            this.inboxDefData = this.inboxDef.data;
            this.keys = Object.keys(this.inboxDefData['1']);
            let inboxcol = this.inboxDef.columns;
            let inboxcolumns = inboxcol.map(data => {
                return {
                    text: data.name,
                    datafield: data.field,
                    width: data.width,
                    filtertype: 'input',
                    columntype: data.columnType === '90' ? 'icon' : 'textbox',
                    align: data.textalignment,
                    cellsalign: data.textalignment,
                    hidden: !data.visible,
                    hyperlink: data.hyperlink,
                    hyperlinknavigate: data.hyperlinkfunctionid
                };
    
            });
            let columndata = inboxcol.map(data => {
                return {
                    name: data.field, type: data.columndatatype
                };
            });

            this.source = {
                datatype: 'array',
                datafields: columndata,
                localdata: this.inboxDefData,
                totalrecords: this.inboxDef.dataCount,
            };
            this.dataAdapter = new jqx.dataAdapter(this.source);
            this.gridColumns = inboxcolumns;



        });

        this._inboxService.getInbox('PBReqMy', 'mmcbroom', this.filterValue, this.currentPageFilter.orderBy, this.currentMenu.defaultRowsPerPage, this.currentPageFilter.page, this.currentPageFilter.reverseSort).subscribe(res => {

            this.nestedInboxDef = res;
            this.NestedinboxDefData = this.nestedInboxDef.data;
            let nestedInboxcol = this.nestedInboxDef.columns;
            this.nestedInboxcolumns = nestedInboxcol.map(data => {
                return {
                    text: data.name,
                    datafield: data.field,
                    width: data.width,
                    filtertype: 'input',
                    columntype: 'textbox'
                };
            });
            let nestedColumndata = nestedInboxcol.map(data => {
                return {
                    name: data.field, type: 'string'
                };
            });
            this.NestedSource = {
                datatype: 'array',
                datafields: nestedColumndata,
                record: this.NestedinboxDefData,
                localdata: this.NestedinboxDefData,
            };
            this.NesteddataAdapter = new jqx.dataAdapter(this.NestedSource);
            });

    }

    getGridData() {
        this.inboxObservable$.subscribe(result => {
            this.currentMenu = result.filter(x => x.active == true)[0];
            if (this.currentMenu) {
                // this.currentPageFilter = new pageFilter();
                this.isTableLoading = true;

                this._inboxService.getInbox(this.currentMenu.id,
                  'mmcbroom',
                  this.filterValue,
                  this.currentPageFilter.orderBy,
                  this.currentMenu.defaultRowsPerPage,
                  this.currentPageFilter.page,
                  this.currentPageFilter.reverseSort).subscribe(res => {

                    this.inboxDef = res;
                    this.inboxDefData = this.inboxDef.data;
                    this.keys = Object.keys(this.inboxDefData["0"]);
                    var inboxcol = this.inboxDef.columns;
                    var inboxcolumns = inboxcol.map(data => {
                        if (data.columnType != 'icon') {
                            return {
                                text: data.name,
                                datafield: data.field,
                                width: data.width,
                                filtertype: 'input',
                                columntype: data.columnType === '90' ? 'icon' : data.columnType === '01' ? '' : 'textbox',
                                align: data.textalignment,
                                cellsalign: data.textalignment,
                                hidden: !data.visible,
                                hyperlink: data.hyperlink,
                                hyperlinknavigate: data.hyperlinkfunctionid
                            };
                        }
                    });
                    var columndata = inboxcol.map(data => {
                        return {
                            name: data.field, type: data.columndatatype
                        };
                    });
                    this.source = {
                        datatype: 'array',
                        datafields: columndata,
                        localdata: this.inboxDefData,
                        totalrecords: this.inboxDef.dataCount,
                    };
                    this.dataAdapter = new jqx.dataAdapter(this.source);
                    this.gridColumns = inboxcolumns;
                    //console.log("Inbox-Columns",inboxcolumns);console.log("Column-Data",columndata);console.log("Source-Data",this.source);
                });
            }
        });

        this._inboxService.getInbox('PBReqMy', 'mmcbroom',
        this.filterValue,
        this.currentPageFilter.orderBy,
        this.currentMenu.defaultRowsPerPage,
        this.currentPageFilter.page,
        this.currentPageFilter.reverseSort).subscribe(res => {

            this.nestedInboxDef = res;
            this.NestedinboxDefData = this.nestedInboxDef.data;
            let nestedInboxcol = this.nestedInboxDef.columns;
            this.nestedInboxcolumns = nestedInboxcol.map(data => {
                return {
                    text: data.name,
                    datafield: data.field,
                    width: data.width,
                    filtertype: 'input',
                    columntype: 'textbox'
                };
            });
            let nestedColumndata = nestedInboxcol.map(data => {
                return {
                    name: data.field, type: 'string'
                };
            });
            this.NestedSource = {
                datatype: 'array',
                datafields: nestedColumndata,
                record: this.NestedinboxDefData,
                localdata: this.NestedinboxDefData,
            };
            this.NesteddataAdapter = new jqx.dataAdapter(this.NestedSource);
        });
    }
    initrowdetails = (index: number, parentElement: any, gridElement: any, record: any): void => {
        if (record) {
            const id = record.dealid_05.toString();
            const nestedGridContainer = parentElement.children[0];
            this.nestedGrids[index] = nestedGridContainer;
            const filtergroup = new jqx.filter();
            let filter_or_operator = 1;
            const filtervalue = id;
            const filtercondition = 'equal';
            const filter = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);
            const requirements = this.NestedSource.localdata;
            const requirementsbyid = [];
            for (let i = 0; i < requirements.length; i++) {
                const result = filter.evaluate(requirements[i].dealid_05);
                if (result) {
                    requirementsbyid.push(requirements[i]);
                }
            }
            const requirementSource = {
                datafields: this.NestedSource.datafields,
                localdata: requirementsbyid
            };
            const nestedGridAdapter = new jqx.dataAdapter(requirementSource);
            if (nestedGridContainer != null) {
                const settings = {
                    width: '95%',
                    height: 200,
                    source: nestedGridAdapter,
                    columns: this.nestedInboxcolumns
                };
                jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
            }
        }
    }
    getWidth(): any {
        if (document.body.offsetWidth < 850) {
            return '100%';
        }
        return '100%';
    }
    getHeight(): any {
        // if (document.body.offsetWidth < 850) {
        //   return '100%';
        // }
        return '100%';
    }
    // For Pagination.
    rendergridrows = (params: any): any[] => {
        return this.inboxDefData;
    }
    ready = (): void => {
        this.myGrid.showrowdetails(1);
    }

    renderer = (row: number, column: any, value: string): string => {
        return '<span style="margin-left: 4px; margin-top: 9px; float: left;">' + value + '</span>';
    }
    onPageChanged(event: any): void {
        const firstCut = event.pageIndex * event.pageSize;
        const secondCut = firstCut + event.pageSize;
        this.inboxDefData = this.datasource.slice(firstCut, secondCut);

    }

    setPageSizeOptions(setPageSizeOptionsInput: string) {
        this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
      }

    onPageSizeChanged(event: any): void {
        this.isUpdateBoundData = true;
        const args = event.args;
        const pagesize = args.pagesize;
        this.currentMenu.defaultRowsPerPage = pagesize;
    }

    // To Open deal.
    rowdoubleclick(event) {
        const deal = event;
        this.localStorageService.addDealToStore({
            dealId: deal.dealid_05,
            dealName: deal.partyname_10,
            active: true,
            routerURL: '/main/deal/' + deal.dealid_05
        });
        this.router.navigateByUrl('/main/deal/' + deal.dealid_05);
    }

    // For Context Menu
    myGridOnContextMenu(): boolean {
        return false;
    }
    myGridOnRowClick(event: any): void | boolean {
        if (event.args.rightclick) {
            this.myGrid.selectrow(event.args.rowindex);
            const scrollTop = window.scrollY;
            const scrollLeft = window.scrollX;
            this.myMenu.open(parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
            return false;
        }
    }
    myMenuOnItemClick(event: any): void {
        const args = event.args;
        const rowindex = this.myGrid.getselectedrowindex();
        if (args.innerHTML == 'Edit Selected Row') {
            this.editrow = rowindex;
            this.myWindow.position({ x: 60, y: 60 });
            // get the clicked row's data and initialize the input fields.
            const dataRecord = this.myGrid.getrowdata(this.editrow);
            this.Deal.val(dataRecord.dealid_05);
            this.Name.val(dataRecord.partyname_10);
            // show the popup window.
            this.myWindow.open();
        } else {
            const rowid = this.myGrid.getrowid(rowindex);
            this.myGrid.deleterow(rowid);
        }
    }
    // For export.
    excelBtnOnClick() {
        this.myGrid.exportdata('xls', 'jqxGrid');
    }
    csvBtnOnClick() {
        this.myGrid.exportdata('csv', 'jqxGrid');
    }    pdfBtnOnClick() {
        this.myGrid.exportdata('pdf', 'jqxGrid');
    }
    tsvBtnOnClick() {
        this.myGrid.exportdata('tsv', 'jqxGrid');
    }    jsonBtnOnClick() {
        this.myGrid.exportdata('json', 'jqxGrid');
    }

    // Amqp Implementation

    onSendMessage() {
        let jsonMsg = {
            dealid_05: '10090',
            partyname_10: 'Oley sdhf jsdhf newone',
            productdesc_10: 'Commercial 1-4 Family newone',
            amount_06: '5000'
            // userid_10: "mmcbroom newone",
            // regiondesc_10: "San Juan newone",
            // stagelabel_10: "Booking newone"
        };
        this.amqpServie.publishToRabbitMQ(AppConsts.inboxExchangeKey + '/' + this.currentDealData.dealId, JSON.stringify(jsonMsg));
    }

    subscribeInbox(inboxId: string): void {
        this.amqpServie.subscribeToRabbitMQ('/exchange/' + AppConsts.inboxExchangeKey + '/' + inboxId)
            .subscribe((message: Message) => {
                let data = JSON.parse(message.body);
                if (data.isNew == true) {
                    this.inboxDef.Data.splice(0, 0, data);
                } else {
                    if (this.inboxDef) {
                        let inboxData = this.inboxDef.data;
                        inboxData.forEach(ibdata => {
                            if (data.dealid_05 == ibdata.dealid_05) {
                                Object.keys(data).forEach(key => {
                                    ibdata[key] = data[key];
                                });
                            }
                        });
                        this.myGrid.updatebounddata();
                    }
                }
            });
    }

    sortDeals(filedId) {
        this.currentPageFilter.reverseSort = !this.currentPageFilter.reverseSort;
        if (filedId) {
            this.currentPageFilter.orderBy = filedId;
        }
        this.getGridData();
    };
    searchValue(e) {
        this.filterValue = e.srcElement.value;
        this.getGridData();
      }      checkLink(key) {
         let result = this.gridColumns.filter((item) => {
              return (item.datafield === key && item.hyperlink);
          });
         return result;
      }
      detail(columnData,data){
          if(columnData.length>0) {
            if(columnData[0].hyperlinknavigate == "DealSummary"){
                this.localStorageService.addDealToStore({
                    dealId: data.dealid_05,
                    dealName: data.partyname_10,
                    active: true,
                    routerURL: '/main/deal/' + data.dealid_05
                });
                this.router.navigateByUrl('/main/deal/' + data.dealid_05);
           }
            if(columnData[0].hyperlinknavigate == "RequirementForm"){
                this._requirementService.getRequirementById(data.requirementid_05,data.dealid_05,'').subscribe(res => {
                    this.modalRef = this.confirmService.openSelectedReqModal(res, data.dealid_05, data.stagename_10);
                });
            }
        }
    }

    onContextMenu(event: MouseEvent, item: any) {
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { item: item };
        this.contextMenu.openMenu();
      }


  detectRightMouseClick(event) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = JSON.stringify(event);
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
}

copymethod(select: string) {
       let selectvalue;
       if (window.getSelection) {
       selectvalue = window.getSelection();
      }
       return selectvalue;
  }
}
