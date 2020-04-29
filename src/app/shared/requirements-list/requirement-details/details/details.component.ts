import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import * as _moment from "moment";
import {
  CodeServiceProxy,
  DocumentServiceProxy,
  RequirementServiceProxy,
  LoanServiceProxy
} from "../../../services/service-proxy/service-proxies";
import { Store } from "@ngrx/store";
import { AppState } from "../../../models/app.state";
import { confirmModalPopupService } from "../../../../modal/confirmService";
import { MediaMatcher } from "@angular/cdk/layout";
import { EventEmitterService } from "../../../../main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
const moment = _moment;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnChanges {

  @Input() dealId: number;
  @Input() requirementId: number;
  @Input() reqType: string;

  

  reqDetailForm: FormGroup;
  requirement: any;
  currentUser: any;
  editDateDue: boolean = false;
  editDateExp: boolean = false;
  baseReqQuestionsCount: number = 0;
  ticklerReqQuestionsCount: number = 0;
  dueDate = new FormControl(moment("12-25-1995", ["MM-DD-YYYY", "YYYY-MM-DD"]));
  expirationDate = new FormControl(moment("12-25-1995", ["MM-DD-YYYY", "YYYY-MM-DD"]));
  showMessage: boolean = false;
  @Input() isStageChangeClicked: boolean;
  @Output() onRequirementUpdate = new EventEmitter<any>();
  req: any;
  reqForModalPop: any;
  @Input() groupCode: any;
  loanRequestType: string;
  requirementsDue: any;


  constructor(private formBuilder: FormBuilder,
    private requirementService: RequirementServiceProxy,
    private store: Store<AppState>,
    private confirmService: confirmModalPopupService,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private documentService: DocumentServiceProxy,
    private eventEmitterService: EventEmitterService,
    private codeService: CodeServiceProxy,
    private loanService: LoanServiceProxy,
    public activeModal: NgbActiveModal) { }

  ngOnChanges() {
    this.reqDetailForm = this.formBuilder.group({
      action: ['', []],
      assignTo: ['', []],
      deferForm: [''],
      assignForm: [''],
      question1: ['', []],
      question2: ['', []],
      dueDate: this.dueDate,
      expirationDate: this.expirationDate,
      isMitigatingFactors: false,
      mitigatingFactors: [''],
      isSubjectTo: false,
      subjectTo: ['']
    });

    this.getDetails();
    this.getUser();
  }

  getDetails() {
    if (!this.dealId || !this.requirementId || !this.reqType) return;

    this.requirementService.getRequirementDetails(this.dealId, this.requirementId, this.reqType).subscribe(req => {
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
      this.requirement = req;
    });
  }

  getUser() {
    this.store.select(user => user.currentUser).subscribe(result => {
      this.currentUser = result;
    });
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

  public checkAssigned(): boolean {
    if (this.requirement && this.requirement.action) {
      if (this.requirement.action.name && this.requirement.action.name == 'Assign') {
        if (this.requirement.assignedTo == null) {
          return false
        }
      }
    }
    return true
  }

  saveRequirement(requirement) {
    requirement.lastModBy = this.currentUser.userId;
    this.requirementService.post(requirement).subscribe(res => {
      this.requirementService.getRequirementDetails(this.dealId, requirement.requirementId, requirement.reqType).subscribe(req => {

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
      this.eventEmitterService.UpdateDocumentsReqStatus();
      this.activeModal.dismiss();
    if (this.isStageChangeClicked == false) {
      this.activeModal.dismiss();
    }

    if (this.isStageChangeClicked == true) {
      if (this.groupCode == null) {
        this.groupCode = '01';
      }

      this.loanService.getPrimaryLoanByDeal(this.dealId).subscribe(res => {
        if (res && res.requestType) {
          this.loanRequestType = res.requestType;
        }

        this.requirementService.getRequirementDueByDealStage(this.dealId, this.groupCode, this.loanRequestType).subscribe(dt => {
          //debugger;
          this.requirementsDue = dt;
          this.eventEmitterService.setReqListInModalPopUp(this.requirementsDue);
        })
      })
    }
  }

  closeDropdown() {
    this.eventEmitterService.closeDropdownRequirementPartyForm();
  }

  closeRequirementDetails() {
    this.showMessage = false;
    //this.onCloseRequirementForm.emit();
  }
  toggleDateDue(duedate) {
    this.editDateDue = !this.editDateDue;
    //this.requirement.duedate = duedate;
  }
}
