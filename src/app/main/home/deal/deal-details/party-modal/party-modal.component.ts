import { Component,
         OnInit,
         Input,
         Output,
         OnChanges,
         EventEmitter,
         ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { DealDto,
  DealServiceProxy, PartyServiceProxy, PartyDto, CodeServiceProxy, RequirementServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { SelectedMenuModel } from 'src/app/shared/models/menu.model';
import { MediaMatcher } from '@angular/cdk/layout';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DealHeaderService } from '../../deal-header/deal-header.service';
import { Subscription } from 'rxjs';
import { EventEmitterService } from './party-form/party-form-service/event-emitter.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { MatSnackBar } from '@angular/material';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrimaryDiaglog } from './party-form/party-form.component';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';



@Component({
    selector: 'party-modal',
    templateUrl: './party-modal.component.html',
    styleUrls: ['./party-modal.component.scss']
})
export class PartyModalComponent implements OnInit, AfterViewInit, OnChanges  {
    colors: Array<string> = ['#00e676', '#f44336'];
    styleElement: HTMLStyleElement;
    diffRequirements;
    totalRequirements;
    requirements: Array<any> = [];
    openRequirements = 0;
    completeRequirements;
    subscription: Subscription;
    PartyFullsubscription: Subscription;
    UpdatePartyListsubscription: Subscription;
    openFullRequests: any[] = [];
    partyFull: boolean = true;
    halfWidth;
    mobileQuery;
    mobileQueryLG;
    @Input() currentDeal: any;
    DealID: any;
    // @Input() partySave: any[];
    parties: Array<any> = [];
    partyData: PartyDto = new PartyDto();
    partyCount: number;
    _mobileQueryListener: () => void;
    partyId: number = 0;
    dealId: number = 0;
    modalRef: NgbModalRef;
    dealMenu: any;
    deal: any;
    PrimaryParty: any;
    partyRequirementOpen: any;


    constructor(private partyService: PartyServiceProxy,
                private media: MediaMatcher, private cd: ChangeDetectorRef,
                private changeDetectorRef: ChangeDetectorRef,
                private activatedRoute: ActivatedRoute,
                private dealHeaderservice: DealHeaderService,
                private router: Router,
                private eventEmitterService: EventEmitterService,
                public confirmService: confirmModalPopupService,
                private codeService: CodeServiceProxy,
                private snackBar: MatSnackBar,
                public dialog: MatDialog,
                private localStorageService: LocalstorageService,
                private store: Store<AppState>,
                private requirementService: RequirementServiceProxy) {
        // Observes parameter of url
        // Get dealId from URL
        this.activatedRoute.parent.params.subscribe(params => {
            this.dealId = params["dealId"];
            this.DealID = params["dealId"];
            this.partyService.getPartyListForDeal(this.dealId, "internal").subscribe(res => {
                this.parties = res;
                this.partyCount = res.length;
                if (this.partyCount > 0) {
                  this.parties.forEach(party => {
                    this.partyService.getPartyRequirementsList(this.dealId, party.partyId).subscribe(reqs => {
                      this.requirements = reqs;
                      this.totalRequirements = reqs.length;
                      this.completeRequirements = this.requirements.filter(req => {
                        return req.complete === true;
                      }).length;
                      this.diffRequirements = (this.completeRequirements / this.totalRequirements) * 100 ;
                      party.requirements = this.diffRequirements;
                      if (this.diffRequirements >= 90) {
                        party.cssClass = 'progress-green mat-line mat-progress-bar mat-primary';
                      } else if (this.diffRequirements < 90 && this.diffRequirements >= 25) {
                        party.cssClass = 'progress-orange mat-line mat-progress-bar mat-primary';
                      } else {
                        party.cssClass = 'progress-red mat-line mat-progress-bar mat-primary';
                      }
                    });
                  });
                }

            });
        });

        // Observes parameter of child url
        // Get partyId from URL
        if (activatedRoute.firstChild) {
            activatedRoute.firstChild.params.subscribe(params => {
                this.partyId = params["partyId"];
            });
        }

        this.mobileQueryLG = media.matchMedia('(min-width: 1700px)');
        this.mobileQuery = media.matchMedia('(max-width: 770px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.mobileQueryLG.addListener(this._mobileQueryListener);

        /* commented for the future use */
        // this.subscription = this.dealHeaderservice.getFullParty().subscribe(openFullRequest => {
        //     if (openFullRequest) {
        //         this.openFullRequests.push(openFullRequest);
        //         this.partyFull = true;
        //     } else {
        //         this.openFullRequests = [];
        //     }
        // });
    }

    ngOnChanges() {
    }

      changeCount(event) {
      }
      partySave(party: any) {
          this.activatedRoute.parent.params.subscribe(params => {
                this.dealId = params["dealId"];
                this.partyService.getPartyListForDeal(this.dealId, "internal").subscribe(res => {
                this.parties = res;
                this.partyCount = res.length;
            });
        });
      }

    onPartyDetailsActivate(componentReference) {
        // componentReference.anyFunction();
        // Below will subscribe to the searchItem emitter
        componentReference.partySave.subscribe((data) => {
            // Will receive the data from child here
        });
         componentReference.anyFunctionParties(this.dealId);
    }

    sendHalf(): void {
        this.dealHeaderservice.sendFullParty('false');
        this.partyFull = false;
    }

    getParties() {
        return this.parties.sort((a, b) => {
            if (a.primary) {
                return -1;
            }
            if (b.primary) {
                return 1;
            }
            return 0;
        });
        // .sort((a, b) => a.type - b.type);
    }
    ngOnInit() {
          this.UpdatePartyListsubscription = this.eventEmitterService.UpdatePartyList().subscribe(data => {

            this.activatedRoute.parent.params.subscribe(params => {
              this.dealId = params["dealId"];
              this.partyService.getPartyListForDeal(this.dealId, "internal").subscribe(res => {
                  this.parties = res;

                  this.partyCount = res.length;

                  var Primary = this.parties.filter((borrower) =>{
                    return borrower.primary == true;
                })[0];
                  this.store.select(dealstate => dealstate.selectedMenu).subscribe(result => {
                    this.dealMenu = result;
                });
                this.dealMenu.name = Primary.name;
                this.localStorageService.setCurrentMenu(this.dealMenu);

                this.store.select(dealstate => dealstate.deal).subscribe(result => {
                  this.deal = result[0];
              });
                  this.deal.dealName = Primary.name;
                  this.localStorageService.addDealToStore(this.deal);
                  this.eventEmitterService.updateDeals();
              });

          });
          this.partyFull = data;
          });

        // Set view depending on the partyID
      if (this.partyId > 0) {
            this.partyFull = false;
        }
        // if (this.eventEmitterService.partyedit==undefined) {
        //     this.eventEmitterService.partyedit = this.eventEmitterService.
        //     invokePartyEditFunction.subscribe(map => {
        //         this.partyFull = false;
        //     });
        //   }

        this.PartyFullsubscription = this.eventEmitterService.changePartyFull().subscribe(data => {
          this.partyFull = data;
        });
        this.requirementService.getRequirementList(this.dealId).subscribe(data => {
          this.partyRequirementOpen = data.partyRequirementOpen;
        })
    }

    ngAfterViewInit() {
    }

    formToggle() {
        this.partyFull = !this.partyFull;
    }

    routeToPartyComponent(p) {
        this.partyId = p.partyId;
        this.router.navigateByUrl("/main/deal/" + this.dealId + "/party/" + this.partyId);
        this.partyFull = false;
        this.eventEmitterService.closeDropdownRequirementListFromPartyModal();
        // this.partyId/main/deal/{{dealId}}/party/{{party.partyId}}/
    }

    addPartyModal(event) {

      this.modalRef = this.confirmService.openAddPartyModal('New Party', this.DealID);

    }

    OnDestroy(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);
      this.subscription.unsubscribe();
  }

  deleteParty(party: any) {
    // if (party.primary === true) {
    //   this.dialog.open(PrimaryDiaglog);
    // } else {
      this.modalRef = this.confirmService.openConfirmationModal('Remove Party From Deal', 'Are you sure you want to remove this party?');
      this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {

        this.modalRef.close();
      });
      this.modalRef.componentInstance.onConfirmClick.subscribe(d => {
      // Delete party code
        this.partyService.delete(party.dealPartyId).subscribe(res => {
          this.partyService.getPartyListForDeal(this.dealId, "internal").subscribe(res => {
            this.parties = res;
            this.partyCount = res.length;
        });
        this.partyFull = true;
        this.modalRef.close();

        // this.router.navigateByUrl('/main/deal/' + this.dealId + '/party');
        });

      });
    // }
}
}
