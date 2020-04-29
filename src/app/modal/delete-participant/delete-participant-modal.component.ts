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
    selector: 'delete-participant-modal',
    templateUrl: './delete-participant-modal.component.html'

})
export class DeleteParticipantModalComponent implements OnInit {

    @Input() title;
    @Output() onConfirmClick: EventEmitter<any> = new EventEmitter();
    participants: Array<any> = [];
    currentDealData: Deal;
    modalRef: NgbModalRef;

    @Input() participant: any;
    @Input() participantType: any;

    constructor(public activeModal: NgbActiveModal, private dealService: DealServiceProxy,
        private store: Store<AppState>,
        private participantsService: ParticipantServiceProxy,
        private partyService: PartyServiceProxy,
        private eventEmitterService: EventEmitterService,
        public confirmService: confirmModalPopupService) {
    }

    ngOnInit() {
    }

    // Delete participant
    delete() {
        //debugger;
        if (this.participantType == 'internal') {
            this.participantsService.delete(this.participant.dealUserId).subscribe(res => {
            })
        }
        else if (this.participantType == 'external') {
            this.partyService.delete(this.participant.dealPartyId).subscribe(res => res)
        }
        this.activeModal.close();
 
    }
}
