import { Component, OnInit, Input, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordion, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DealDto, DealServiceProxy, ReportServiceProxy, RequirementServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';

@Component({
    selector: 'requirementdue-modal',
    templateUrl: './requirementdue-modal.component.html',
    styleUrls: ['./requirementdue-modal.component.css']
})
export class RequirementsDueComponent implements OnInit {

    @Input() currentDeal: any;

    summaryData: any
    isbuttondiv: boolean = false;
    currentDealData: Deal;
    requirementsdueList: Array<any> = [];
    groupCode: string = '01';
    loanRequestType: string = '03';
    requirementDueCount: number;
    requirements: Array<any> = [];
    dealId: number;

    constructor(private requirementService: RequirementServiceProxy, private store: Store<AppState>, public activeModal: NgbActiveModal) {
        store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
            if (this.currentDealData) {;
                this.dealId = parseInt(this.currentDealData.dealId);
            }
        });
        this.requirementService.getRequirementDueByDealStage(parseInt(this.currentDealData.dealId), this.groupCode, this.loanRequestType).subscribe(result => {
            this.requirements = result;
            //this.requirementsdueList = result;
            this.requirementDueCount = this.requirementsdueList.length;
        });
    }

    ngOnInit() {
    }
}