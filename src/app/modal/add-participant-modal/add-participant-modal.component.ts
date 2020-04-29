import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DealServiceProxy, ParticipantServiceProxy, CodeServiceProxy, UserFullProfileDto } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { jqxWindowComponent } from 'jqwidgets-ng/jqxwindow';
import { Observable } from 'rxjs';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

export class InternalParticipantModel {
    personId?: string | undefined
    dealId?: string | undefined
    participationId?: string | undefined
    createUserId?: string | undefined
    interimUser?: boolean

    constructor() {
        this.personId = '',
        this.dealId = ''
        this.participationId = ''
        this.createUserId = ''
        this.interimUser = false
    }
}

@Component({
    selector: 'add-participant-modal',
    templateUrl: './add-participant-modal.component.html',
    styleUrls: ['./add-participant-modal.component.css']

})
export class AddParticipantModalComponent implements OnInit {
    public filteredParticipants: Observable<any>
    public addParticipantForm: FormGroup
    public selectedParticipant: any
    public participants: Array<any> 
    public participation: any
    public interimUser: boolean
    public internalParticipation: Array<any>
    private existingParticipants: Array<any> = []
    // public internalParticipant: InternalParticipantModel
    public internalParticipant: any = {}
    private currentDealData: Deal;
    isValid: boolean = false;
    private currentUser: UserFullProfileDto
    modalRef: NgbModalRef;
    public isLoading: boolean
    private showAlreadyExistError: boolean // JUST FOR TESTING THE MODAL, CHANGE IT'S VALUE ON CONSTRUCTOR
    @Input() title;
    @Output() onConfirmClick: EventEmitter<any> = new EventEmitter();
    @ViewChild('searchParticipant') searchParticipant: ElementRef<HTMLInputElement>;

    constructor(
        public activeModal: NgbActiveModal, private dealService: DealServiceProxy,
        private store: Store<AppState>,
        private participantsService: ParticipantServiceProxy,
        private eventEmitterService: EventEmitterService,
        public confirmService: confirmModalPopupService,
        private _dropDownService: CodeServiceProxy,
        private FormBuilder: FormBuilder,
        ) 
        {
            this.interimUser = false
            this.participants = []
            this.isLoading = false
            this.internalParticipation = []
            // this.internalParticipant = new InternalParticipantModel()
            this.addParticipantForm = this.FormBuilder.group({
                selectedParticipant: ['', Validators.required],
                participationId: ['', Validators.required],
                interimUser: ['']
            })
            this.showAlreadyExistError = false
    }

    ngOnInit() {
        this.startFilterParticipants()
        this.store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
        })
        this.store.select(state => state.currentUser).subscribe(user => {
            this.currentUser = user
        })
        this.participantsService.getUsersForDropdown().subscribe(res => {
            this.participants = res;
        });
        this.getExistingParticipants()
        this._dropDownService.getDropdownData('InternalParticipation').subscribe(res => {
            this.internalParticipation = res
            this.internalParticipation.forEach(internalParticipation => {
                if (internalParticipation.id) {
                    internalParticipation.id = Number(internalParticipation.id)
                }
            })
        })
    }

    private startFilterParticipants(): void {
        this.filteredParticipants = this.addParticipantForm.get('selectedParticipant')
            .valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.code),
                map(filterValue => filterValue ? this._filterUsers(filterValue) : this.participants.slice())
            );
    }

    private _filterUsers(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.participants.filter(
            participants => participants.text.toLowerCase().includes(filterValue)
        );
    }

    public addParticipant() {
        if(this.existingParticipants.length > 0) {
            this.existingParticipants.forEach(participant => {
                if(participant.personId == this.selectedParticipant) {
                    this.showAlreadyExistError = true
                }
            })
        }
        if(this.showAlreadyExistError == true) {
            this.confirmService.openErrorModal('PARTICIPANT ALREADY EXIST', 'Participant already exist, cannot save')
        }
        else {
            this.isLoading = true
            this.internalParticipant = {
                createUserId: this.currentUser.userId,
                dealId: this.currentDealData.dealId,
                interimUser: this.interimUser,
                participationId: this.participation,
                personId: this.selectedParticipant
            }
            this.participantsService.post(this.internalParticipant).subscribe((res) => {
                this.activeModal.close()
                this.isLoading = false
                this.modalRef = this.confirmService.openParticipantListModal('Participants');
            })

        }
    }

    public isValidParticipant(event): boolean {
        this.isValid = false
        this.participants.forEach(participant => {
            if(participant) {
                if (participant.id == this.selectedParticipant) {
                    this.isValid = true
                }
            }
        })
        return this.isValid
    }

    public getExistingParticipants() {
        this.participantsService.getParticipantForDeal(parseInt(this.currentDealData.dealId)).subscribe(res => {
            this.existingParticipants = res
        })
    }

    public displayFnPerson(personId): string {
        if (!personId) return '';
        if (this.participants) {
            if (this.participants.length > 0) {
                let index = this.participants.findIndex(participant => participant.id === personId);
                return this.participants[index].text;
            }
        }
    }

}
