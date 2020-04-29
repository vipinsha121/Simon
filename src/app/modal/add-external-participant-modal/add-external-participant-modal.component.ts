import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { DealServiceProxy, ParticipantServiceProxy, CodeServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { jqxWindowComponent } from 'jqwidgets-ng/jqxwindow';
import { Observable } from 'rxjs';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import * as _moment from 'moment';

const moment = _moment;

export class CompanyModel {
    name?: string | undefined = '';
    tin?: string | undefined = '';
    hostId?: string | undefined = '';
    type?: string | undefined = '';
    street1?: string | undefined = '';
    street2?: string | undefined = '';
    city?: string | undefined = '';
    zip?: string | undefined = '';
    phone?: any | undefined = '';
    state?: any | undefined = '';
    entityTypeCode?: any | undefined = '';
    constructor() { }
}

export class PersonModel {
    firstName?: string | undefined = '';
    middleName?: string | undefined = '';
    lastName?: string | undefined = '';
    tin?: string | undefined = '';
    hostId?: string | undefined = '';
    street1?: string | undefined = '';
    street2?: string | undefined = '';
    city?: string | undefined = '';
    zip?: any | undefined = '';
    phone?: any | undefined = '';
    mobilePhone?: any | undefined = '';
    birthdate?: any | undefined = '';
    email?: any | undefined = '';
    state?: any | undefined = '';

    constructor() { }
}


@Component({
    selector: 'add-external-participant-modal',
    templateUrl: './add-external-participant-modal.component.html',
    styleUrls: ['./add-external-participant-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AddExternalParticipantModalComponent implements OnInit {
    public filteredCompanies: Array<any>
    public filteredPersons: Observable<any>
    public selectedCompany: any
    public selectedPerson: any
    public participationId: any
    public externalParticipationArray: Array<any>
    public externalParticipantForm: FormGroup
    private personsByCompany: Array<any>
    public isSelectedCompany: boolean
    public addNewCompanyForm: FormGroup
    public addNewPersonForm: FormGroup
    public date = new FormControl(moment("12-25-1995", ["MM-DD-YYYY", "YYYY-MM-DD"]));
    public person: PersonModel
    public company: CompanyModel
    public stateList: Array<any>
    public entityTypes: Array<any>
    public addNewCompanyFlag: boolean
    public addNewPersonFlag: boolean
    currentDealData: Deal;
    modalRef: NgbModalRef;
    public TINmask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    public isLoading: boolean
    private showAlreadyExistError: boolean // JUST FOR TESTING THE MODAL, CHANGE IT'S VALUE ON CONSTRUCTOR
    @Input() title;
    @Output() onConfirmClick: EventEmitter<any> = new EventEmitter();
    @ViewChild('searchCompany') searchCompany: ElementRef<HTMLInputElement>;
    @ViewChild('searchPerson') searchPerson: ElementRef<HTMLInputElement>;

    constructor(
        public activeModal: NgbActiveModal,
        private dealService: DealServiceProxy,
        private store: Store<AppState>,
        private participantsService: ParticipantServiceProxy,
        private eventEmitterService: EventEmitterService,
        public confirmService: confirmModalPopupService,
        private _dropDownService: CodeServiceProxy,
        private FormBuilder: FormBuilder,
    ) {
        this.company = new CompanyModel()
        this.person = new PersonModel()
        this.personsByCompany = []
        this.addNewCompanyFlag = false
        this.addNewPersonFlag = false
        this.externalParticipationArray = []
        this.isSelectedCompany = false
        this.stateList = []
        this.entityTypes = []
        this.isLoading = false
        this.externalParticipantForm = this.FormBuilder.group({
            selectedCompany: ['', Validators.required],
            selectedPerson: ['', Validators.required],
            participationId: ['', Validators.required],
        })
        this.addNewCompanyForm = this.FormBuilder.group({
            name: ['', [Validators.required]],
            tin: '',
            hostId: '',
            type: ['', [Validators.required]],
            street1: '',
            street2: '',
            city: '',
            zip: ['',
                [Validators.minLength(5),
                Validators.maxLength(9)]],
            phone: ['',
                [Validators.minLength(10),
                Validators.maxLength(50)]],
            state: ['']
        })

        this.addNewPersonForm = this.FormBuilder.group({
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],
            tin: '',
            hostId: '',
            street1: '',
            street2: '',
            city: '',
            zip: ['', [
                Validators.minLength(5),
                Validators.maxLength(9)
            ]],
            phone: ['', [
                Validators.minLength(10),
                Validators.maxLength(50)
            ]],
            mobilePhone: ['', [
                Validators.minLength(10),
                Validators.maxLength(50)
            ]],
            birthdate: this.date,
            email: [''],
            state: ['']
        })
        this.showAlreadyExistError = true
    }

    ngOnInit() {
        this.startFilterPersons()
        this.store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
        })
        this._dropDownService.getDropdownData("UnitedStates").subscribe(result => {
            this.stateList = result;
        });
        this._dropDownService.getDropdownData("EntityType").subscribe(result => {
            this.entityTypes = result;
        });
        this._dropDownService.getDropdownData('ExternalParticipation').subscribe(res => {
            this.externalParticipationArray = res
            this.externalParticipationArray.forEach(externalParticipation => {
                if (externalParticipation.id) {
                    externalParticipation.id = Number(externalParticipation.id)
                }
            })
        })
    }

    async searchCompanies(ev) {
        if (this.selectedCompany != '') {
            this.isLoading = true
            this.participantsService.searchCompany(this.selectedCompany, 1).subscribe(res => {
                this.filteredCompanies = res
                this.isLoading = false
            })
        }
        else {
            this.isSelectedCompany = false
        }
    }

    public displayFn(company): string {
        if (company) {
            if (company.name) {
                return company.name;
            }
        }
    }

    public setSelectedCompanyFlag() {
        this.isSelectedCompany = true
        if (this.selectedCompany) {
            if (this.selectedCompany.companyId) {
                this.participantsService.getPersonsByCompany(this.selectedCompany.companyId).subscribe(res => {
                    this.personsByCompany = res
                })
            }
        }
    }

    private startFilterPersons(): void {
        this.filteredPersons = this.externalParticipantForm.get('selectedPerson')
            .valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.code),
                map(filterValue => filterValue ? this._filterPersons(filterValue) : this.personsByCompany.slice())
            );
    }

    public displayFnPerson(person): string {
        if (person) {
            if (person.name) {
                return person.name
            }
        }
    }

    private _filterPersons(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.personsByCompany.filter(
            person => person.id.toLowerCase().includes(filterValue)
        );
    }

    public addNewCompany() {
        this.addNewCompanyFlag = true;
    }

    public clearCompanyForm() {
        this.addNewCompanyForm.reset()
        this.addNewCompanyFlag = false;
    }

    public saveNewCompany() {
        this.addNewCompanyFlag = false
    }

    public addNewPerson() {
        this.addNewPersonFlag = true;
    }

    public clearPersonForm() {
        this.addNewPersonForm.reset()
        this.addNewPersonFlag = false;
    }

    public saveNewPerson() {
        this.addNewPersonFlag = false;
    }

    public addParticipant() {
        if (this.showAlreadyExistError == true) {
            this.confirmService.openErrorModal('PARTICIPANT ALREADY EXIST', 'Participant already exist, cannot save')
        }
        else {
            //this.isLoading = true
            this.activeModal.close()
            this.modalRef = this.confirmService.openParticipantListModal('External Participants');
        }
    }

}
