import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { DealDto, DealServiceProxy, CollateralServiceProxy, CodeServiceProxy, RequirementServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { MediaMatcher } from '@angular/cdk/layout';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DealHeaderService } from '../../deal-header/deal-header.service';
import { Subscription } from 'rxjs';
import { EventEmitterService } from '../party-modal/party-form/party-form-service/event-emitter.service';
import { MatDialog } from '@angular/material';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';

@Component({
  selector: 'collateral-modal',
  templateUrl: './collateral-modal.component.html',
  styleUrls: ['./collateral-modal.component.scss']
})
export class CollateralModalComponent implements OnInit {

  @Input() currentDeal: any;
  fullWidth: boolean = true;
  subscription: Subscription;
  mobileQuery;
  _mobileQueryListener: () => void;
  loanData: any;
  loancount: number;
  dealcount: number;
  dealId = 0;
  openFullRequests: any[] = [];
  reqType: Array<any> = [];
  newreqid: any;
  collateralId = 0;
  collateral: Array<any> = [];
  collateralCount: number;
  collateraldocs: number = 1;
  collGoogleMap: number = 1;
  collateralData: any;
  requirements: Array<any> = [];
  diffRequirements;
  totalRequirements;
  completeRequirements;
  collId: string
  collData: any;
  collateraCount: any;
  collRequirementOpenCnt = 0;
  primaryCollateral: boolean;
  modalRef: NgbModalRef;
  collateralRequirements: any;
  completeRequirement: any;
  openRequirements: number;

  constructor(private collateralService: CollateralServiceProxy,
    private media: MediaMatcher,
    private changeDetectorREf: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private dealHeaderservice: DealHeaderService,
    private router: Router,
    private requirementService: RequirementServiceProxy,
    private eventEmitterService: EventEmitterService,
    public dialog: MatDialog,
    private codeService: CodeServiceProxy,
    public confirmService: confirmModalPopupService) {
    activatedRoute.parent.params.subscribe(params => {
      this.dealId = params["dealId"];
      this.collateralService.getCollateralForDeal(this.dealId).subscribe(res => {
        this.collateral = res;
        this.collateralCount = this.collateral.length;
        if (this.collateralCount > 0) {
          this.collateral.forEach(coll => {
            this.collateralService.getRequirementsCollateral(this.dealId, coll.collateralId).subscribe(reqs => {
              this.requirements = reqs;
              this.totalRequirements = reqs.length;
              this.completeRequirements = this.requirements.filter(req => {
                return req.complete === true;
              }).length;
              this.diffRequirements = (this.completeRequirements / this.totalRequirements) * 100;
              coll.requirements = this.diffRequirements;
              coll.openRequirements = reqs.length - this.completeRequirements;

              if (this.diffRequirements >= 90) {
                coll.cssClass = 'progress-green mat-line mat-progress-bar mat-primary';
              } else if (this.diffRequirements < 90 && this.diffRequirements >= 25) {
                coll.cssClass = 'progress-orange mat-line mat-progress-bar mat-primary';
              } else {
                coll.cssClass = 'progress-red mat-line mat-progress-bar mat-primary';
              }
            });
          });
        }
      });
    });

    this.subscription = this.eventEmitterService.getCollateralList().subscribe(data => {
      //debugger;
      if (data) {
        this.collateral = null;
        this.collateral = data;
        this.collateraCount = this.collateral.length;
        this.fullWidth = true;        
      }
    });

    if (activatedRoute.firstChild) {
      activatedRoute.firstChild.params.subscribe(params => {
        this.collateralId = params["collateralId"];
      });
    }

  }

  ngOnInit() {
    if (this.eventEmitterService.subsVar === undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        invokeFirstComponentFunction.subscribe((name: string) => {
          this.activatedRoute.parent.params.subscribe(params => {
            this.dealId = params["dealId"];
            this.collateralService.getCollateralForDeal(this.dealId).subscribe(res => {
              this.collateral = res;
              this.collateralCount = this.collateral.length;
            });
          });
        });
    }

    this.refreshCollateralDetails();
    if (this.collateralId > 0) {
      this.fullWidth = false;
    }
    this.requirementService.getRequirementList(this.dealId).subscribe(data => {
      this.collRequirementOpenCnt = data.collateralRequirementOpen;
    })
  }

  sendHalf(): void {
    this.dealHeaderservice.sendFullParty('false');
    this.fullWidth = false;
  }

  routeToCollateralComponent(col) {
    //debugger;
    //console.log(col)
    this.collateralId = col.collateralId;
    this.router.navigateByUrl('/main/deal/' + this.dealId + '/collateral/' + this.collateralId);
    this.fullWidth = false;
  }

  onAddNewCollateral(cId) {
    //debugger;
    this.collId = cId;
    this.fullWidth = false;
    this.collateralId = 0;
    this.router.navigateByUrl('/main/deal/' + this.dealId + '/collateral/' + this.collateralId);
    this.eventEmitterService.setAddNewCollateral(this.collId);
  }

  /// <summary>
  /// Refresh nav bar
  /// Example, when we assign deal to specific user then nav bar should get auto refresh to display the updated user name
  /// <summary>
  refreshCollateralDetails() {
    //debugger
    if (this.eventEmitterService.refreshCollateral == undefined) {
      this.eventEmitterService.refreshCollateral = this.eventEmitterService.
        invokeCollateralDetails.subscribe((name: string) => {
          //debugger;
          this.collateralService.getCollateralForDeal(this.dealId).subscribe(res => {
            this.collateral = res;
          });
        });
    }

  }

  onActivate(componentReference) {
    componentReference.anyFunction(componentReference.collateralId);
  }

  public refreshCollateralList() {
    this.collateralService.getCollateralForDeal(this.dealId).subscribe(data => {
      //debugger;
      if (data) {
        this.collateral = null;
        this.collateral = data;
        this.collateraCount = this.collateral.length;
        this.fullWidth = true;
      }
    });
  }
  // public deleteCollateral(collateral) {
  //   console.log('delete')
  // }

  // Delete collateral
  // Show message as cant remove if collateral is primary else remove
  deleteCollateral(collateralDetails: any) {
    this.primaryCollateral = collateralDetails.primary;

    if (this.primaryCollateral) {
      this.modalRef = this.confirmService.openErrorModal("Primary Collateral", "You can not remove Primary Collateral");
      this.modalRef.componentInstance.onCloseClick.subscribe(data => {
        this.modalRef.close();
        //this.eventEmitterService.onSetCloseRefreshCollateralListAddCancel(parseInt(this.currentDealData.dealId));
        this.eventEmitterService.setCollateralList(this.dealId);
      })
    }
    else {
      this.modalRef = this.confirmService.openConfirmationModal('Delete Collateral ', 'Are you sure you want to remove this collateral from the Deal?');
      this.modalRef.componentInstance.onConfirmClick.subscribe(r => {
        this.collateralService.delete(this.collateralId).subscribe(re => {
          this.modalRef.close();
          //this.eventEmitterService.onSetCloseRefreshCollateralListAddCancel(parseInt(this.currentDealData.dealId));
          this.eventEmitterService.setCollateralList(this.dealId);
        })
      })
      this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
        this.modalRef.close();
      })
    }
  }

  public routeToCollateralList() {
    this.router.navigateByUrl('/main/deal/' + this.dealId + '/collateral');
    this.fullWidth = true;
  }

}
