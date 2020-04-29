import { Component, OnInit, Input, Output, OnChanges, EventEmitter, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { RequirementServiceProxy, DocumentServiceProxy, PartyServiceProxy, RequirementDto, ProcessStageServiceProxy, CodeServiceProxy, NotificationServiceProxy, LoanServiceProxy, CollateralServiceProxy } from '../services/service-proxy/service-proxies';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { stat } from 'fs';

@Component({
  selector: 'requirements-list',
  templateUrl: './requirements-list.component.html',
  styleUrls: ['./requirements-list.component.scss']
})
export class RequirementsListComponent implements OnInit {
  modalRef: NgbModalRef;
  reqList: boolean;
  dropDownList: string;
  userDrop: Array<any> = [];
  currentUser: any;
  @Input() requirements: Array<any> = [];
  @Input() dealId = 0;
  @Input() requirement: any; assignedUserName: string; deferName: string;
  stageHistory: Array<any> = []; showStatus: boolean = false;
  //assignForm: FormGroup;
  //deferForm: FormGroup;
  baseUrl: string; serachR: string; statusDescriptionName: string; collateralId: number;
  @Input() requirementList: Array<any>; userDropdown: Array<any> = []; isDirty: boolean = false;
  PartyFormDropdownSubscription: Subscription; showIcondefer: boolean = false;
  processHistoryId: any; currentUserInfo: any; showIconuser: boolean = false;
  partyId: number; editRequirementRow: boolean = true; loanId: number;
  currentDealData: any; filterUserDrop = new FormControl();
  searchText: string;
  @Input() isStageChangeClick: any;
  @Input() groupCode: any;
  subscription: Subscription;

  constructor(private store: Store<AppState>,
    private requirementService: RequirementServiceProxy,
    private confirmService: confirmModalPopupService,
    private documentService: DocumentServiceProxy,
    private partyService: PartyServiceProxy,
    private fb: FormBuilder,
    private eventEmitterService: EventEmitterService,
    private codeService: CodeServiceProxy,
    private processStageService: ProcessStageServiceProxy,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationServiceProxy,
    private loanService: LoanServiceProxy,
    private collateralService: CollateralServiceProxy,
    public activeModal: NgbActiveModal) {
    // activatedRoute.parent.parent.params.subscribe(params => {
    //   this.dealId = params["dealId"];
    // });

    activatedRoute.params.subscribe(params => {
      this.partyId = params['partyId'];
    });

    activatedRoute.params.subscribe(params => {
      this.loanId = params['loanId'];
    });

    activatedRoute.params.subscribe(params => {
      this.collateralId = params['collateralId'];
    });

    this.subscription = this.eventEmitterService.getReqListInModalPopUp().subscribe(data => {
      //debugger;
      this.requirements = data;
    });
  }

  ngOnInit() {
    this.store.select(state => state.deal).subscribe(result => {
      this.currentDealData = result.filter(x => x.active == true)[0];
      this.dealId = this.currentDealData.dealId;
    });
    this.store.select(state => state.currentUser).subscribe(result => {
      this.currentUserInfo = result;
    });

    this.baseUrl = environment.baseUrl;
    if (this.requirementList) {
      this.requirements = this.requirementList;
    }
    this.reqList = true;


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
    this.PartyFormDropdownSubscription = this.eventEmitterService.closeDropdownRequirementPartyForm().subscribe(data => {
      this.reqList = data;
      if (this.dealId && this.partyId) {
        this.partyService.getPartyRequirementsList(this.dealId, this.partyId).subscribe(reqs => {
          this.requirements = reqs;
        });
      }
      // this.toggleList();
    });

    this.PartyFormDropdownSubscription = this.eventEmitterService.closeDropdownRequirementListFromPartyModal().subscribe(data => {
      // if(this.reqList == true)
      this.reqList = data;
      // this.toggleList();
    });

    this.PartyFormDropdownSubscription = this.eventEmitterService.UpdateStageHistory().subscribe(data => {

      if (this.processHistoryId) {
        this.requirementService.getStageHistory(this.processHistoryId).subscribe(res => {
          this.stageHistory = res;
        });

      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {


    //    if (this.eventEmitterService.requirementDropdownClose === undefined) {
    //   this.eventEmitterService.requirementDropdownClose = this.eventEmitterService.
    //     InvokeCloseDropdownRequirementPartyForm.subscribe(map => {
    //       this.reqList = false;
    //       this.toggleList();
    //     });
    // }
    // if (this.requirements.length > 0) {
    //   this.requirements.forEach(req => {
    //     if (req.statusDescription === 'Open') {
    //       req.background = 'u-background-red';
    //     } else {
    //       if (req.statusDescription.toLowerCase().indexOf('complete') > -1 ||
    //         req.statusDescription.toLowerCase().indexOf('n/a') > -1) {
    //         req.background = 'u-background-green';
    //       } else {
    //         if (req.statusDescription.toLowerCase().indexOf('def') > -1 ||
    //           req.statusDescription.toLowerCase().indexOf('pend') > -1) {
    //           req.background = 'u-background-orange';
    //         } else {
    //           req.background = 'u-background-grey';
    //         }
    //       }
    //     }
    //   });
    // }

  }

  toggleList() {
    this.reqList = !this.reqList;
  }

  //To get requirement details.
  showRequirementDetails(req) {
    this.requirementService.getRequirementDetails(this.dealId, req.requirementId, req.reqType).subscribe(req => {
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
      this.getBaseReqQuestions(this.requirement);
      this.getTicklerReqQuestions(this.requirement);
    });
  }

  getStageHistory(processHistoryId) {
    this.processHistoryId = processHistoryId;
    if (processHistoryId) {
      this.requirementService.getStageHistory(processHistoryId).subscribe(res => {
        this.stageHistory = res;
      });
    }
  }
  stopPropagation(event) {
    event.stopPropagation();
  }

  getRequirementDocuments(requirementId, documentCount, req) {

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
  getBaseReqQuestions(requirement) {
    if (requirement && requirement.isTickler != true) {
      //  this.requirementService.getQuestionsForBaseReq(this.dealId,this.requirement.requirementId,this.requirement.reqDefinitionId).subscribe(res => {
      //    this.requirement.baseReqQuestions = res;
      //  });
    }
  }
  getTicklerReqQuestions(requirement) {
    if (requirement && requirement.isTickler == true) {
      this.requirementService.getQuestionsForTicklerReq(this.dealId, this.requirement.requirementId, this.requirement.ticklerDefinitionId).subscribe(res => {
        this.requirement.ticklerReqQuestions = res;
      });
    }
  }
  // openModal() {
  //   this.modalRef = this.confirmService.openRequirementAddModal('Requirement Add');
  //   this.modalRef.componentInstance.onSaveClick.subscribe(() => {
  //     this.modalRef.close();
  //   });
  // }

  // onCloseRequirementForm(event) {
  //   this.reqList = true;
  //   this.requirement = new RequirementDto();
  // }

  downloadDocument(id, isIIS) {
    let fileDownloadModeEnabled = false;
    this.store.select(user => user.currentUser).subscribe(result => {
      this.currentUser = result;
      if (this.currentUser && this.currentUser.fileDownloadModeEnabled) {
        fileDownloadModeEnabled = this.currentUser.fileDownloadModeEnabled;
      }
      // this.documentService.view(id, fileDownloadModeEnabled).subscribe(res => {
      // });
      window.open(this.baseUrl + '/api/v1/document/View/' + id + '/' + fileDownloadModeEnabled);
    });
  }

  onCloseRequirementForm(event) {
    this.reqList = true;
    this.requirement = new RequirementDto();
  }
  //TO add document
  showDocumentAdd(requirement) {
    this.modalRef = this.confirmService.openDocumentAddModal(requirement);
  }

  //To edit or update document
  editDocument(currentDocument, requirement) {

    this.modalRef = this.confirmService.openDocumentEditModal(currentDocument, requirement);
  }
  //TO remove document.
  removeDocument(docId, reqId, req) {
    this.modalRef = this.confirmService.openConfirmationModal('Document', 'Are you sure you want to remove this document?');
    this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
      this.modalRef.close();
    });
    this.modalRef.componentInstance.onConfirmClick.subscribe(d => {
      // Remove document requirement
      this.documentService.deleteDocumentRequirement(docId, reqId).subscribe(res => {
        this.modalRef.close();
        this.getRequirementDocuments(reqId, req.documentCount, req);
      });
    });
  }

  //TO set action dropdown.
  getActionForRequirement(req) {

    if (!req.stageDrop) {
      let needsExceptionActions = false, primaryDocumentException = false;

      if (req.exception == true || (req.requireDocument == true && req.missingDocument == true)) {
        needsExceptionActions = true;
        // if there's already an existing exception or if a document is required but missing, then this is an exception
        if (req.requireDocument == true && req.missingDocument == true) {
          primaryDocumentException = true;
        }
        // check to see if this is specifically a missing document exception
      }
      else if (req.showCompareFlag == "1" && req.sctualValue == null) {
        needsExceptionActions = null;
      }
      // this is a requirement with a question that hasn't been answered yet, so send a null
      if (req.exception != null && req.ExceptionFlag == false && primaryDocumentException == false) {
        needsExceptionActions = false;
      }
      // this requirement has an existing exception condition,
      // but it will be overriden based on the requirement definition as long as a primary document is not also required

      this.codeService.getProcessStageFunction(req.initiateProcessId, req.actionStatus || req.status, "mmcbroom", needsExceptionActions)
        .subscribe(data => {
          req.stageDrop = data;
          // data.filter(x => {
          //   return;
          // })
          // $scope.setAssignedTo($scope.actionStatus);
          // $scope.setAssignedTo(actionStatus, req);
          // Sets flags for row icons
          // $scope.setReqPortletIconFlags(data);

        });


    }
  }

  getActionStages(actions) {

    if (actions) {

      return actions.filter(action => {
        return action.type.toLowerCase() != "d" && action.type.toLowerCase() != "u";
      })
    }
  }
  getMenuStages(actions) {

    if (actions) {

      return actions.filter(action => {
        return action.type.toLowerCase() == "d" || action.type.toLowerCase() == "u";
      })
    }
  }

  //To show assigned user dropdown
  filterUser(r) {

    if (r.userDrop)
      return r.userDrop
        .filter(usr => {
          if (this.filterUserDrop.value) {
            return (usr.firstName + " " + usr.lastName).toLowerCase().includes(this.filterUserDrop.value.toLowerCase())
          }
        }
        );
  }

  setDirty(obj: any) {
    obj.isDirty = true;
  }

  //To bind assign to and deferto dropdown
  onDeferUserMenuOpen(req, action) {

    req.actionStatus = action.id;
    req.functionId = action.functionId;
    req.processStageFunctionId = action.processStageFunctionId;
    if (action.type) {
      req.actionType = action.type;
    }
    if (action && action.notifyDefinition) {
      req.notifyDefinition = action.notifyDefinition;
    } else {
      req.notifyDefinition = null;
    }

    if (action.type.toLowerCase() == "d") {
      this.getDeferToDropDown(req.requirementId, this.dealId, req);
    }
    else if (action.type.toLowerCase() == "u") {
      this.filterUserDrop.setValidators(Validators.required)
      this.filterUserDrop.markAsTouched()

      this.getUserDropDownData(req, action.functionId)
    }
    else {
      this.filterUserDrop.reset()
      this.filterUserDrop.clearValidators()
    }
  }

  //To bind defer to dropdown.
  getDeferToDropDown(requirementId, dealId, req) {
    this.processStageService.getDeferTo(requirementId, dealId)
      .subscribe(
        data => {

          req.deferDrop = data;
        });
  };

  //TO bind assign to user dropdown.
  getUserDropDownData(requirement, functionId) {
    if (functionId == undefined) {
      functionId = "ReqAssign";
    }
    this.processStageService.getProcessStageFunctionUser(requirement.processId, requirement.stageId, functionId, "mmcbroom")
      .subscribe(data => {
        this.userDropdown = data;
        requirement.items = this.userDropdown.map(data => {
          return {

            id: data.userId,
            text: data.firstName + ' ' + data.lastName
          };
        });
      });
  }

  //TO set selected action
  setAssignedTo(status, req) {

    //// status is an object returned from the UI dropdown with several properties we need to look at
    //if (isJson(status) == false || !status)
    //    return;
    if ((!(typeof status === "object") && status !== null) || !status)
      return;

    var selectedObject = status;


    //var selectedObject = req.stageDrop.filter(i => { return i.id == status.id && i.functionId == status.functionId })[0];
    // $scope.requirementSideForm.status = selectedObject.id;

    if (req) {
      req.functionId = selectedObject.functionId;
      req.processStageFunctionId = selectedObject.processStageFunctionId;

      if (status.name != 'Assign' && status.name != 'Defer' && status.name != 'Exception' && status.name != 'Request Approval') {
        req.statusDescriptionName = selectedObject.name;
        req.showStatus = true;
      }
      else {
        req.showStatus = false;
      }

      //req.showIcon = true;
      req.actionStatus = selectedObject.id;
      if (selectedObject.type) {
        req.actionType = selectedObject.type;
      }
    }

    if (selectedObject && selectedObject.notifyDefinition)
      req.notifyDefinition = selectedObject.notifyDefinition
    else
      req.notifyDefinition = null;

    //if (sObj && sObj.length && sObj[0].type && sObj[0].type.toLowerCase() == 'u') {
    //if (selectedObject && selectedObject.name.toLowerCase() == 'assign') {

    if (selectedObject && selectedObject.type.toLowerCase() == "u") {
      this.filterUserDrop.setValidators(Validators.required)
      this.filterUserDrop.markAsTouched()
      req.showUserDrop = true;
      if (req.assignedTo == null) {
        req.assigneToReq = true;
      }
      else {
        req.assignedToFullName;
      }
      this.getUserDropDownData(req, selectedObject.functionId);
    }
    else {
      this.filterUserDrop.reset()
      this.filterUserDrop.clearValidators()
      req.showUserDrop = false;
    }
    //if (sObj && sObj.length && sObj[0].type && sObj[0].type.toLowerCase() == 'd')
    //if (selectedObject && selectedObject.name.toLowerCase() == 'defer')
    if (selectedObject && selectedObject.type.toLowerCase() == 'd') {
      this.getDeferToDropDown(req.requirementId, this.dealId, req);
      req.showDeferDrop = true;
    }
    else
      req.showDeferDrop = false;

  }

  //TO set assigned user fullName.
  setAssignToUser(event, req) {

    // req.assignedToFullName = event.option.value;
    //req.showIcon = true;
    req.showIconuser = true;
    req.showStatus = true;
    req.assignedTo = event.id;
    // req.assignedToFullName = event.text;
    req.assignedUserName = event.text;
    this.serachR = event.text;
    this.serachR = '';
    //var selectedObject = req.userDrop.filter(i => { return i.userId == event.option.value })[0];
    //req.assignedToFullName = selectedObject.firstName + ' ' + selectedObject.lastName;

  }

  //To set selected defer action.
  setDifferTo(event, req) {

    if (event.value) {
      req.deferToStage = event.value;
      var selectedObject = req.deferDrop.filter(i => { return i.id == event.value })[0];
      //req.deferStageName = selectedObject.name;
      req.deferName = selectedObject.name;
      //req.showIcon = true;
      req.showIcondefer = true;
      req.showStatus = true;
    }

  }

  //TO clear selections.
  clearReqStatus(r) {

    this.requirementService.getRequirementById(r.requirementId)
      .subscribe(
        data => {

          const filterReqList = this.requirements.filter(reqData => {
            if (reqData.requirementId == data.requirementId) {
              return true;
            }
          });

          const index = this.requirements.indexOf(filterReqList[0]);
          //this.requirements[index] = data;

          r.statusPending = null;
          r.showStatus = false;
          r.showIconuser = false;
          r.showIcondefer = false;
          r.statusDescription = data.statusDescription;
          r.assignedUserName = '';
          r.deferName = '';
          r.isAttention = data.isAttention;
          if (!data.assignedToFullName || !data.assignedTo) {
            r.selectedUserName = null;
            r.assignedToFullName = ' ';
            r.assignedTo = null;
            r.assignedUserName = '';
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

  //To update single Requirment. 
  saveRequirement(req) {
    //if (req.assignedTo && req.assignedTo != null) {
    this.saveIndividualEditRow(req);
    //}

  }

  //To update single requirement row.
  saveIndividualEditRow(req) {

    if (req) {
      req.createdBy = this.currentUserInfo.userId;
      req.lastModBy = this.currentUserInfo.userId;
      req.reqDealId = this.currentDealData.dealId;
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
        notificationRequest.dealId = this.currentDealData.dealId;
        notificationRequest.requirementId = req.requirementId;
        // $scope.notificationRequest.partyId = 0;
      }
      if (req.showDeferDrop == false) {
        req.deferStageName = null;
        req.deferToStage = null;
      }
      // end new notification request code

      this.requirementService.post(req).subscribe(data => {

        req.dealId = this.currentDealData.dealId;
        this.requirementService.getRequirementById(req.requirementId)
          .subscribe(
            data => {
              req.stageDrop = null;
              req.statusDescription = data.statusDescription;
              req.showIconuser = false;
              req.showIcondefer = false;
              req.showStatus = false;
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
        if (notificationRequest) {
          this.notify(notificationRequest, req);
        }
      });
    }
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

  //TO save all Requirements.
  saveAllRequirements() {

    if (this.requirements) {
      this.requirements.forEach(req => {
        if (req.isDirty) {
          this.saveAllRequirementClick(req);
          req.isDirty = false;
        }
        req.isDirty = false;
        req.stageDrop = null;
      });
    }
  }

  saveAllRequirementClick(req) {
    if (req.showDeferDrop == false) {
      req.deferStageName = null;
      req.deferToStage = null;
    }
    if (req.statusDescriptionName == 'Assign') {
      if ((req.assignedTo && req.assignedTo != null)) {
        this.allRequirementSave(req);

      } else {
      }
    } else {
      req.assigneToReq = false;
      this.allRequirementSave(req);
      req.isDirty = false;
    }

  }

  //For save all requirement.
  allRequirementSave(req) {
    if (req) {

      req.createdBy = this.currentUserInfo.userId;
      req.lastModBy = this.currentUserInfo.userId;
      req.reqDealId = this.currentDealData.dealId;
      req.editRequirementRow = false;
      req.status = req.actionStatus;
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
        notificationRequest.dealId = this.currentDealData.dealId;;
        notificationRequest.requirementId = req.requirementId;
      }

      this.requirementService.post(req).subscribe(data => {

        this.requirementService.getRequirementById(req.requirementId)
          .subscribe(
            data => {

              req.stageDrop = null;
              req.showIconuser = false;
              req.showIcondefer = false;
              req.showStatus = false;

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
        req.dealId = this.currentDealData.dealId;
        this.removeDirty(req);
        if (notificationRequest) {
          this.notify(notificationRequest, req);
        }
      });
    }
  }
  //To remove isdirty flag.
  removeDirty(req) {
    req.isDirty = false;
  }

  //For cancel all.
  cancelAllRequirements() {

    if (this.loanId) {
      this.loanService.getRequirementsForLoan(this.dealId, this.loanId).subscribe(data => {

        this.requirements = data;
      })
    }
    if (this.partyId) {
      this.partyService.getPartyRequirementsList(this.dealId, this.partyId).subscribe(reqs => {
        this.requirements = reqs;
      });
    }
    if (this.collateralId) {
      this.collateralService.getRequirementsCollateral(this.dealId, this.collateralId).subscribe(reqs => {
        this.requirements = reqs;
      });
    }
  }

}

