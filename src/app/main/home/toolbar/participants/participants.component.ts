import { Component, OnInit, Input } from '@angular/core';
import { ParticipantServiceProxy, DealServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { Store } from '@ngrx/store';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppState } from 'src/app/shared/models/app.state';

@Component({
    selector: 'toolbar-participants',
    templateUrl: './participants.component.html',
    styleUrls: ['./participants.component.css']
})

export class ParticipantsComponent implements OnInit {
    @Input() currentMenu: any = {};
    participants: any[];
    currentDealData: Deal;

    constructor(private particiapntService: ParticipantServiceProxy,
        public confirmService: confirmModalPopupService,
        private dealService: DealServiceProxy,
        private store: Store<AppState>) { }

    modalRef: NgbModalRef;

    ngOnInit() {
        this.getDealarticipants();
    }

    getparticipantdetials(participant) {
        var a = participant;
        this.modalRef = this.confirmService.openparticipantModal('Participant Details', participant);
    }

    getDealarticipants() {
        this.particiapntService.getParticipantForDeal(this.currentMenu.id).subscribe(participantsList => {
            this.participants = participantsList;
        });
    }  

    openParticipantListModal() {

         // Gets Current Deal Deatails
         this.store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
        })

        // // Participants data
        // this.particiapntService.getParticipantForDeal(parseInt(this.currentDealData.dealId)).subscribe(res => {
        //    this.participants = res;                  
        // });

        // if(this.participants.length > 0){
        // Show dialog with Participant List
        this.modalRef = this.confirmService.openParticipantListModal('Internal Participants');
        
      }
}
