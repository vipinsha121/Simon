import { Component, OnInit, Input, OnChanges, ViewEncapsulation, ChangeDetectorRef, AfterContentInit, ViewChild } from '@angular/core';
import { DocumentServiceProxy,
          DocDefinationServiceProxy,
          RequirementServiceProxy,
          DocumentCustomModel,
          RequirementCustomModel,
          RequirementDto,
          PartyServiceProxy,
          CollateralServiceProxy,
          LoanServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { AppState } from 'src/app/shared/models/app.state';
import { Store } from '@ngrx/store';
import { jqxDropDownListModule } from 'jqwidgets-ng/jqxdropdownlist';
import { jqxComboBoxComponent } from 'jqwidgets-ng/jqxcombobox';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { Observable, from, Subscription } from 'rxjs';
import { FormControl, FormBuilder, FormGroup, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { startWith, map, skip, take, filter } from 'rxjs/operators';
import { MediaMatcher } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';
import {ErrorStateMatcher} from '@angular/material/core';
import {Sort, MatSort} from '@angular/material/sort';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
import * as _moment from 'moment';
import { pageFilter } from 'src/app/shared/models/pagefilter.model';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { debug } from 'util';
import { EventEmitterService } from '../party-modal/party-form/party-form-service/event-emitter.service';
const moment = _moment;
@Component({
  selector: 'app-document3-modal',
  templateUrl: './document3-modal.component.html',
  styleUrls: ['./document3-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Document3ModalComponent implements OnInit, OnChanges, AfterContentInit {
  sortedData: DocumentCustomModel[];

  showToolbar = true;
  mobileQuery: MediaQueryList;
  mobileQueryMid: MediaQueryList;
  mobileQueryLg: MediaQueryList;
  _mobileQueryListener: () => void;
  @Input() currentDeal: any;
  dealId = 0;
  documents: Array<any> = [];
  Alldocuments: Array<any> = [];
  NewDocs: any = [];
  RelatedSelectedDocuments: any = [];
  docTypes: Array<any> = [];
  requirementsShow: Array<any> = [];
  modalRef: NgbModalRef;
  searchText: string;
  serachReqs: string;
  searchParty: string;
  activedocs = true;
  currentUserInfo: any;
  showEditAll: boolean;
  DocCtrl  = new FormControl('');
  control = new FormControl('');
  filteredDocs: Observable<any[]>;
  SelectReq: boolean;
  currentDoc: any;
  currentReq: Array<any> = [];
  selectedItem: Array<any> = [];
  selected = new FormControl(0);
  isOpenFromDocPortlet: boolean;
  requirement: RequirementDto = new RequirementDto();
  stageHistory: Array<any> = [];
  baseUrl: string;
  originalDocument: any;
  matcher = new MyErrorStateMatcher();
  searchDocT:string;
  DocTypeId: number = 0;
  selectednew = new FormControl('');
  page = 1;
  pageSize = 10;
  documentCount: number;
  currentPageFilter = new pageFilter();
  TotalDocuments: number;
  searchDocType:  string;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedRequirements: any = [];
  selectedIndex: number;
  fileDownloadModeEnabled : boolean;
  SelectedDealRequirement: Array<any> = [];
  DocColumns: any[] = ['Info', 'alternateName', 'asOfDate', 'recievedDate', 'ADDrequirement', 'attachedRequirements', 'documentDefinitionName', 'notes', 'Select'];
  searchReqs: string ;
  parties: Array<any> = [];
  collateral: Array<any> = [];
  loans: Array<any> = [];
  filterIcon = true;
  DocumentForm: FormGroup;
  DocTypeValue: string;
  DocTypeIdCondition: boolean = false;
  DocumentStatusUpdateSubscription: Subscription;
  editDocumentForReqStatus: any;
  tempReqs: Array<any> = [];


  
  hideReqList: boolean = false
  constructor(private documentService: DocumentServiceProxy,
              private store: Store<AppState>,
              private docDefinationService: DocDefinationServiceProxy,
              private requirementService: RequirementServiceProxy,
              public confirmService: confirmModalPopupService,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher,
              private FormBuilder: FormBuilder,
              private partyService: PartyServiceProxy,
              private collateralService: CollateralServiceProxy,
              private loanService: LoanServiceProxy,
              private eventEmitterService: EventEmitterService,) {
                this.mobileQuery = media.matchMedia('(max-width: 769px)');
                this.mobileQueryMid = media.matchMedia('(max-width: 1400px)');
                this.mobileQueryLg = media.matchMedia('(min-width: 1900px)');
                this._mobileQueryListener = () => changeDetectorRef.detectChanges();
                this.mobileQuery.addListener(this._mobileQueryListener);
                this.mobileQueryMid.addListener(this._mobileQueryListener);
                this.mobileQueryLg.addListener(this._mobileQueryListener);

                // this.sortedData = this.documents.slice();
                this.store.select(state => state.selectedMenu).subscribe(result => this.currentDeal = result);

               
               
  }


  // sortData(sort: MatSort) {
    
  //   const data = this.documents.slice();
  //   if (!sort.active || sort.direction === '') {
  //     this.sortedData = data;
  //     return;
  //   }

  //   this.sortedData = data.sort((a, b) => {
  //     const isAsc = sort.direction === 'asc';
  //     switch (sort.active) {
  //       case 'alternateName': return this.compare(a.name, b.name, isAsc);
  //       case 'asOfDate': return this.compare(a.AsofDate, b.AsofDate, isAsc);
  //       case 'attachedRequirements': return this.compare(a.Requirement, b.Requirement, isAsc);
  //       case 'documentDefinitionName': return this.compare(a.Type, b.Type, isAsc);
  //       case 'notes': return this.compare(a.Comment, b.Comment, isAsc);
  //       default: return 0;
  //     }
  //   });
  // }

  // compare(a: number | string, b: number | string, isAsc: boolean) {
  //   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  // }

  // private buildForms() {
  //   this.DocumentForm = new FormGroup({
  //     alternateName: new FormControl(''),
  //     asOfDate: new FormControl(''),
  //     documentDefinitionName: new FormControl(''),
  //     notes: new FormControl(''),
  //   });
  // }

  ngOnInit() {
  
    this.baseUrl = environment.baseUrl;
    if (this.currentDeal) {
      this.dealId = this.currentDeal.id;
      this.getDocsForDeal();
      this.requirementService.getRequirementList(this.currentDeal.id).subscribe(reqList => {
        this.tempReqs = reqList.partyRequirement.concat(

          reqList.collateralRequirement,
          reqList.dealRequirement,
          reqList.loanRequirement,
          reqList.requirementRequirement);


        this.tempReqs.forEach(function(value) {
          if (value && value.type && value.name) {
            value.displayValue = value.type + ' ' + value.name;
        }
        });
      });

      this.partyService.getPartyListForDeal(this.currentDeal.id, 'internal').subscribe(partyList => {
        this.parties = partyList;
      });

      this.collateralService.getCollateralForDeal(this.currentDeal.id).subscribe(collateralList => {
        this.collateral = collateralList;
      });

      this.loanService.getLoansForDeal(this.currentDeal.id).subscribe(loanList => {
        this.loans = loanList;
      });

    }

    this.store.select(state => state.currentUser).subscribe(result => {
      this.currentUserInfo = result;
    });

    this.docDefinationService.getAdmDocumentDefinitions().subscribe(docDefList => {
      this.docTypes = docDefList;
    });
    
    this.DocumentStatusUpdateSubscription = this.eventEmitterService.UpdateDocumentsReqStatus().subscribe(data => {
      this.updateCurrentDoc(this.editDocumentForReqStatus)
    });
  }

  // clearDirtyBus() {
  //   this.DocumentForm.markAsPristine();
  // }

  ngAfterContentInit() {
    // this.requirementService.getRequirementList(this.currentDeal.id).subscribe(reqList => {
    //   this.requirementsShow = reqList.partyRequirement.concat(
    //     reqList.collateralRequirement,
    //     reqList.dealRequirement,
    //     reqList.loanRequirement,
    //     reqList.requirementRequirement);


    //   this.requirementsShow.forEach(function(value) {
    //     if (value && value.type && value.name) {
    //       value.displayValue = value.type + ' ' + value.name;
    //     }
    //   });
    // });
  }

  onSelectedOptionsChange(doc, event) {
    this.currentDoc = doc;
  }

  ngOnChanges() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // filterDocs(name: string) {
  //   const filterValue = name.toLowerCase();

  //   return this.docTypes.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);

  //   // return this.docTypes.filter(Doc =>
  //   //   Doc.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  // }

  // displayFn(user): string | undefined {
  //   return user ? user.name : undefined;
  // }
  toggleToolbar() {
    this.showToolbar = !this.showToolbar;
  }


  // Getting single document and requirement on 
  getDocs(doc, req) {
    this.currentDoc = doc;
    this.currentReq = req;

    this.NewDocs.push(req);
  }

  onPrimaryTabChange(tab) {
    this.selectedIndex = tab;
  }

  // Single Document Save function
  apply() {
    const document = [] = this.currentDoc;
    this.SelectedDealRequirement.forEach((atchReq: any) => {

      if (!document.attachedRequirements) {
        document.attachedRequirements = [];
      }

      const reqExist = document.attachedRequirements.filter((docReq: any) => {
          return docReq.requirementId == atchReq.requirementId;
      });
      if (reqExist && reqExist.length == 0) {
          if (document.attachedRequirements.length == 0) {
              atchReq.isFirstReq = true;
          }

          if (document.attachedRequirements.length == 0 && atchReq.isFirstReq == true) {
              // if (!document.editCopy) {
              //     document.editCopy = {};
              // }
              document.documentDefinitionId = atchReq.documentDefinitionId;
              document.documentDefinitionName = atchReq.documentDefinitionName;

              // document.selectedDocType = $scope.documentTypes.filter(function (docType) {
              //     return docType.id == atchReq.documentDefinitionId;
              // })[0];

          }
          document.attachedRequirements.push(atchReq);
          document.requirementChanged = true;
          // angular.element("#docMultiSelect-" + document.id).addClass("ng-dirty");
          // $scope.closeAddRequirementForm();
          // document.isTableDirty = true;
      }

  });

  }


  onRemoveClick(docId: number, reqId: number, editDocument) {
    this.modalRef = this.confirmService.openCommonRemoveModal('Requirement', 'Are you sure you want to remove this requirement from the document?');
    this.modalRef.componentInstance.onNoremoveConfirmClick.subscribe(d => {
      this.modalRef.close();
    });
    this.modalRef.componentInstance.onremoveConfirmClick.subscribe(d => {
      this.documentService.deleteDocumentRequirement(docId, reqId).subscribe(data => {
        // this.getDocsForDeal();
        this.updateCurrentDoc(editDocument);
        this.modalRef.close();
      });
    });
  }

  // Get DocTypeID to Save
  // getDocId(docId){
  //   this.DocTypeId = docId;
  // }

  // Single Current Document Save
  onUpdateClick(editDocument: any) {
    
    // if(this.DocTypeIdCondition == true){
    //   editDocument.documentDefinitionId = this.DocTypeId;
    // }

    let originalExtention = '';
      // editDocument.asOfDate = $scope.asofDatedoc;
    if (editDocument.name) {
          originalExtention = editDocument.name.split('.').pop();
      }

      // strip off new file name extension if it exists and append the original file extension (users not allowed to change file type)
    if (editDocument.alternateName) {
          editDocument.alternateName = editDocument.alternateName.replace(/(.*)\.(.*?)$/, '$1');
      }

    editDocument.alternateName = editDocument.alternateName + '.' + originalExtention;

    if (editDocument.alternateName.indexOf('.') == 0) {
          // this document is missing name, so reset it to the original file nm
          editDocument.alternateName = editDocument.name;
      }

    if ((editDocument.documentDefinitionId == ' ' || editDocument.documentDefinitionId == '') || editDocument.documentDefinitionId == null) {
        editDocument.documentDefinitionId = 147;
        editDocument.documentDefinitionName = null;
        editDocument.docDefinitionCode = 'BLANK';
        } else {
            editDocument.docDefinitionCode = '';
        }
    let firstReq = editDocument.attachedRequirements.filter(function(fReq) {
          return fReq.isFirstReq == true;
      })[0];
    if (firstReq) {
          if (firstReq.documentDefinitionId) {
            // editDocument.documentDefinitionId = editDocument.selectedDocType.id;
            // editDocument.documentDefinitionName = editDocument.selectedDocType.name;
          }
          // editDocument.id = document.id;
          editDocument.primary = true;
      }
      editDocument.editDocumentRow = false;
  this.documentService.updateDocument(editDocument).subscribe(data => {

    this.documentService.getDocumentById(this.currentDeal.id, editDocument.id).subscribe(res  => {
      editDocument.documentDefinitionId = res.documentDefinitionId;
      editDocument.documentDefinitionName = res.documentDefinitionName;
      editDocument.asOfDate = res.asOfDate;
      editDocument.notes = res.notes;
      editDocument.alternateName = res.alternateName;
      editDocument.attachedRequirements = res.attachedRequirements
      editDocument.ecmUploadEnabled = res.ecmUploadEnabled;

      // res.map((doc, index) => {

        let concatdisplayValue = '';
        let concatStatusDescription = '';
        res.attachedRequirements.map(req => {
          concatdisplayValue = concatdisplayValue + req.displayValue; // concate all req.
          concatStatusDescription = concatStatusDescription + req.statusDescription;
        })
        editDocument['displayValue'] = concatdisplayValue; 
        editDocument['StatusDescription'] = concatStatusDescription; // Add new filed in data object
      // })
    })
  });
  }

    getDocsForDeal() {
    this.documentService.getDocumentsForDeal(this.currentDeal.id).subscribe(documentList => {

      this.documents = documentList;
      this.documents.forEach(doc => {
        doc.requirementChanged = false
        doc.requirementsShow = [{ }]
      })
      this.Alldocuments = documentList;

      const ELEMENT_DATA: DocumentCustomModel[] = documentList;
      this.dataSource = new MatTableDataSource(ELEMENT_DATA);

      this.dataSource.data.map((doc, index) => {

        let concatdisplayValue = '';
        let concatStatusDescription = '';
        doc.attachedRequirements.map(req => {
          concatdisplayValue = concatdisplayValue + req.displayValue; // concate all req.
          concatStatusDescription = concatStatusDescription + req.statusDescription;
        })
        this.dataSource.data[index]['displayValue'] = concatdisplayValue; 
        this.dataSource.data[index]['StatusDescription'] = concatStatusDescription; // Add new filed in data object
      })
      
      // this.dataSource.data.forEach((doc) =>{
      //   this.dataSource.data = documentList.attachedRequirements.displayValue;
      // })
      
      
      // this.dataSource.filterPredicate = (data, filter: string)  => {
      //   const accumulator = (currentTerm, key) => {
      //     return key === 'displayValue' ? currentTerm +  JSON.stringify(data.attachedRequirements.displayValue) : currentTerm + data[key];
      //   };
        
      //   const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      //   // Transform the filter by converting it to lowercase and removing whitespace.
      //   const transformedFilter = filter.trim().toLowerCase();
      //   return dataStr.indexOf(transformedFilter) !== -1;
      // };
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // this.TotalDocuments = documentList.length;
      // var pageevent: any = {};
      // pageevent.pageIndex = 0;
      // pageevent.pageSize = 10;
      this.documents.forEach(req => {
        req.ddlActions = {}
      })
      // this.documentCount = documentList.open;
      // this.currentPageFilter.maxInboxSize = this.documentCount;
      // this.currentPageFilter.numRecords = this.pageSize;
      // this.getDocumentsByPage(pageevent);

      // this.documents.sort((a, b) => {
      //   return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      // })
      this.showEditAll = true;
    });
  }

  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  updateCurrentDoc(editDocument){

    this.documentService.getDocumentById(this.currentDeal.id, editDocument.id).subscribe(res  => {
      editDocument.documentDefinitionId = res.documentDefinitionId;
      editDocument.documentDefinitionName = res.documentDefinitionName;
      editDocument.asOfDate = res.asOfDate;
      editDocument.notes = res.notes;
      editDocument.alternateName = res.alternateName;
      editDocument.attachedRequirements = res.attachedRequirements
      editDocument.requirementChanged = false;
      editDocument.ecmUploadEnabled = res.ecmUploadEnabled;

        // res.map((doc, index) => {

        let concatdisplayValue = '';
        let concatStatusDescription = '';
        res.attachedRequirements.map(req => {
          concatdisplayValue = concatdisplayValue + req.displayValue; // concate all req.
          concatStatusDescription = concatStatusDescription + req.statusDescription;
        })
        editDocument['displayValue'] = concatdisplayValue; 
        editDocument['StatusDescription'] = concatStatusDescription; // Add new filed in data object

        // let concatdisplayValue = '';
        // let concatStatusDescription = '';
        // res.attachedRequirements.map(req => {
        //   concatdisplayValue = concatdisplayValue + req.displayValue; // concate all req.
        //   concatStatusDescription = concatStatusDescription + req.statusDescription;
        // })
        // editDocument['displayValue'] = concatdisplayValue; 
        // editDocument['StatusDescription'] = concatStatusDescription; // Add new filed in data object
        
      // })
    })
  }

  openDocumentUploadMOdal() {
    this.modalRef = this.confirmService.openDocumentUploadModal(this.currentDeal);
  }

  activateOrDeactivateDoc(document: any) {

    if (document.active) {
      document.active = false;
    } else {
      document.active = true;
    }
    this.documentService.activateDeactivateDocument(document.id, document.active).subscribe(data => {

      this.getDocsForDeal();
    });
  }

  openDocument(documentId: number) {

    let fileDownloadModeEnabled = false;
    if (this.currentUserInfo.userId && this.currentUserInfo.fileDownloadModeEnabled) {
      fileDownloadModeEnabled = this.currentUserInfo.fileDownloadModeEnabled;
    }
    // this.documentService.view(documentId.toString(), fileDownloadModeEnabled).subscribe(data => {
    //   var a = data;
    // });
    window.open(this.baseUrl + 'api/v1/document/View/' + documentId + '/' + fileDownloadModeEnabled);
  }

  editAllDocuments() {
    this.dataSource.data.forEach(function (d) {
        // createDocumentEditCopy(d);
        d.editDocumentRow = true;
        d.requirementIsSelected = false;
    });
    this.showEditAll = false;
    
    // this.dataSource.filterPredicate = (data: any, filtersJson: string) => {
    //   const matchFilter = [];
    //   const filters = JSON.parse(filtersJson);

    //   filters.forEach(d => {
    //     d.editDocumentRow = true;
    //     d.requirementIsSelected = false;
    //   });

    //    // Choose one
    //     return matchFilter.every(Boolean); // AND condition
    //     // return matchFilter.some(Boolean); // OR condition
    // }
    // this.showEditAll = false;

  }

  closeAllDocuments() {
  this.dataSource.data.forEach(function (d) {
      //unchecks(un selectes) all entity of dropdown
      d.editCopy = {};
      d.editDocumentRow = false;
      // d.attachedRequirements = angular.copy(d.orgAttachedRequirements);
      // removeDocDirty(d);
      // untickeDropdown(d.dealEntities);
      d.editDocumentRow = false;
      d.showAddRequirementForm = false;
  });
  this.getDocsForDeal();
  this.showEditAll = true;
  }

  saveAllDocuments(allDocs) {
    allDocs.forEach((doc: any) => {
      
      if (doc.editDocumentRow == true){
        if (doc.asOfDate && doc.documentDefinitionId && doc.documentDefinitionId != 147) {
            this.onUpdateClick(doc);
            
          }
        else {
          doc.editDocumentRow = false;
                if (!doc.asOfDate) {
                  
                //apply validation and set that control to red and row should be in edit mode
              //angular.element("#asOfDate-" + doc.id + " div.md-datepicker-input-container").addClass("md-datepicker-invalid");
          }
        }
      }
    });
  }


  OpenAddManualModal(doc) {
    this.isOpenFromDocPortlet = true;
    this.modalRef = this.confirmService.openAddManualRequrement(this.currentDeal.id, this.isOpenFromDocPortlet, doc);
  }

  // openSelectedReqModal(){
  //   this.modalRef = this.confirmService.openSelectedReqModal(this.requirement, this.dealId, this.stageHistory);
  // }

  showRequirementDetails(req, editDocument) {
    this.requirementService.getRequirementDetails(this.currentDeal.id, req.requirementId, req.reqType).subscribe(req => {
      this.requirement = req;

      if (req.statusDescription === 'Open') {
        req.background = 'u-background-red';
      } else {
        if (req.statusDescription.toLowerCase().indexOf('complete') > -1 ||
          req.statusDescription.toLowerCase().indexOf('n/a') > -1) {
          req.background = 'u-background-green';
        } else {
          if (req.statusDescription.toLowerCase().indexOf('def') > -1 ||
            req.statusDescription.toLowerCase().indexOf('pend') > -1) {
            req.background = 'u-background-orange';
          }
        }
      }
      this.getStageHistory(req.processHistoryId);
      this.modalRef = this.confirmService.openSelectedReqModal(this.requirement, this.dealId, this.stageHistory);
      this.editDocumentForReqStatus = editDocument;
      
    });
  }

   getStageHistory(processHistoryId) {
    if (processHistoryId) {
      this.requirementService.getStageHistory(processHistoryId).subscribe(res => {
      this.stageHistory = res;
      });
    }
  }

  checkRelateToDeal(relatedSelectedDocs) {
    this.RelatedSelectedDocuments.push(relatedSelectedDocs);

  }

  OpenRelatedSelectedModal() {
    this.modalRef = this.confirmService.openRelatedSelectedModal(this.docTypes, this.currentDeal.id, this.RelatedSelectedDocuments);
  }

  public displayFnDocumentType(docType) {

    if (!docType) { return ''; }
    if (this.docTypes) {
      if (this.docTypes.length > 0) {
        const index = this.docTypes.findIndex(doc => doc.id == docType.documentDefinitionId);
        return this.docTypes[index].name;
      }
    }
  }


  // getDocumentsByPage(event) {
  //   this.page = event.pageIndex;
  //   this.pageSize = event.pageSize;
  //   var skipList: Array<any> = [];
  //   var filteredReqList: Array<any> = [];
  //   var skipPage = event.pageIndex * event.pageSize;
  //   const fullReqList = from(this.Alldocuments);
  //   const skipObs = fullReqList.pipe(skip(skipPage)).subscribe(res => {
  //     skipList.push(res);
  //   });
  //   const ReqSkipList = from(skipList);
  //   const filterObs = ReqSkipList.pipe(take(event.pageSize)).subscribe(res => {
  //     filteredReqList.push(res);
  //   });
  //   this.documents = filteredReqList;
  // }

 


  download(doc: any) {
    this.fileDownloadModeEnabled = true;
    this.documentService.download(doc.id, this.fileDownloadModeEnabled, this.currentUserInfo.userId).subscribe(res => {

    });
  }

  filter(buttonFilter: string) {
    this.searchText = buttonFilter.toLowerCase();
    this.filterIcon = false;
  }

  clearFilter() {
    this.searchText = '';
    this.filterIcon = true;
  }

  searchDocTypes(DocTypeValue){
    this.DocTypeValue = DocTypeValue;
  }

  bindData(doc:any){
    doc.requirementsShow = this.tempReqs;
  }
}
