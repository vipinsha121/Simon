import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DealServiceProxy, ParticipantServiceProxy, PartyServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { jqxWindowComponent } from 'jqwidgets-ng/jqxwindow';
import { Observable } from 'rxjs';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';

@Component({
    selector: 'participant-modal',
    templateUrl: './participant-modal.component.html',
    styleUrls: ['./participant-modal.component.css']

})
export class ParticipantModalComponent implements OnInit {

    @Input() title;
    @Output() onConfirmClick: EventEmitter<any> = new EventEmitter();
    participants: any;
    currentDealData: Deal;
    dealOfficer : any;
    dealOfficerProfile : any;
    modalRef: NgbModalRef;
    externalParticipants: any;

    constructor(public activeModal: NgbActiveModal, private dealService: DealServiceProxy,
        private store: Store<AppState>,
        private partyService: PartyServiceProxy,
        private participantsService: ParticipantServiceProxy,
        private eventEmitterService: EventEmitterService,
        public confirmService: confirmModalPopupService) {
    }

    ngOnInit() {
        // Get Participants
        if(this.title == 'Participants') {
            this.getParticipantsList();
        }
        else {
            //Get external participants
            this.getParticipantsList();
        }
    }

    getParticipantsList() {
        // Gets Current Deal Deatails
        this.store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
        })

        // Participants data
        if(this.title == "Internal Participants")
        {
        this.participantsService.getParticipantForDeal(parseInt(this.currentDealData.dealId)).subscribe(res => {
           
            this.participants = res;

            if(this.participants != null){
                this.participants.forEach(par => {
                    if (par.doNotShowDealUser == null) {
                        par.doNotShowDealUser = false;
                    }
                    if (par.primary == true) {
                        this.dealOfficer = par.personName;
                        this.dealOfficerProfile = par;
                    }
                });
            }            
        });
        
    }
    if(this.title == "External Participants") {
        this.partyService.getPartyListForDeal(parseInt(this.currentDealData.dealId), "external").subscribe(res => {
            this.externalParticipants = res;
        })
    }
}

    openAddParticipantModal() {
        this.activeModal.close()
        this.modalRef = this.confirmService.openAddParticipantModal('Add Participant')
    }

    openAddExternalParticipantModal() {
        this.activeModal.close()
        this.modalRef = this.confirmService.openAddExternalParticipantModal('Add External Participant')
    }

    openParticipantDeleteModal(participant : any, participantType : string) {    
        //debugger;
        this.activeModal.close();
        // Show dialog to delete participant
        this.modalRef = this.confirmService.showParticipantDeleteModal(participantType,participant);
      }
    addParticipantPerson(){
        this.activeModal.close();
        if(this.title == "Internal Participants") {
            this.activeModal.close();
           this.modalRef = this.confirmService.openAddParticipantPerson();
        }
        if(this.title == "External Participants") {
            this.activeModal.close();
            this.modalRef = this.confirmService.openAddExternalParticipantModal(this.currentDealData.dealId);
        }
    }
    editParticipantRole() {
        this.activeModal.close();
        this.modalRef = this.confirmService.openEditParticipantModal();
    }
}
