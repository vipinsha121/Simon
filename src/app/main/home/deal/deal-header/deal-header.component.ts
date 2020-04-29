import { Component, OnInit, OnChanges, Input, Output, EventEmitter, HostListener, SimpleChanges } from '@angular/core';
import { DealDto, DealServiceProxy, CodeServiceProxy, ReportServiceProxy, ParticipantServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppConsts } from 'src/app/shared/app-constants';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SelectedMenuModel } from 'src/app/shared/models/menu.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DealHeaderService } from './deal-header.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';

@Component({
    selector: 'deal-header',
    templateUrl: './deal-header.component.html',
    styleUrls: ['./deal-header.component.scss']
})
export class DealHeaderComponent implements OnInit, OnChanges {
    _mobileQueryListener: () => void;
    activeToggle: any[] = [];
    activeTab: boolean;
    public href: string;
    url: string;
    cText;
    subscription: Subscription;
    openFullRequests: any[] = [];
    partyFull: boolean;
    mobileQuery: MediaQueryList;
    mobileQueryMid: MediaQueryList;
    mobileQueryLg: MediaQueryList;
    windowQueryMid: MediaQueryList;
    currentDealData: Deal;
    modalList: Array<any> = [];
    modalRef: NgbModalRef;
    reportLoanData: Array<any> = [];
    dealId: number = 0;
    dealDates: any;
    dealDates$: Observable<Deal[]>;
    activeDeal: Deal;
    dealDetails: any;
    dealOfficers: Array<any> = []
    dealHasPrimaryOfficer: boolean = false
    @Input() isExistAssignedUserFullName: any;
    @Input() dealPrimaryOfficer: any
    assignedUserFullName: any;
    Dealsubscription: Subscription;
    subscriptionNavBarDates: Subscription;

    lastName: string;
    splittedUserName: Array<string> = [];
    lastNameIntial: string;
    amt: Int32Array;


    @Input() currentMenu: SelectedMenuModel;
    @Output() partyEventClicked = new EventEmitter<any>();
    @Output() collateralEventClicked = new EventEmitter<any>();
    @Output() loanEventClicked = new EventEmitter<any>();
    @Output() summaryEventClicked = new EventEmitter<any>();
    @Output() requirementEventClicked = new EventEmitter<any>();
    @Output() documentEventClicked = new EventEmitter<any>();
    @Output() datesEventClicked = new EventEmitter<any>();
    @Output() eventsClicked = new EventEmitter<any>();
    @Output() processeseventClicked = new EventEmitter<any>();

    constructor(private dealService: DealServiceProxy,
        private store: Store<AppState>,
        private codeService: CodeServiceProxy,
        public confirmService: confirmModalPopupService,
        private reportService: ReportServiceProxy,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
        private activedRoute: ActivatedRoute,
        private dealHeaderservice: DealHeaderService,
        private eventEmitterService: EventEmitterService,
        private router: Router,
        private partcipantsService: ParticipantServiceProxy
    ) {

        this.mobileQuery = media.matchMedia('(max-width: 769px)');
        this.mobileQueryMid = media.matchMedia('(max-width: 1899px)');
        this.mobileQueryLg = media.matchMedia('(min-width: 1900px)');
        this.windowQueryMid = media.matchMedia('(max-width: 1145px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.mobileQueryMid.addListener(this._mobileQueryListener);
        this.mobileQueryLg.addListener(this._mobileQueryListener);
        this.windowQueryMid.addListener(this._mobileQueryListener);
        store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
            if (this.currentDealData) {
            }
        });
        this.codeService.getModalsForDeal('DealComponent').subscribe(result => {
            this.modalList = result;
        });
        this.dealDates$ = this.store.select(state => state.deal);

        activedRoute.params.subscribe(params => {
            this.dealId = params["dealId"];
        });

        this.subscription = this.dealHeaderservice.getFullParty().subscribe(openFullRequest => {
            if (openFullRequest) {
                this.openFullRequests.push(openFullRequest);
                this.partyFull = true;
            } else {
                this.openFullRequests = [];
            }
        });

        this.subscriptionNavBarDates = this.eventEmitterService.getGetNavbarDates().subscribe(data => {
            //debugger;
            if (data) {
                this.getDealSpecificDates();
            }
        });
    }

    ngOnInit() {
        //debugger;
        // this.Dealsubscription = this.eventEmitterService.UpdateDealName().subscribe(data => {

        //     this.store.select(state => state.deal).subscribe(result => {

        //         this.currentDealData = result.filter(x => x.active == true)[0];
        //         if (this.currentDealData) {
        //         }
        //     });
        //   });
        // Get Deal dates
        this.getDealSpecificDates();

        // Get Assigned User Full Name
        this.getAssignedUserFullName();

        // Referesh Nav Bar to set asssigned user name for deal
        this.refreshNavBarToDisplayAssignedUserName();

        this.href = this.router.url;

        // if (this.eventEmitterService.navbarDates === undefined) {
        //     this.eventEmitterService.navbarDates = this.eventEmitterService.
        //         invokeUpdatedDatesNavbar.subscribe((name: string) => {
        //             this.getDealSpecificDates();
        //         });
        // }

    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    sendFull(): void {
        this.dealHeaderservice.sendFullParty('true');
        this.partyFull = true;
    }

    onclickParty() {
        this.partyEventClicked.emit();
    }

    onclickCollateral() {
        this.collateralEventClicked.emit();
    }

    onclickLoan() {
        this.loanEventClicked.emit();
    }

    onclicksummary() {
        this.summaryEventClicked.emit();
    }

    onClickReq() {
        this.requirementEventClicked.emit();
    }

    onClickDoc() {
        this.documentEventClicked.emit();
    }
    onClickDates() {
        this.datesEventClicked.emit();
    }

    open() {
        this.modalRef = this.confirmService.openQuickViewModal('Quick View');
    }
    onClickReqDue() {
        //this.modalRef = this.confirmService.openRequirementDueModal('Requirement Due')
    }
    onClickEvents() { this.eventsClicked.emit(); }

    onClickProcesses() {
        this.processeseventClicked.emit();
    }

    OnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.subscription.unsubscribe();
    }

    selectName(id) {

        if (id == AppConsts.summary) {
            this.summaryEventClicked.emit();
        }
        else if (id == AppConsts.party) {
            this.partyEventClicked.emit();
        }
        else if (id == AppConsts.loan) {
            this.loanEventClicked.emit();
        }
        else if (id == AppConsts.collateral) {
            this.collateralEventClicked.emit();
        }
        else if (id == AppConsts.documents) {
            this.documentEventClicked.emit();
        }
        else if (id == AppConsts.requirments) {
            this.requirementEventClicked.emit();
        }
        else if (id == AppConsts.newEvents) {
            this.eventsClicked.emit();
        }
        else if (id == AppConsts.Processes) {
            this.processeseventClicked.emit();
        }
    }

    // Get all the deal specific dates to be displayed in navbar
    // Example :  CONOAT, Dec Due etc
    getDealSpecificDates() {
        this.dealDates$.subscribe(result => {
            this.activeDeal = result.filter(x => x.active == true)[0];
            if (this.activeDeal) {
                this.dealService.getDealDates(parseInt(this.activeDeal.dealId)).subscribe(res => {
                    //debugger;
                    this.dealDates = res;
                });
            }
        });

    }

    openAssign() {
        this.modalRef = this.confirmService.openAssignModal('Assign');
    }

    /// <summary>
    /// Get the specific deal detail
    /// Example, AssignedUserFullName which determines Assign functionality in Nav Bar so that
    /// When to show Assign Alert Dialog or Assign dialog which is used to assign deal to user
    /// <summary>
    getAssignedUserFullName() {
        this.store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
        })

        if (this.currentDealData) {
            this.dealService.getAssignedUserNameForDeal(parseInt(this.currentDealData.dealId)).subscribe(res => {
                this.dealDetails = res;
                //res.assignedUserFullName = res.assignedUserFullName;
                if (res.assignedUserFullName == null || res.assignedUserFullName == "") {

                    this.isExistAssignedUserFullName = null;
                }
                else {
                    //debugger;

                    this.splittedUserName = res.assignedUserFullName.split(" ", 2);
                    this.lastName = this.splittedUserName[1];
                    this.lastNameIntial = this.lastName.substring(0, 1);

                    this.isExistAssignedUserFullName = this.splittedUserName[0] + " " + this.lastNameIntial;
                    //this.isExistAssignedUserFullName = res.assignedUserFullName;
                }
            });
        }
    }

    /// <summary>
    /// Refresh nav bar
    /// Example, when we assign deal to specific user then nav bar should get auto refresh to display the updated user name
    /// <summary>
    refreshNavBarToDisplayAssignedUserName() {
        if (this.eventEmitterService.assignedUserName == undefined) {
            this.eventEmitterService.assignedUserName = this.eventEmitterService.
                invokeNavBarToAssignUserName.subscribe((name: string) => {
                    this.getAssignedUserFullName();
                });
        }
    }
}

