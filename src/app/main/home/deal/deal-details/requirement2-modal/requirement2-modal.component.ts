import { Component, OnInit, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { RequirementServiceProxy, CodeServiceProxy, RequirementDto, ProcessStageServiceProxy, DocumentServiceProxy, NotificationServiceProxy, RequirementQuestion, LoanServiceProxy, PartyServiceProxy, CollateralServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { AppState } from 'src/app/shared/models/app.state';
import { Store } from '@ngrx/store';
import { pageFilter } from 'src/app/shared/models/pagefilter.model';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { Observable, of, throwError, from } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { NgbModalRef, NgbDatepickerI18nHebrew } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-requirement2-modal',
  templateUrl: './requirement2-modal.component.html',
  styleUrls: ['./requirement2-modal.component.scss'],
})
export class Requirement2ModalComponent implements OnInit {
  _mobileQueryListener: () => void;
  @Input() currentDeal: any;
  @Input() isProcessPortlet: any;
  mediaQuery;
  //dealId: number = 0;
  requirements: Array<any> = [];
  fullRequirements: Array<any> = [];
  userDropdown: Array<any> = [];
  selectedRequirement: any = {};
  requirementsCount: number;
  isSideFormOpen = false;
  private value: any = {};
  disabled = false;
  searchText: string;
  page = 1;
  pageSize = 10;
  currentPageFilter = new pageFilter();
  items: Array<any> = [];
  currentUserInfo: any; updatederequirement: any;
  fromReqDueScreen: any; reqspipe: Array<any> = [];
  openreq: boolean; currentdoc: any; baseUrl: string; maxpagesize = 0;
  attentionreq: boolean; isOpenFromDocPortlet: boolean; serachR: string;
  closereq: boolean; filteredReq: any; editCopy: RequirementQuestion = new RequirementQuestion();
  hardstopreq: boolean; stageHistory: any; modalRef: NgbModalRef; requirementSideForm: any;
  assignForm: FormGroup;
  deferForm: FormGroup;
  parties: Array<any> = [];
  collateral: Array<any> = [];
  loans: Array<any> = [];
  filterIcon = true;

  constructor(private requirementService: RequirementServiceProxy,
    private codeService: CodeServiceProxy,
    private processStageService: ProcessStageServiceProxy,
    private notificationService: NotificationServiceProxy,
    public confirmService: confirmModalPopupService,
    private fb: FormBuilder,
    private loanservice: LoanServiceProxy,
    private documentService: DocumentServiceProxy,
    private store: Store<AppState>,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private partyService: PartyServiceProxy,
    private collateralService: CollateralServiceProxy,
    private loanService: LoanServiceProxy) {

    this.store.select(state => state.selectedMenu).subscribe(result =>
      this.currentDeal = result);
    this.mediaQuery = media.matchMedia('(min-width: 1700px)');
  }

  ngOnInit() {

    // this.assignForm = this.fb.group({
    //   search: ['', [
    //     Validators.minLength(5)
    //   ]]
    // });

    // this.deferForm = this.fb.group({
    //   search: ['', [
    //     Validators.minLength(5)
    //   ]]
    // });

    this.baseUrl = environment.baseUrl;

    if (!this.isProcessPortlet) {
      if (this.currentDeal) {
        this.requirementService.getRequirementList(this.currentDeal.id).subscribe(requirementList => {
          let data = requirementList.partyRequirement.concat(requirementList.collateralRequirement, requirementList.dealRequirement, requirementList.loanRequirement, requirementList.requirementRequirement);

          this.requirements = [];
          this.requirements = data;
          this.reqspipe = data;
          this.requirements.forEach(req => {
            req.isSelected = false;
          });
          this.maxpagesize = this.requirements.length;
          this.fullRequirements = data;
          const pageevent: any = {};
          pageevent.pageIndex = 0;
          pageevent.pageSize = 25;
          this.requirements.forEach(req => {
            req.ddlActions = {};
          });
          this.requirementsCount = requirementList.open;
          this.currentPageFilter.maxInboxSize = this.requirementsCount;
          this.currentPageFilter.numRecords = this.pageSize;
          this.getRequirementListByPage(pageevent);
        });
      }

    } else {
      if (this.currentDeal) {
        this.requirementService.getProcessRequirementList(this.currentDeal.id).subscribe(requirementList => {
          let data = requirementList.partyRequirement.concat(requirementList.collateralRequirement, requirementList.dealRequirement, requirementList.loanRequirement, requirementList.requirementRequirement);

          this.requirements = [];
          this.requirements = data;
          this.reqspipe = data;
          this.maxpagesize = this.requirements.length;
          this.fullRequirements = data;
          const pageevent: any = {};
          pageevent.pageIndex = 0;
          pageevent.pageSize = 10;
          this.requirements.forEach(req => {
            req.ddlActions = {};
          });
          this.requirementsCount = requirementList.open;
          this.currentPageFilter.maxInboxSize = this.requirementsCount;
          this.currentPageFilter.numRecords = this.pageSize;
          this.getRequirementListByPage(pageevent);
        });
      }
    }
    this.store.select(state => state.currentUser).subscribe(result => {
      this.currentUserInfo = result;
    });

    // this.store.select(state => state.deal).subscribe(result => {
    // this.currentDeal = result.filter(x => x.active === true)[0];
    //this.dealId = this.currentDeal.dealId;
    //});

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

  ngOnChanges(data: any) {
  }

  setSideForm(req) {
    this.requirements.forEach(requirement => {
      requirement.isSelected = false
    })
    req.isSelected = true
    // this.selectedRequirement = req
    this.requirementService.getRequirementDetails(this.currentDeal.id, req.requirementId, req.reqType).subscribe(data => {

      this.isSideFormOpen = true;
      this.selectedRequirement = data;
      if (data.processHistoryId) {
        this.requirementService.getStageHistory(data.processHistoryId)
          .subscribe(stageHis => {
            this.stageHistory = stageHis;
          });
      } else {
        this.stageHistory = [];
      }
    });
  }


  getStatusDropDown(req) {

    if (!req.stageDrop || req.stageDrop.length == 0) {
      let needsExceptionActions = false, primaryDocumentException = false;

      if (req.exception == true || (req.requireDocument == true && req.missingDocument == true)) {
        needsExceptionActions = true; // if there's already an existing exception or if a document is required but missing, then this is an exception
        if (req.requireDocument == true && req.missingDocument == true) {
          primaryDocumentException = true;
        } // check to see if this is specifically a missing document exception
      } else if (req.showCompareFlag == '1' && req.sctualValue == null) {
        needsExceptionActions = null;
      } // this is a requirement with a question that hasn't been answered yet, so send a null
      if (req.exception != null && req.ExceptionFlag == false && primaryDocumentException == false) {
        needsExceptionActions = false;
      } // this requirement has an existing exception condition, but it will be overriden based on the requirement definition as long as a primary document is not also required


      this.codeService.getProcessStageFunction(req.initiateProcessId, req.actionStatus || req.status, 'mmcbroom', needsExceptionActions)
        .subscribe(data => {
          req.stageDrop = data;
          // $scope.setAssignedTo($scope.actionStatus);
          // $scope.setAssignedTo(actionStatus, req);
          // Sets flags for row icons
          // $scope.setReqPortletIconFlags(data);
        });
    }
  }

  onCloseRequirementForm() {
    this.isSideFormOpen = false;
  }

  setAssignedTo(status, req) {
    
    if ((!(typeof status === 'object') && status !== null) || !status) {
      return;
    }

    // var selectedObject = angular.fromJson(status);
    const selectedObject = status;

    const sObj = req.stageDrop.filter(i => i.id == selectedObject.id);
    // $scope.requirementSideForm.status = selectedObject.id;
    req.actionStatus = selectedObject.id;
    if (req) {
      req.functionId = selectedObject.functionId;
      req.processStageFunctionId = selectedObject.processStageFunctionId;
      if (selectedObject.type) {
        req.actionType = selectedObject.type;
      }
    }

    if (selectedObject && selectedObject.notifyDefinition) {
      req.notifyDefinition = selectedObject.notifyDefinition;
    } else {
      req.notifyDefinition = null;
    }

    // if (sObj && sObj.length && sObj[0].type && sObj[0].type.toLowerCase() == 'u') {
    // if (selectedObject && selectedObject.name.toLowerCase() == 'assign') {

    if (selectedObject && selectedObject.type.toLowerCase() == 'u') {
      req.showUserDrop = true;
      if (req.assignedTo == null) {
        req.assigneToReq = true;
      } else {
        req.assignedToFullName;
      }
      this.getUserDropDownData(req, selectedObject.functionId);
    } else {
      req.showUserDrop = false;
    }
    // if (sObj && sObj.length && sObj[0].type && sObj[0].type.toLowerCase() == 'd')
    // if (selectedObject && selectedObject.name.toLowerCase() == 'defer')
    if (selectedObject && selectedObject.type.toLowerCase() == 'd') {
      req.showDeferDrop = true;
    } else {
      req.showDeferDrop = false;
    }
    this.getDefertoDropdown(req.requirementId, this.currentDeal.id, req);
  }

  setRequirementDirty(event, r) {
    r.isDirty = true;
  }


  onPageChange(changedPage) {
    this.page = changedPage;
  }



  requirementsData() {
    return this.requirements.sort((a, b) => a.priority - b.priority);
    // .sort((a, b) => a.type - b.type);
  }


  getRequirementDocuments(requirementId, documentCount) {
    if (documentCount > 0) {
      this.requirementService.getDocumentsForRequirement(requirementId).subscribe(res => {

        let req = this.requirements.filter(rP => {
          return rP.requirementId == requirementId;
        })[0];
        req.documents = [];
        req.documents = res;

        req.documentCount = res.length;
      });
    }
  }

  showDocumentDetail(d, r) {

  }

  removeDocument(docId, reqId, req) {
    this.modalRef = this.confirmService.openConfirmationModal('Document', 'Are you sure you want to remove this document?');
    this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
      this.modalRef.close();
    });
    this.modalRef.componentInstance.onConfirmClick.subscribe(d => {
      // Remove document requirement
      this.documentService.deleteDocumentRequirement(docId, reqId).subscribe(res => {
        this.modalRef.close();
        this.getRequirementDocuments(reqId, req.documentCount);
      });
    });
  }



  getUserDropDownData(req, functionId) {
    if (functionId == undefined) {
      functionId = 'ReqAssign';
    }
    this.processStageService.getProcessStageFunctionUser(req.processId, req.stageId, functionId, 'mmcbroom').subscribe(data => {

      this.userDropdown = data;
      req.items = this.userDropdown.map(data => {
        return {

          id: data.userId,
          text: data.firstName + ' ' + data.lastName
        };
      });
    });

  }





  // Gets the selected value
  public selectAssignedToUser(selectedUserName, req) {
    this.serachR = selectedUserName.text;
    req.selectedUserName = selectedUserName.text;
    req.assignedToFullName = selectedUserName.text;
    req.assignedTo = selectedUserName.id;
    // if ($scope.requirement) {
    //   $scope.requirement.assignedTo = selectedUserName.userId;
    // }
    // $scope.assigneToReq = false;
    req.assigneToReq = false;
    // $scope.isAssignedToNull = false;
    this.serachR = '';
  }

  // Removes the selected value
  public removed(value: any): void {
  }

  // Types the selected value
  public validateAssignedUser(requirement: any): void {

    requirement.assigneToReq = true;
  }

  public refreshValue(value: any): void {
    this.value = value;
  }
  // EndRegion

  setDirty(obj) {

    obj.isDirty = true;
    if (!obj.assignedToFullName || obj.assignedToFullName == ' ') {
      obj.assigneToReq = true;
    }

  }

  saveRequirement(req: any) {
    if (req.ddlActions && req.ddlActions.selectedItem && req.ddlActions.selectedItem.name == 'Assign') {
      if ((req.assignedTo && req.assignedTo != null) && req.assigneToReq == false) {
        this.saveIndividualEditRow(req);
        req.assigneToReq = false;
      } else {
        req.assigneToReq = true;
      }
    } else {
      req.assigneToReq = false;
      this.saveIndividualEditRow(req);
    }
  }
  saveIndividualEditRow(req) {
    if (req) {
      req.createdBy = this.currentUserInfo.userId;
      req.lastModBy = this.currentUserInfo.userId;
      req.reqDealId = this.currentDeal.id;
      req.status = req.actionStatus;

      let notificationRequest = null;

      // new notification request code to eventually replace the code above
      if (req.notifyDefinition) {
        notificationRequest = {};
        notificationRequest.notifyDefinitionId = req.notifyDefinition;
        notificationRequest.requestUserId = this.currentUserInfo.userId;
        notificationRequest.assignedUserId = req.assignedTo;
        notificationRequest.processStageFunctionType = 'F';
        notificationRequest.processId = req.processId;
        notificationRequest.stageId = req.stageId;
        notificationRequest.functionId = req.functionId;
        notificationRequest.processStageFunctionId = req.processStageFunctionId;
        notificationRequest.processStageFunctionDetail = 'test details';
        notificationRequest.notifyParameters = '@testparam_10=testvalue';
        notificationRequest.dealId = this.currentDeal.id;
        notificationRequest.requirementId = req.requirementId;
        // $scope.notificationRequest.partyId = 0;
      }
      if (req.showDeferDrop == false) {
        req.deferStageName = null;
        req.deferToStage = null;
      }
      // end new notification request code

      this.requirementService.post(req).subscribe(data => {

        req.editRequirementRow = false;
        req.isDirty = false;
        if (this.fromReqDueScreen) {

        } else {

          req.dealId = this.currentDeal.id;
        }
        req.showUserDrop = false;
        req.showDeferDrop = false;
        req.ddlActions = [];
        this.requirementService.getRequirementById(req.requirementId)
          .subscribe(
            data => {

              const filterReqList = this.requirements.filter(reqData => {
                if (reqData.requirementId == data.requirementId) {
                  return true;
                }
              });


              const index = this.requirements.indexOf(filterReqList[0]);

              req.stageDrop = null;
              req.statusDescription = data.statusDescription;


              if (!data.assignedToFullName || !data.assignedTo) {
                req.selectedUserName = null;
                req.assignedToFullName = '';
                req.assignedTo = null;
              } else {
                req.selectedUserName = data.assignedTo;
                req.assignedToFullName = data.assignedToFullName;
              }
              if (!data.deferToStage) {
                req.deferToStage = null;
              } else {
                req.deferToStage = data.deferToStage;
              }

            });
        // this.store.select(state => state.selectedMenu).subscribe(result => {
        //   this.currentDeal = result;
        //   this.requirementService.getRequirementList(this.currentDeal.id).subscribe(requirementList => {

        //     var data = requirementList.partyRequirement.concat(requirementList.collateralRequirement, requirementList.dealRequirement, requirementList.loanRequirement, requirementList.requirementRequirement);
        //     this.requirements = data;
        //     this.requirements.forEach(req => {
        //       req.ddlActions = {}
        //     })
        //     this.requirementsCount = requirementList.open;
        //     this.currentPageFilter.maxInboxSize = this.requirementsCount;
        //     this.currentPageFilter.numRecords = this.pageSize;
        //     var pageevent: any = {};
        //     pageevent.pageIndex = this.page;
        //     pageevent.pageSize = this.pageSize;
        //     this.fullRequirements = this.requirements;
        //     this.getRequirementListByPage(pageevent);

        //   })
        // });

        this.removeDirty(req);
        if (notificationRequest) {
          this.notify(notificationRequest, req);
        }
      });
    }
  }
  removeDirty(req) {
    req.isDirty = false;
  }
  notify(notificationRequest, req) {
    this.notificationService.updateNotification(notificationRequest).subscribe(data => {

      if (!data.error) {

        const notifyData = data;
        if (notifyData) {
        }
      } else {
        req.notificationError = data.error;
      }
    });
  }

  cancelReqPortletRow(r) {
    r.showUserDrop = false;
    r.showDeferDrop = false;
    r.isDirty = false;
    this.requirementService.getRequirementById(r.requirementId)
      .subscribe(
        data => {
          const filterReqList = this.requirements.filter(reqData => {
            if (reqData.requirementId == data.requirementId) {
              return true;
            }
          });

          const index = this.requirements.indexOf(filterReqList[0]);
         // this.requirements[index] = data;
          r.isAttention = data.isAttention;
          r.ddlActions = {};
          // r.stageDrop = null;
          if (!data.assignedToFullName || !data.assignedTo) {
            r.selectedUserName = null;
            r.assignedToFullName = ' ';
            r.assignedTo = null;
          } else {
            r.selectedUserName = data.assignedTo;
            r.assignedToFullName = data.assignedToFullName;
          }
          if (!data.deferToStage) {
            r.deferToStage = null;
          } else {
            r.deferToStage = data.deferToStage;
          }
          // r.actionStatus = null;
        });
  }

  getDefertoDropdown(requirementId, dealId, req) {
    this.processStageService.getDeferTo(requirementId, dealId).subscribe(data => {
      if (data) {
        req.deferDrop = data;
      }
    });
  }

  showReqQuestionModal(requirement) {
    // $scope.requirement = req;
    this.createEditCopyCommentQuestion(requirement);
    // this.modalRef = this.confirmService.openReqQuestionModal(requirement);

  }


  createEditCopyCommentQuestion(req) {
    // $scope.isCommentsSideFormLoading = true;
    this.requirementService.getRequirementDetails(this.currentDeal.id, req.requirementId, req.reqType).subscribe(data => {
      req.editCopy = data;
      const reqPort = this.requirements.filter(r => {
        return r.requirementId == data.requirementId;
      })[0];
      reqPort.editCopy = data;
      this.requirementSideForm = reqPort;
      // $scope.isCommentsSideFormLoading = false;
      if (data.processHistoryId) {
        this.requirementService.getStageHistory(data.processHistoryId).subscribe(data => {
          this.stageHistory = data;
        });
      } else {
        this.stageHistory = [];
      }
      if (req.isTickler == true) {
        req.ticklerReqQuestions = this.getTicklerReqQuestions(req);
      } else {
        req.baseReqQuestions = this.getBaseReqQuestions(req);
      }
      this.modalRef = this.confirmService.openReqQuestionModal(req, this.requirementSideForm);
      this.modalRef.componentInstance.isExceptionClick.subscribe(reqdata => {

        this.requirementService.post(reqdata).subscribe(data => {

          this.filteredReq = this.requirements.filter(reqP => {
            return reqP.requirementId == req.requirementId;
          })[0];
          let needsExceptionActions = false; // default setting before knowing anything else, assume it's not an exception
          let primaryDocumentException = false; // default, assume no document exceptions yet until we check
          req.exception = data.exception;
          const entity = req;
          if (entity.exception == true || (entity.requireDocument == true && entity.missingDocument == true)) {
            needsExceptionActions = true; // if there's already an existing exception or if a document is required but missing, then this is an exception
            if (entity.requireDocument == true && entity.missingDocument == true) {
              primaryDocumentException = true;
            } // check to see if this is specifically a missing document exception
          } else if (entity.showCompareFlag == '1' && entity.actualValue == null) {
            needsExceptionActions = null;
          } // this is a requirement with a question that hasn't been answered yet, so send a null
          if (entity.exception != null && entity.exceptionFlag == false && primaryDocumentException == false) {
            needsExceptionActions = false;
          } // this requirement has an existing exception condition, but it will be overriden based on the requirement definition as long as a primary document is not also required
          this.modalRef.close();
          this.codeService.getProcessStageFunction(req.initiateProcessId, req.status, this.currentUserInfo.userId, needsExceptionActions)
            .subscribe(data => {
              req.status = ''; // reset status
              req.stageDrop = data;
              this.filteredReq.status = ''; // res
              this.filteredReq.stageDrop = data;
              // this.saveQuestions(d);
            });


        });
      });

      this.modalRef.componentInstance.onCancelClick.subscribe(d => {

        this.clearLTVFlags(d);
        if (d.editCopy) {
          d.editCopy = {};
        }
        this.modalRef.close();
      });
    });
  }
  saveQuestions(req) {

    // $scope.isCommentsSideFormLoading = true;
    this.editCopy.id = req.requirementId,
      this.editCopy.exception = req.exception,
      this.editCopy.valueLabel = req.valueLabel,
      this.editCopy.compareFlag = req.compareFlag,
      this.editCopy.showCompareFlag = req.showCompareFlag,
      this.editCopy.expectedValue = req.expectedValue,
      this.editCopy.actualValue = req.actualValue,
      this.editCopy.lastModBy = this.currentUserInfo.userId;

    this.requirementService.postQuestions(this.editCopy).subscribe(data => {

      // $scope.isCommentsSideFormLoading = false;
      this.modalRef.close();
    });
  }

  clearLTVFlags = function (req) {
    req.isNumberInvalid = false;
    req.isLTVNull = false;
  };

  showAddRequirementForm() {
    this.isOpenFromDocPortlet = false;
    this.currentdoc = null;
    this.store.select(state => state.selectedMenu).subscribe(result => {
      this.currentDeal = result;
    });
    this.modalRef = this.confirmService.openAddManualRequrement(this.currentDeal.id, this.isOpenFromDocPortlet, this.currentdoc);

    this.modalRef.componentInstance.onRequirmentsave.subscribe(data => {

      if (!this.isProcessPortlet) {
        this.store.select(state => state.selectedMenu).subscribe(result => {
          this.currentDeal = result;
          this.requirementService.getRequirementList(this.currentDeal.id).subscribe(requirementList => {

            const data = requirementList.partyRequirement.concat(requirementList.collateralRequirement, requirementList.dealRequirement, requirementList.loanRequirement, requirementList.requirementRequirement);
            this.requirements = data;
            this.requirements.forEach(req => {
              req.ddlActions = {};
            });
            this.requirementsCount = requirementList.open;
            this.currentPageFilter.maxInboxSize = this.requirementsCount;
            this.currentPageFilter.numRecords = this.pageSize;
            this.modalRef.close();
          });
        });
      } else {
        this.store.select(state => state.selectedMenu).subscribe(result => {
          this.currentDeal = result;
          this.requirementService.getProcessRequirementList(this.currentDeal.id).subscribe(requirementList => {

            const data = requirementList.partyRequirement.concat(requirementList.collateralRequirement, requirementList.dealRequirement, requirementList.loanRequirement, requirementList.requirementRequirement);
            this.requirements = data;
            this.requirements.forEach(req => {
              req.ddlActions = {};
            });
            this.requirementsCount = requirementList.open;
            this.currentPageFilter.maxInboxSize = this.requirementsCount;
            this.currentPageFilter.numRecords = this.pageSize;
            this.modalRef.close();
          });
        });
      }
    });
  }

  activateRequirements() {
    let loanRequestType = '';

    // $scope.isRequirementPortletLoading = true;
    // $scope.showDealHeaderLoading();
    const groupFilter = '';
    this.loanservice.getPrimaryLoanByDeal(this.currentDeal.id).subscribe(loan => {

      if (loan && loan.requestType) {
        loanRequestType = loan.requestType;
      }
      if (!this.isProcessPortlet) {
        this.requirementService.getRequirementList(this.currentDeal.id, loanRequestType).subscribe(requirementList => {

          const data = requirementList.partyRequirement.concat(requirementList.collateralRequirement, requirementList.dealRequirement, requirementList.loanRequirement, requirementList.requirementRequirement);
          this.requirements = data;
          if (this.requirements) {
            this.requirements.forEach(req => {
              if (req && req.type && req.name) {
                req.displayValue = req.type + ' ' + req.name;
              }
              req.savedAssignedTo = req.assignedToFullName;
              req.ddlActions = {};
            });
          }
          this.requirementsCount = requirementList.open;
          this.currentPageFilter.maxInboxSize = this.requirementsCount;
          this.currentPageFilter.numRecords = this.pageSize;
          const pageevent: any = {};
          pageevent.pageIndex = this.page;
          pageevent.pageSize = this.pageSize;
          this.fullRequirements = this.requirements;
          this.getRequirementListByPage(pageevent);
        });
      } else {
        this.requirementService.getProcessRequirementList(this.currentDeal.id, loanRequestType).subscribe(requirementList => {

          const data = requirementList.partyRequirement.concat(requirementList.collateralRequirement, requirementList.dealRequirement, requirementList.loanRequirement, requirementList.requirementRequirement);
          this.requirements = data;
          if (this.requirements) {
            this.requirements.forEach(req => {
              if (req && req.type && req.name) {
                req.displayValue = req.type + ' ' + req.name;
              }
              req.savedAssignedTo = req.assignedToFullName;
              req.ddlActions = {};
            });
          }
          this.requirementsCount = requirementList.open;
          this.currentPageFilter.maxInboxSize = this.requirementsCount;
          this.currentPageFilter.numRecords = this.pageSize;
          const pageevent: any = {};
          pageevent.pageIndex = this.page;
          pageevent.pageSize = this.pageSize;
          this.fullRequirements = this.requirements;
          this.getRequirementListByPage(pageevent);
        });
      }
    });

  }

  saveAllRequirements() {

    if (this.requirements) {
      this.requirements.forEach(req => {
        if (req.isDirty) {
          this.saveAllRequirementClick(req);
          req.isDirty = false;
        }
        req.editRequirementRow = false;
        req.showUserDrop = false;
        req.showDeferDrop = false;
        req.isDirty = false;
        req.ddlActions = {};
        req.stageDrop = null;
      });
    }


  }


  cancelAllRequirements() {

    this.store.select(state => state.selectedMenu).subscribe(result => {
      this.currentDeal = result;
      if (!this.isProcessPortlet) {
        this.requirementService.getRequirementList(this.currentDeal.id).subscribe(requirementList => {
          const data = requirementList.partyRequirement.concat(requirementList.collateralRequirement, requirementList.dealRequirement, requirementList.loanRequirement, requirementList.requirementRequirement);
          this.requirements = [];
          this.requirements = data;
          this.requirements.forEach(req => {
            req.ddlActions = {};
          });
          this.requirementsCount = requirementList.open;
          this.currentPageFilter.maxInboxSize = this.requirementsCount;
          this.currentPageFilter.numRecords = this.pageSize;
          const pageevent: any = {};
          pageevent.pageIndex = this.page;
          pageevent.pageSize = this.pageSize;
          this.fullRequirements = this.requirements;
          this.getRequirementListByPage(pageevent);
        });
      } else {
        this.requirementService.getProcessRequirementList(this.currentDeal.id).subscribe(requirementList => {
          const data = requirementList.partyRequirement.concat(requirementList.collateralRequirement, requirementList.dealRequirement, requirementList.loanRequirement, requirementList.requirementRequirement);
          this.requirements = [];
          this.requirements = data;
          this.requirements.forEach(req => {
            req.ddlActions = {};
          });
          this.requirementsCount = requirementList.open;
          this.currentPageFilter.maxInboxSize = this.requirementsCount;
          this.currentPageFilter.numRecords = this.pageSize;
          const pageevent: any = {};
          pageevent.pageIndex = this.page;
          pageevent.pageSize = this.pageSize;
          this.fullRequirements = this.requirements;
          this.getRequirementListByPage(pageevent);
        });
      }
    });
  }

  saveAllRequirementClick(req) {

    if (req.showDeferDrop == false) {
      req.deferStageName = null;
      req.deferToStage = null;
    }
    if (req.ddlActions && req.ddlActions.selectedItem && req.ddlActions.selectedItem.name == 'Assign') {
      if ((req.assignedTo && req.assignedTo != null) && req.assigneToReq == false) {
        this.allRequirementSave(req);
        req.reqDealId = this.currentDeal.id;
        req.status = req.actionStatus;
        req.assigneToReq = false;
      } else {
        req.assigneToReq = true;
        req.ddlActions = {};
      }
    } else {
      req.assigneToReq = false;
      this.allRequirementSave(req);
      // req.editRequirementRow = false;
      req.isDirty = false;
    }
  }

  allRequirementSave(req) {
    if (req) {

      req.createdBy = this.currentUserInfo.userId;
      req.lastModBy = this.currentUserInfo.userId;
      req.reqDealId = this.currentDeal.id;
      req.editRequirementRow = false;
      req.status = req.actionStatus;
      // req.showUserDrop = false;
      // req.showDeferDrop = false;
      // req.ddlActions = {};
      let notificationRequest = null;
      if (req.notifyDefinition) {
        notificationRequest = {};
        notificationRequest.notifyDefinitionId = req.notifyDefinition;
        notificationRequest.requestUserId = this.currentUserInfo.userId;
        notificationRequest.assignedUserId = req.assignedTo;
        notificationRequest.processStageFunctionType = 'F';
        notificationRequest.processId = req.processId;
        notificationRequest.stageId = req.stageId;
        notificationRequest.functionId = req.functionId;
        notificationRequest.processStageFunctionId = req.processStageFunctionId;
        notificationRequest.processStageFunctionDetail = 'test details';
        notificationRequest.notifyParameters = '@testparam_10=testvalue';
        notificationRequest.dealId = this.currentDeal.id;
        notificationRequest.requirementId = req.requirementId;
      }

      this.requirementService.post(req).subscribe(data => {


        req.editRequirementRow = false;
        req.showUserDrop = false;
        req.showDeferDrop = false;
        req.ddlActions = [];
        this.requirementService.getRequirementById(req.requirementId)
          .subscribe(
            data => {

              const filterReqList = this.requirements.filter(reqData => {
                if (reqData.requirementId == data.requirementId) {
                  return true;
                }
              });


              const index = this.requirements.indexOf(filterReqList[0]);

              req.stageDrop = null;
              req.statusDescription = data.statusDescription;


              if (!data.assignedToFullName || !data.assignedTo) {
                req.selectedUserName = null;
                req.assignedToFullName = '';
                req.assignedTo = null;
              } else {
                req.selectedUserName = data.assignedTo;
                req.assignedToFullName = data.assignedToFullName;
              }
              if (!data.deferToStage) {
                req.deferToStage = null;
              } else {
                req.deferToStage = data.deferToStage;
              }

            });
        if (this.fromReqDueScreen) {

        } else {

          req.dealId = this.currentDeal.id;
        }
        // req.showUserDrop = false;
        // req.showDeferDrop = false;
        // req.ddlActions = [];
        this.removeDirty(req);
        if (notificationRequest) {
          this.notify(notificationRequest, req);
        }
      });
    }
  }
  getBaseReqQuestions(requirement) {
    if (requirement && requirement.isTickler != true) {
      this.requirementService.getQuestionsForBaseReq(this.currentDeal.id, requirement.requirementId, requirement.reqDefinitionId).subscribe(res => {
        requirement.baseReqQuestions = res;
        return res;
      });
    }
  }
  getTicklerReqQuestions(requirement) {
    if (requirement && requirement.isTickler == true) {
      this.requirementService.getQuestionsForTicklerReq(this.currentDeal.id, requirement.requirementId, requirement.ticklerDefinitionId).subscribe(res => {
        requirement.ticklerReqQuestions = res;
        return res;
      });
    }
  }

  showDocumentAdd(requirement) {
    this.modalRef = this.confirmService.openDocumentAddModal(requirement);
  }
  editDocument(currentDocument, requirement) {
    this.modalRef = this.confirmService.openDocumentEditModal(currentDocument, requirement);
  }


  clearsearch() {
    this.serachR = '';
  }

  getRequirementListByPage(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    const skipList: Array<any> = [];
    const filteredReqList: Array<any> = [];
    const skipPage = event.pageIndex * event.pageSize;
    const fullReqList = from(this.fullRequirements);
    const skipObs = fullReqList.pipe(skip(skipPage)).subscribe(res => {
      skipList.push(res);
    });
    const ReqSkipList = from(skipList);
    const filterObs = ReqSkipList.pipe(take(event.pageSize)).subscribe(res => {
      filteredReqList.push(res);
    });
    this.requirements = filteredReqList;
  }


  downloadDocument(docId) {

    let fileDownloadModeEnabled = false;
    if (this.currentUserInfo && this.currentUserInfo.fileDownloadModeEnabled) {
      fileDownloadModeEnabled = this.currentUserInfo.fileDownloadModeEnabled;
    }

    window.open(this.baseUrl + 'api/v1/document/View/' + docId + '/' + fileDownloadModeEnabled);
  }

  onRequirementUpdate(eventdata) {

    const a = eventdata;
    const filterReqList = this.requirements.filter(reqData => {
      if (reqData.requirementId == eventdata.requirementId) {
        return true;
      }
    });


    const index = this.requirements.indexOf(filterReqList[0]);
    // this.requirements[index] = eventdata;
    this.updatederequirement = this.requirements[index];
    this.requirements[index].statusDescription = eventdata.statusDescription;

    this.requirements[index].stageDrop = null;
    this.requirements[index].daysDue = eventdata.daysDue;
    this.requirements[index].complete = eventdata.complete;
    this.requirements[index].isAttention = eventdata.isAttention;
    this.requirements[index].dueDate = eventdata.dueDate;
    this.requirements[index].documentCount = eventdata.documents.length;


    if (!eventdata.assignedToFullName || !eventdata.assignedTo) {
      this.requirements[index].selectedUserName = null;
      this.requirements[index].assignedToFullName = '';
      this.requirements[index].assignedTo = null;
    } else {
      this.requirements[index].selectedUserName = eventdata.assignedTo;
      this.requirements[index].assignedToFullName = eventdata.assignedToFullName;
    }
    if (!eventdata.deferToStage) {
      this.requirements[index].deferToStage = null;
    } else {
      this.requirements[index].deferToStage = eventdata.deferToStage;
    }
  }

  public displayFnPerson(persons, personId): string {
    if (!personId) { return ''; }
    if (persons.items) {
      if (persons.items.length > 0) {
        const index = persons.items.findIndex(user => user.id === personId);
        return persons.items[index].text;
      }
    }
  }

  filter(buttonFilter: string) {
    this.searchText = buttonFilter.toLowerCase();
    this.filterIcon = false;
  }

  clearFilter() {
    this.searchText = '';
    this.filterIcon = true;
  }

}
