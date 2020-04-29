import { Component, OnInit, Input } from '@angular/core';
import { ParticipantServiceProxy, DealServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { Store } from '@ngrx/store';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppState } from 'src/app/shared/models/app.state';

@Component({
    selector: 'toolbar-external-participants',
    templateUrl: './external-participants.component.html',
    styleUrls: ['./external-participants.component.css']
})

export class ExternalParticipantsComponent implements OnInit {
    @Input() currentMenu: any = {};
    participants: Array<any>;
    currentDealData: Deal;

    constructor(private participantService: ParticipantServiceProxy,
        public confirmService: confirmModalPopupService,
        private dealService: DealServiceProxy,
        private store: Store<AppState>) {
            this.participants = []
        }

    modalRef: NgbModalRef;

    ngOnInit() {
        this.getDealarticipants();
    }

    getparticipantdetials(participant) {
        var a = participant;
        this.modalRef = this.confirmService.openparticipantModal('Participant Details', participant);
    }

    getDealarticipants() {
        this.participantService.getParticipantForDeal(this.currentMenu.id).subscribe(participantsList => {
            this.participants = participantsList;
        });
    }  

    openExternalParticipantListModal() {

         // Gets Current Deal Deatails
         this.store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
        })

        // Participants data
        this.participantService.getParticipantForDeal(parseInt(this.currentDealData.dealId)).subscribe(res => {
           this.participants = res;                  
        });

        if(this.participants.length > 0){
        // Show dialog with Participant List
        this.modalRef = this.confirmService.openParticipantListModal('External Participants');
        }
      }
}
