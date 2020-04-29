import { Component, OnInit, Input } from '@angular/core';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { Store } from '@ngrx/store';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppState } from 'src/app/shared/models/app.state';
import {
  DealServiceProxy
  , ParticipantServiceProxy
  , WorkFlowServiceProxy
  , WorkFlowRequestDto
  , CodeServiceProxy
  , NotificationRequestDto
  , NotificationServiceProxy
} from 'src/app/shared/services/service-proxy/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'deal-stages',
  templateUrl: './deal-stages.component.html',
  styleUrls: ['./deal-stages.component.css']
})
export class DealStagesComponent implements OnInit {
  scrollHide;
  mobileQuery: MediaQueryList;
  mobileQueryMid: MediaQueryList;
  _mobileQueryListener: () => void;
  stageLoss = false;
  modalRef: NgbModalRef;
  currentDealData: Deal;
  stageCount: 0;
  showDealSend: false;
  dealDetails: any;
  dealId;
  dealData: any;
  stageId;
  processStageFunctionDetails: any;
  statusCode: string;
  isException: boolean;
  @Input() currentDeal: any;
  stages = [
    {
      label: 'Pre-Application',
      stageClass: 'stagePreApplication',
      code: 'DealQualify',
      active: false
    },
    {
      label: 'Underwriting',
      stageClass: 'stageUnderwriting',
      code: 'DealUnderwriting',
      active: false
    },
    {
      label: 'Approval',
      stageClass: 'stageApproval',
      code: 'DealApproval',
      active: false
    },
    {
      label: 'Approved',
      stageClass: 'stageApproved',
      code: 'DealDocumentation',
      active: false
    },
    {
      label: 'Processing',
      stageClass: 'stageProcessing',
      code: 'DealProcessing',
      active: false
    },
    {
      label: 'Servicing',
      stageClass: 'stageBooking',
      code: 'DealBooking',
      active: false
    },
    {
      label: 'Booked',
      stageClass: 'stageBooked',
      code: 'DealBooked',
      active: false
    }
  ];
  stageL = [
    {
      label: 'LA Review',
      stageClass: '',
      code: 'LA',
      active: false
    },
    {
      label: 'CP Review',
      stageClass: '',
      code: 'CP',
      active: false
    },
    {
      label: 'Final',
      stageClass: '',
      code: 'Final',
      active: false
    }
  ];
  userId: string;
  currentUserInfo: any;
  functionId: string;
  isDealSend: boolean;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public confirmService: confirmModalPopupService,
    private store: Store<AppState>,
    private dealService: DealServiceProxy,
    private codeService: CodeServiceProxy) {
    this.store.select(state => state.deal).subscribe(result => {
      this.currentDealData = result.filter(x => x.active === true)[0];
      this.dealId = parseInt(this.currentDealData.dealId);
    });

    this.store.select(state => state.currentUser).subscribe(result => {
      this.currentUserInfo = result;
      this.userId = result.userId;
    });


    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this.mobileQueryMid = media.matchMedia('(max-width: 1200px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.mobileQueryMid.addListener(this._mobileQueryListener);

  }
  ngOnInit() {
    this.dealDetails = this.dealService.getDealById(this.dealId).subscribe(res => {
      this.dealDetails = res;
      this.stageId = this.dealDetails.stageId;
      this.stages.forEach(stage => {
        if (stage.code === this.stageId) {
          stage.active = true;
        } else {
          stage.active = false;
        }
      });
    });

  }

  OnChanges() {
  }

  doDealAction(dealAction: string) {
    /// Get Deal details
    /// Example, statusCode etc
    /// this.getDealDetails(parseInt(this.currentDealData.dealId));

    this.getDealAndProcessStageFunctionDetails();   

  }

  getDealAndProcessStageFunctionDetails() {
    this.dealService.getDealDates(parseInt(this.currentDealData.dealId)).subscribe(data => {
      this.statusCode = data.statusCode;
      this.codeService.getProcessStageFunction('DealNew', data.statusCode, this.userId).subscribe(dt => {

        if (dt) {
          dt.forEach(value => {
            this.functionId = value.functionId
            if (this.functionId) {
              if (this.functionId == 'WorkflowSend') {
                this.isDealSend = true;
              }

              // if (this.isDealSend == true) {
              //   this.modalRef = this.confirmService.openSendStageModal(parseInt(this.currentDealData.dealId), this.statusCode);
              // }
              // else {
              //   this.modalRef = this.confirmService.openErrorModal('Alert', 'Send option is not available for this deal stage');
              //   this.modalRef.componentInstance.onCloseClick.subscribe(data => {
              //     this.modalRef.close();
              //   })
              // }
            }
          })
        }

        if (this.isDealSend == true) {
          this.modalRef = this.confirmService.openSendStageModal(parseInt(this.currentDealData.dealId), this.statusCode);
        }
        else {
          this.modalRef = this.confirmService.openErrorModal('Alert', 'Send option is not available for this deal stage');
          this.modalRef.componentInstance.onCloseClick.subscribe(data => {
            this.modalRef.close();
          })
        }
      })
    })
  }

  // getDealDetails(dealId: number) {
  //   this.dealDetails = this.dealService.getDealById(dealId).subscribe(res => {
  //     this.dealDetails = res;
  //     this.statusCode = this.dealDetails.statusCode;

  //     this.modalRef = this.confirmService.openSendStageModal(parseInt(this.currentDealData.dealId), this.statusCode);
  //   });
  // }
}
