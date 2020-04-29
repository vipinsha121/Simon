import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { LoanAdminComponent } from '../loanadmin/loanadmin.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { DealServiceProxy, CodeServiceProxy, WorkFlowRequestDto, WorkFlowServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Observable } from 'rxjs';


@Component({
  selector: 'toolbar-assign-deal',
  templateUrl: './assign-deal.component.html',
  styleUrls: ['./assign-deal.component.css']
})
export class AssignDealComponent implements OnInit {
  currentDealData: any;
  functionId: any;

  constructor(public confirmService: confirmModalPopupService, private dealService: DealServiceProxy, private store: Store<AppState>,
    private codeService: CodeServiceProxy, private workFlowService: WorkFlowServiceProxy) {

    store.select(state => state.deal).subscribe(result => {
      this.currentDealData = result.filter(x => x.active == true)[0];
      if (this.currentDealData) {
      }
    });

    this.store.select(state => state.currentUser).subscribe(result => {
      this.currentUserInfo = result;
      this.userId = result.userId;
    });
  }

  modalRef: NgbModalRef;
  dealDetails: any;
  isExistAssignedUserFullName: boolean;
  workFlowRequest: {};
  notificationRequest: {};
  getProcessDetails: any;
  dealDates$: Observable<any>;
  activeDeal: any;
  getProcessStageFunctionDetails: any;
  notifyDefinitionId: any;
  processStageFunctionStageId: any;
  workFlowRequestDto: WorkFlowRequestDto = new WorkFlowRequestDto();
  currentUserInfo: any;
  userId: string;
  isDealAssign: boolean;

  // Assigned user name
  @Input() isExistAssignedUserFullNameForDeal: any;


  ngOnInit() {
  }

  openAssignDeal(dealAction : string) {
    //debugger
    this.getDealAndProcessStageFunctionDetails(dealAction);    
  }

  // Get deal details. Examaple, StatusCode
  // Then, Process Stage details. Example, functionId - which decides which modal to open like WorkflowAssign or WorkflowSend. 
  getDealAndProcessStageFunctionDetails(dealAction : string) {
    this.dealService.getDealDates(parseInt(this.currentDealData.dealId)).subscribe(data => {
      this.codeService.getProcessStageFunction('DealNew', data.statusCode, this.userId).subscribe(dt => {

        // If true, Show modal pop to Assign deal to user  
        // else Show Assign Alert modal
        if (dt) {
          dt.forEach(value => {
            this.functionId = value.functionId
            if (this.functionId) {
              if (this.functionId == 'WorkflowAssign') {
                this.isDealAssign = true;
              }
            }
          });
        }
        
        if (this.isDealAssign == true) {
          this.modalRef = this.confirmService.openAssignModal('Assign');
        }
        else {
          this.modalRef = this.confirmService.openErrorModal('Alert', 'Assign option is not available for this deal stage');
          this.modalRef.componentInstance.onCloseClick.subscribe(data => {
            this.modalRef.close();
          })
        }
      })
    })
  }
}
