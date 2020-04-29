import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DealDto, DealServiceProxy, CodeServiceProxy, ReportServiceProxy, PartyServiceProxy, LoanServiceProxy, CollateralServiceProxy, RequirementServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppConsts } from 'src/app/shared/app-constants';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { SelectedMenuModel } from 'src/app/shared/models/menu.model';

@Component({
    selector: 'dealquickview-modal',
    templateUrl: './dealquickview-modal.component.html'

})
export class DealQuickViewModalComponent implements OnInit {
    currentDealData: Deal;
    @Input() dealId: any;
    partyData: any;
    partycount: number;
    loanData: any;
    loancount: number;
    collateralData: any;
    collateralcount: number;
    currentMenu: SelectedMenuModel;
    processes: Array<any> = [];
    processesCount: number;
    page: number = 1;
    pageSize: number = 10;

    constructor(private store: Store<AppState>,
        private partyService: PartyServiceProxy, public activeModal: NgbActiveModal,
        private loanService: LoanServiceProxy,
        private collateralService: CollateralServiceProxy,
        private requiremtService: RequirementServiceProxy) {
        store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
        });
    }

    ngOnInit() {
        this.getpartylist(this.dealId, 'internal');
        this.getLoanList(this.dealId);
        this.getCollaterallist(this.dealId);
        this.getProcessesList(this.dealId);

    }


    getpartylist(dealId: any, type: string) {

        this.partyService.getPartyListForDeal(this.dealId, 'internal').subscribe(result => {
            this.partyData = result;
            this.partycount = this.partyData.length;
        });
    }

    getLoanList(dealId: any) {
        this.loanService.getLoansForDeal(parseInt(this.dealId)).subscribe(result => {
            this.loanData = result;
            this.loancount = this.loanData.length;
        });
    }

    getCollaterallist(dealId: any) {
        this.collateralService.getCollateralForDeal(parseInt(this.dealId)).subscribe(result => {

            this.collateralData = result;
            this.collateralcount = this.collateralData.length;
        });
    }

    getProcessesList(dealId: any) {
        this.requiremtService.getRequirementList(this.dealId).subscribe(requirementList => {
            var data = requirementList.partyRequirement.concat(requirementList.collateralRequirement, requirementList.dealRequirement, requirementList.loanRequirement, requirementList.requirementRequirement);
            this.processes = data;
            this.processesCount = this.processes.length;
        })
    }
}

