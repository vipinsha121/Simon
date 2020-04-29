import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectorRef,
  OnChanges
} from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RequirementServiceProxy, DocumentServiceProxy, CodeServiceProxy } from './../../services/service-proxy/service-proxies';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import * as _moment from 'moment';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { MediaMatcher } from '@angular/cdk/layout';
const moment = _moment;

@Component({
  selector: 'requirement-details',
  templateUrl: './requirement-details.component.html',
  styleUrls: ['./requirement-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RequirementDetailsComponent implements OnChanges {
  @Input() requirement: any;
  @Input() dealId: number = 0;
  @Input() stageHistory: Array<any> = [];
  @Output() onCloseRequirementForm: EventEmitter<any> = new EventEmitter();
  @Output() onRequirementUpdate = new EventEmitter<any>();
  mobileQueryLG;
  mobileQuery;
  _mobileQueryListener: () => void;
  modalRef: NgbModalRef;
  showMessage: boolean = false;
  editDateDue: boolean;
  editDateExp: boolean;
  reqDetailForm: FormGroup;
  currentUser: any = [];
  baseReqQuestionsCount: number = 0;
  ticklerReqQuestionsCount: number = 0;
  searchText: string;
  dueDate = new FormControl(moment("12-25-1995", ["MM-DD-YYYY", "YYYY-MM-DD"]));
  expirationDate = new FormControl(moment("12-25-1995", ["MM-DD-YYYY", "YYYY-MM-DD"]));
  @Input() isStageChangeClicked: boolean;
  @Input() groupCode: any;

  constructor(private fb: FormBuilder,
    private store: Store<AppState>,
    private confirmService: confirmModalPopupService,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private documentService: DocumentServiceProxy,
    private requirementService: RequirementServiceProxy,
    private eventEmitterService: EventEmitterService,
    private codeService: CodeServiceProxy,
    public activeModal: NgbActiveModal) {

    this.mobileQueryLG = media.matchMedia('(min-width: 1700px)');
    this.mobileQuery = media.matchMedia('(max-width: 770px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.mobileQueryLG.addListener(this._mobileQueryListener);

    //this.sortData();

  }


  ngOnChanges() {
    this.editDateDue = false;
    this.editDateExp = false;
    this.reqDetailForm = this.fb.group({
      action: ['', [

      ]],
      assignTo: ['', [

      ]],
      deferForm: [''],
      assignForm: [''],
      question1: ['', [

      ]],
      question2: ['', [

      ]],
      dueDate: this.dueDate,
      expirationDate: this.expirationDate,
      isMitigatingFactors: false,
      mitigatingFactors: [''],
      isSubjectTo: false,
      subjectTo: ['']

    });
    this.getUser();
  }
  getUser() {
    this.store.select(user => user.currentUser).subscribe(result => {
      this.currentUser = result;
    });
  }

  toggleDateDue(duedate) {
    this.editDateDue = !this.editDateDue;
    //this.requirement.duedate = duedate;
  }

  toggleDateExp(expdate) {
    this.editDateExp = !this.editDateExp;
    // this.requirement.expirationDate = expdate;
  }

  toggleShowMessage() {
    this.showMessage = !this.showMessage;
  }

  closeRequirementDetails() {
    this.showMessage = false;
    this.onCloseRequirementForm.emit();
  }
  saveRequirement(requirement) {
    //debugger;
    requirement.lastModBy = this.currentUser.userId;
    this.requirementService.post(requirement).subscribe(res => {
      //debugger;
      this.requirementService.getRequirementDetails(this.dealId, requirement.requirementId, requirement.reqType).subscribe(req => {
//debugger;
        this.requirement = req;
        this.editDateDue = false;
        this.editDateExp = false;
        this.getBaseReqQuestions();
        this.getTicklerReqQuestions();
        this.closeDropdown();
        this.closeRequirementDetails();
        this.onRequirementUpdate.emit(req);
      });
    });
    this.eventEmitterService.UpdateStageHistory();

    if (this.isStageChangeClicked == false) {
      this.activeModal.dismiss();     
    }
  }
  getRequirementDocuments(requirementId, documentCount, req) {
    if (documentCount > 0) {
      this.requirementService.getDocumentsForRequirement(requirementId).subscribe(res => {
        this.requirement.documents = res;
      });
    }
  }
  editDocument(currentDocument, requirement) {

    this.confirmService.openDocumentEditModal(currentDocument, requirement)
  }

  removeDocument(docId, reqId, partyId) {

    this.modalRef = this.confirmService.openConfirmationModal('Document', 'Are you sure you want to remove this document?');
    this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
      this.modalRef.close();
    });
    this.modalRef.componentInstance.onConfirmClick.subscribe(d => {
      // Remove document requirement
      this.documentService.deleteDocumentRequirement(docId, reqId).subscribe(res => {
        this.modalRef.close();
        this.requirementService.getDocumentsForRequirement(reqId).subscribe(res => {
          this.requirement.documents = res;
          this.eventEmitterService.setDocumentCount(this.dealId, partyId);
          this.onRequirementUpdate.emit(this.requirement);
        });

      });
    });
  }

  closeDropdown() {

    this.eventEmitterService.closeDropdownRequirementPartyForm();
  }
  getBaseReqQuestions() {

    if (this.requirement && this.requirement.isTickler != true) {
      //commented code for time being because there are some sql table changes and this API is nt working
      // this.requirementService.getQuestionsForBaseReq(this.dealId, this.requirement.requirementId, this.requirement.reqDefinitionId).subscribe(res => {

      //   this.requirement.baseReqQuestions = res;
      //   this.baseReqQuestionsCount = this.requirement.baseReqQuestions.length;
      // });
    }
  }
  getTicklerReqQuestions() {
    if (this.requirement && this.requirement.isTickler == true) {
      this.requirementService.getQuestionsForTicklerReq(this.dealId, this.requirement.requirementId, this.requirement.ticklerDefinitionId).subscribe(res => {
        this.requirement.ticklerReqQuestions = res;
        this.ticklerReqQuestionsCount = this.requirement.ticklerReqQuestions.length;
      });
    }
  }


  isExceptionForTickler() {
    this.requirementService.checkIsExceptionForTicklerReq(this.requirement.reqQuestionCovenants).subscribe(data => {
      var needsExceptionActions = false; // default setting before knowing anything else, assume it's not an exception
      var primaryDocumentException = false; // default, assume no document exceptions yet until we check
      this.requirement.exception = data;
      var entity = this.requirement;

      if (entity.exception == true || (entity.requireDocument == true && entity.missingDocument == true)) {
        needsExceptionActions = true; // if there's already an existing exception or if a document is required but missing, then this is an exception
        if (entity.requireDocument == true && entity.missingDocument == true)
          primaryDocumentException = true; // check to see if this is specifically a missing document exception
      }
      else if (entity.showCompareFlag == "1" && entity.actualValue == null)
        needsExceptionActions = null; // this is a requirement with a question that hasn't been answered yet, so send a null
      if (entity.exception != null && entity.exceptionFlag == false && primaryDocumentException == false)
        needsExceptionActions = false; // this requirement has an existing exception condition, but it will be overriden based on the requirement definition as long as a primary document is not also required

      //call the stored procedure and pass it null, true or false based on the needsExceptionActions value determined above
      this.codeService.getProcessStageFunction(entity.initiateProcessId, this.requirement.actionStatus, this.currentUser.userId, primaryDocumentException)
        .subscribe(data => {
          this.requirement.status = '';//reset status
          this.requirement.stageDrop = data;
        });
    });
  }
  isExceptionForBaseReq() {
    this.requirementService.checkIsExceptionForBaseReq(this.requirement.reqQuestionDefinitions).subscribe(data => {
      var needsExceptionActions = false; // default setting before knowing anything else, assume it's not an exception
      var primaryDocumentException = false; // default, assume no document exceptions yet until we check
      this.requirement.exception = data;
      var entity = this.requirement;

      if (entity.exception == true || (entity.requireDocument == true && entity.missingDocument == true)) {
        needsExceptionActions = true; // if there's already an existing exception or if a document is required but missing, then this is an exception
        if (entity.requireDocument == true && entity.missingDocument == true)
          primaryDocumentException = true; // check to see if this is specifically a missing document exception
      }
      else if (entity.showCompareFlag == "1" && entity.actualValue == null)
        needsExceptionActions = null; // this is a requirement with a question that hasn't been answered yet, so send a null
      if (entity.exception != null && entity.exceptionFlag == false && primaryDocumentException == false)
        needsExceptionActions = false; // this requirement has an existing exception condition, but it will be overriden based on the requirement definition as long as a primary document is not also required

      //call the stored procedure and pass it null, true or false based on the needsExceptionActions value determined above
      this.codeService.getProcessStageFunction(entity.initiateProcessId, this.requirement.actionStatus, this.currentUser.userId, primaryDocumentException)
        .subscribe(data => {
          this.requirement.status = '';//reset status
          this.requirement.stageDrop = data;
        });
    });
  }

  public checkAssigned(): boolean {
    if(this.requirement && this.requirement.action) {
      if(this.requirement.action.name == 'Assign') {
        if (this.requirement.assignedTo == null) {
          return false
        }
      }
    }
    return true
  }

  showDocumentAdd(requirement) {
    this.modalRef = this.confirmService.openDocumentAddModal(requirement);
  }

}
