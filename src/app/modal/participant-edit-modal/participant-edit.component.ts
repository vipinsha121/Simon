
import { Component, OnInit, Input } from '@angular/core';
import { ParticipantServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { AppState } from 'src/app/shared/models/app.state';
import { Store } from '@ngrx/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
;
@Component({
    selector: 'participant-edit-modal',
    templateUrl: './participant-edit.component.html',
})

export class ParticipantEditComponent implements OnInit {

    currentDealData: any;
    dealOfficers: any;
    dealHasPrimaryOfficer: boolean;
    dealPrimaryOfficer: any;
    selectedOfficer: any;

    constructor(private partcipantsService: ParticipantServiceProxy,
        private store: Store<AppState>,
        public activeModal: NgbActiveModal) {}
    ngOnInit() {
        this.getDealOfficer();
    }

    getDealOfficer() {
        this.store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
        })
        if (this.currentDealData) {
            this.partcipantsService.getOfficersForDeal(parseInt(this.currentDealData.dealId)).subscribe(res => {
                this.dealOfficers = res;
                this.dealOfficers.forEach(officer => {
                    if (officer.primary) {
                        this.dealHasPrimaryOfficer = true
                        this.dealPrimaryOfficer = officer
                    }
                })
            });
        }
    }

    editParticipantRole() {
        this.partcipantsService.setParticipantAsPrimary(this.currentDealData.dealId, this.selectedOfficer).subscribe(res => {
            console.log(res);
            this.activeModal.close();
            
        })
    }

}