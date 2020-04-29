import { Component, OnInit, Input } from '@angular/core';
import { DealServiceProxy, ReportServiceProxy, ParticipantServiceProxy, WorkFlowServiceProxy, WorkFlowRequestDto, CodeServiceProxy, NotificationRequestDto, NotificationServiceProxy, ProcessStageServiceProxy, RequirementServiceProxy, LoanServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AnimationQueryMetadata } from '@angular/animations';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stage-change',
  templateUrl: './stage-change.component.html',
  styleUrls: ['./stage-change.component.css']
})
export class StageChangeComponent implements OnInit {

  @Input() dealId: any;
  @Input() statusCode: any;
  sendStageDropDownData: Array<any> = [];
  sendDataLength: any;
  stageName: any;
  stageDetails: any;
  workFlowRequest: {};
  notificationRequest: {};
  workFlowRequestDto: WorkFlowRequestDto = new WorkFlowRequestDto();
  notificationRequestDto: NotificationRequestDto = new NotificationRequestDto();
  sendStageObj: Array<any> = [];
  currentDealData: any;
  dealDetails: any;
  getProcessDetails: any;
  processDetails: any;
  requiredFieldsForLoan: any;
  modalRef: NgbModalRef;
  reqFields: Array<any>;
  stageID: any;
  currentDealId: any;
  processStageGroupCode: Array<any>;
  requirementDue: any;
  requirements: Array<any>;
  groupCode: string;
  loanRequestType: string;
  user: string;
  isNextStageAfter: boolean;
  userId: string;
  currentUserInfo: any;
  isChecked: boolean;
  eventEmitterService: any;
  subjectReqList: Subscription;

  constructor(
    private processStageService: ProcessStageServiceProxy,
    private dealService: DealServiceProxy,
    private workFlowService: WorkFlowServiceProxy,
    private requirementService: RequirementServiceProxy,
    private confirmService: confirmModalPopupService,
    private loanService: LoanServiceProxy,
    private notificationService: NotificationServiceProxy,
    private store: Store<AppState>,
    public activeModal: NgbActiveModal
  ) {
    this.store.select(state => state.currentUser).subscribe(result => {
      debugger
      this.currentUserInfo = result;
      this.userId = result.userId;
    });
  }

  ngOnInit() {
    this.isChecked = false;
    this.getSendToStageDetails();
  }

  getSendToStageDetails() {
    this.processStageService.getSendToStages('DealNew', this.statusCode, this.userId, 'WorkflowSend').subscribe(data => {
      this.sendStageDropDownData = data;
      this.processStageGroupCode = data.processStageGroupCode;
    })
  }

  selectedStage(stageId: any) {
    this.isChecked = true;
    var isExist = false; let i;

    this.stageID = stageId;
    this.sendStageDropDownData.filter(sId => {
      for (i = 0; i <= this.sendStageDropDownData.length; i++) {
        if (i >= this.sendStageDropDownData.length) { }
        else if (stageId == this.sendStageDropDownData[i].stageId) {
          isExist = true;

          if (isExist) {
            this.sendStageObj = this.sendStageDropDownData[i];
            this.processDetails = this.sendStageObj;
          }

          this.store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
            this.currentDealId = this.currentDealData.dealId;

            // Set user name, rootScope.currentUser.userName;
            this.user = '-1';
            if (this.currentUserInfo)
              this.user = this.currentUserInfo.userName;
          })
        }
      }
    })
  }


  sendStage() {
    //this.activeModal.close();
    this.dealService.getAssignedUserNameForDeal(parseInt(this.currentDealData.dealId)).subscribe(data => {
      if (data) {
        this.workFlowRequestDto.debug = false;
        this.workFlowRequestDto.processHistoryId = data.processHistoryId;
        this.workFlowRequestDto.parentProcessHistoryId = null;
        this.workFlowRequestDto.submittedToCf = null;
        this.workFlowRequestDto.passedParameters = '@dealid_05=' + this.currentDealData.dealId + '|';
        this.workFlowRequestDto.processStageFunctionType = 'S';
        this.workFlowRequestDto.processStageFunctionId = null;
        this.workFlowRequestDto.processId = data.processId;
        this.workFlowRequestDto.stageId = data.statusCode;
        this.workFlowRequestDto.containerId = 'Inbox';
        this.workFlowRequestDto.containerObjectId = 'InboxSend';
        this.workFlowRequestDto.functionId = 'WorkflowSend';
        this.workFlowRequestDto.resultStageId = this.stageID;

        // // LOGGED IN USER Eg : Matt (Make it dynamic)

        // commented line - causing compilation error
        // // this.workFlowRequestDto.requestUserId = this.currentuser.username;
        this.workFlowRequestDto.requestUserId = this.userId;

        this.workFlowRequestDto.assignedUserId = null;
        this.workFlowRequestDto.lockUserId = null;
        this.workFlowRequestDto.reqActualValue = null;
        this.workFlowRequestDto.reqDueDate = null;
        this.workFlowRequestDto.documentId = null;
        this.workFlowRequestDto.currentDate = null;
        this.workFlowRequestDto.dueDate = null;
        this.workFlowRequestDto.stageDueDate = null;
        this.workFlowRequestDto.pendDate = null;

        if (this.processDetails.notifyDefinitionId) {
          this.notificationRequestDto.notifyDefinitionId = data.notifyDefinitionId;;
          this.notificationRequestDto.requestUserId = this.userId;
          this.notificationRequestDto.assignedUserId = '';
          this.notificationRequestDto.processStageFunctionType = 'S';
          this.notificationRequestDto.processStageFunctionId = data.processStageFunctionStageId;
          this.notificationRequestDto.notifyParameters = '@sendstageid_10=' + this.stageID + '|';;
          this.notificationRequestDto.dealId = parseInt(this.currentDealData.dealId);
        }

        // Get stage details specifically checkOpenRequirements
        this.processStageService.getStageDetail(data.processId, this.stageID).subscribe(res => {
          //res[0].checkOpenRequirements = false; // Test
          if (res[0] && res[0].checkOpenRequirements) {
            this.processStageService.isNextStageAfterCurrentStage(data.processId, data.statusCode, this.processDetails.stageId).subscribe(data => {
              this.isNextStageAfter = data;
              if (this.isNextStageAfter) {
                // get primary loan by deal
                this.loanService.getPrimaryLoanByDeal(this.currentDealData.dealId).subscribe(dt => {
                  if (dt && dt.requestType) {
                    this.loanRequestType = dt.requestType;
                  }

                  // Get required loan fields
                  this.workFlowService.getRequiredFieldsForLoan(this.workFlowRequestDto).subscribe(dt => {
                    this.reqFields = dt;

                    // If required loan fields are there display required field modal
                    if (dt != null && dt.length > 0) {
                      this.modalRef = this.confirmService.openRequiredFieldModal(this.reqFields);
                    }

                    // Requirements Due modal
                    else {
                      //Get Requirement Due By DealStage
                      this.requirementService.getRequirementDueByDealStage(this.currentDealId, this.processDetails.processStageGroupCode, this.loanRequestType).subscribe(res => {
                        this.requirementDue = res;

                        // If true then display Requirements Due modal
                        if (this.requirementDue.length > 0 && this.reqFields != null) {
                          this.requirements = res;
                          this.modalRef = this.confirmService.openRequirementDueModalInPopUp(this.requirements , true, this.processStageGroupCode);
                        }
                        else {
                          //debugger;
                          this.workFlowService.updateWorkFlow(this.workFlowRequestDto).subscribe(dt => {
                            this.dealService.send(this.currentDealData.dealId, this.userId, this.stageID).subscribe(res => {
                              if (this.notificationRequestDto != null) {
                                this.notificationService.updateNotification(this.notificationRequestDto).subscribe(res => {
                                  this.activeModal.close();
                                })
                              }
                            })
                          })
                        }

                      })
                    }
                  })
                })

                // // Get required loan fields
                // this.workFlowService.getRequiredFieldsForLoan(this.workFlowRequestDto).subscribe(dt => {
                //  this.reqFields = dt;

                //   // If required loan fields are there display required field modal
                //   if (dt != null && dt.length > 0) {
                //     this.modalRef = this.confirmService.openRequiredFieldModal(this.reqFields);
                //   }

                //   // Requirements Due modal
                //   else {
                //     //Get Requirement Due By DealStage
                //     this.requirementService.getRequirementDueByDealStage(this.currentDealId, this.processDetails.processStageGroupCode, this.loanRequestType).subscribe(res => {
                //       this.requirementDue = res;

                //       // If true then display Requirements Due modal
                //       if (this.requirementDue.length > 0 && this.reqFields != null) {
                //         this.requirements = res;
                //         this.modalRef = this.confirmService.openRequirementDueModal(this.requirements);
                //       }
                //       else {
                //         debugger;
                //         this.workFlowService.updateWorkFlow(this.workFlowRequestDto).subscribe(dt => {
                //           this.dealService.send(this.currentDealData.dealId, this.userId, this.stageID).subscribe(res => {
                //             if (this.notificationRequestDto != null) {
                //               this.notificationService.updateNotification(this.notificationRequestDto).subscribe(res => {
                //                 this.activeModal.close();
                //               })
                //             }
                //           })
                //         })
                //       }

                //     })
                //   }
                // })
              }
              else {
                //debugger;
                this.workFlowService.updateWorkFlow(this.workFlowRequestDto).subscribe(dt => {
                  this.dealService.send(this.currentDealData.dealId, this.userId, this.stageID).subscribe(res => {
                    if (this.notificationRequestDto != null) {
                      this.notificationService.updateNotification(this.notificationRequestDto).subscribe(res => {
                        this.activeModal.close();
                      })
                    }
                  })
                })
              }
            })
          }
          else {
            this.workFlowService.updateWorkFlow(this.workFlowRequestDto).subscribe(dt => {
              this.dealService.send(this.currentDealData.dealId, this.userId, this.stageID).subscribe(res => {
                if (this.notificationRequestDto != null) {
                  this.notificationService.updateNotification(this.notificationRequestDto).subscribe(res => {
                    this.activeModal.close();
                  })
                }
              })
            })
          }
        })
        /////////////////////
      }
    })
  }


  //   //   //TODO:
  //   //   // applicationService.isNextStageAfterCurrentStage
  //   //   // present in processtagecontroller IsNextStageAfterCurrentStage

  //   //   //TODO :
  //   //   //loanService.getPrimaryLoanByDeal
  //   //   // present in loan controller getprimaeryloanbydeal

  //   //   //TODO :
  //   //   // workflowService.getRequiredFieldsForLoan
  //   //   // need to add in workflowcontroller, service and sp too
  //   //   // create modal, call from service, create html etc...

  //   //   //TODO :
  //   //   // requirementService.getRequirementDueByDealStage
  //   //   // present in requirement controller
  //   //   // create modal, html

  //   //   // done till 824
  //   // })
  // }
}
