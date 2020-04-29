import { Component, Injectable, Directive, TemplateRef, ElementRef, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserServiceProxy, ParticipantServiceProxy,  ConfigServiceProxy, UserOutOfOfficeDto } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
    selector: 'outofoffice-modal',
    templateUrl: './outofoffice-modal.component.html'

})
export class OutOfOfficeModalComponent implements OnInit {
    public outOfOfficeForm: FormGroup;
    public outOfOffice: UserOutOfOfficeDto;
    public filteredUsers: Observable<any>
    private users: Array<any>
    public interimOfficers: Array<any>
    public filteredInterimOfficers: Observable<any>
    private userRoles: Array<any>
    private mgmtRoles: Array<any>
    public permittedUserRole: boolean
    public isUserOfficer: boolean
    public isLoading: boolean
    private modalRef: NgbModalRef;
    public confirmFlag: boolean = false
    public startTime: any 
    public endTime: any
    @Input() reportLoanData: Array<any> = [];
    @Input() title;
    @Output() onSaveClick: EventEmitter<any> = new EventEmitter();
    @ViewChild('searchUser') searchUser: ElementRef<HTMLInputElement>;
    @ViewChild('searchInterimOfficer') searchInterimOfficer: ElementRef<HTMLInputElement>;


    constructor(
        private _userService: UserServiceProxy,
        public activeModal: NgbActiveModal,
        private FormBuilder: FormBuilder,
        private _configService: ConfigServiceProxy,
        private _participantsService: ParticipantServiceProxy,
        private store: Store<AppState>,
        public confirmService: confirmModalPopupService,
    ) {
        this.outOfOffice = new UserOutOfOfficeDto()
        this.users = []
        this.userRoles = []
        this.interimOfficers = []
        this.mgmtRoles = []
        this.permittedUserRole = false
        this.isLoading = false
        this.outOfOffice = new UserOutOfOfficeDto()
        this.outOfOfficeForm = this.FormBuilder.group({
            userId: [''],
            interimOfficerId: [''],
            isOutOfOfficeRangeSet: [false],
            startDate: [''],
            startTime: [''],
            endDate: [''],
            endTime: ['']
        })
        store.select(state => state.currentUser).subscribe(user => {
            if (user.userId) {
                this._userService.getUserOutOfOffice(user.userId).subscribe(res => {
                    this.outOfOffice = res
                    this.outOfOfficeForm.get('isOutOfOfficeRangeSet').setValue(this.outOfOffice.isOutOfOfficeRangeSet)
                    this.outOfOfficeForm.get('startTime').setValue(new Date(this.outOfOffice.startDate).getHours() + ':' + new Date(this.outOfOffice.startDate).getMinutes())
                    this.outOfOfficeForm.get('endTime').setValue(new Date(this.outOfOffice.endDate).getHours() + ':' + new Date(this.outOfOffice.endDate).getMinutes())
                    if(this.outOfOffice.isOutOfOfficeRangeSet) {
                        this.outOfOfficeForm.get('startDate').setValidators(Validators.required)
                        this.outOfOfficeForm.get('endDate').setValidators(Validators.required)
                        this.outOfOfficeForm.get('startTime').setValidators(Validators.required)
                        this.outOfOfficeForm.get('endTime').setValidators(Validators.required)
                        this.outOfOfficeForm.get('startDate').markAsTouched()
                        this.outOfOfficeForm.get('endDate').markAsTouched()
                        this.outOfOfficeForm.get('startTime').markAsTouched()
                        this.outOfOfficeForm.get('endTime').markAsTouched()
                        this.outOfOfficeForm.get('startDate').enable()
                        this.outOfOfficeForm.get('endDate').enable()
                        this.outOfOfficeForm.get('startTime').enable()
                        this.outOfOfficeForm.get('endTime').enable()
                    }
                    else {
                        this.outOfOfficeForm.get('startDate').disable()
                        this.outOfOfficeForm.get('endDate').disable()
                        this.outOfOfficeForm.get('startTime').disable()
                        this.outOfOfficeForm.get('endTime').disable()
                    }
                })
                this._userService.getUserRoles(user.userId).subscribe(res => {
                    this.userRoles = res
                    this._configService.getConfigValue('OutOfOfficeMgmtRoles').subscribe(res => {
                        if (res.value_10) {
                            this.mgmtRoles = res.value_10.split("|")
                            this.permittedUserRole = this.userRoles.some(role => {
                                if (this.mgmtRoles.indexOf(role) >= 0) {
                                    return true
                                }
                            })
                        }
                        if (this.permittedUserRole) {
                            this.outOfOfficeForm.get('userId').setValidators(Validators.required)
                        }
                    })
                    this.isUserOfficer = this.userRoles.some(role => {
                        if (role.toLowerCase().indexOf('officer') >= 0) {
                            return true
                        }
                    })
                })
            }
        })
    }
    ngOnInit() {
        this.startFilterUsers()
        this.startFilterInterimOfficers()
        this.isLoading = true
        this._participantsService.getUsersForDropdown().subscribe(res => {
            this.users = res
        })
        this._participantsService.getUsersByRole('OFFICER').subscribe(res => {
            this.interimOfficers = res
            this.isLoading = false
        })
    }
    onYesClick() {
        this.confirmFlag = true
        let startDateConfig = new Date((new Date(this.outOfOfficeForm.get('startDate').value).getMonth() + 1) + '/' + (new Date(this.outOfOfficeForm.get('startDate').value).getDate()) + '/' + (new Date(this.outOfOfficeForm.get('startDate').value).getFullYear()) + ' ' + this.outOfOfficeForm.get('startTime').value)
        let endDateConfig = new Date((new Date(this.outOfOfficeForm.get('endDate').value).getMonth() + 1) + '/' + (new Date(this.outOfOfficeForm.get('endDate').value).getDate()) + '/' + (new Date(this.outOfOfficeForm.get('endDate').value).getFullYear()) + ' ' + this.outOfOfficeForm.get('endTime').value)
        this.outOfOfficeForm.get('startDate').setValue(startDateConfig)
        this.outOfOfficeForm.get('endDate').setValue(endDateConfig)
        this.outOfOffice.endDate = this.outOfOfficeForm.get('endDate').value
        this.outOfOffice.startDate = this.outOfOfficeForm.get('startDate').value
        this.outOfOfficeForm.disable()
    }

    public onConfirm() {
        this.isLoading = true
        this.outOfOffice.isOutOfOffice = true
        this._userService.setUserOutOfOffice(this.outOfOffice).subscribe(res => {
            this.outOfOffice.isOutOfOffice = false
            this.isLoading = false
            this.onSaveClick.emit();
        }, err => {
        })
    }

    public cancel() {
        if (this.confirmFlag) {
            this.confirmFlag = false
            this.outOfOfficeForm.enable()
        }
        else {
            this.activeModal.dismiss()
        }
    }

    private startFilterUsers(): void {
        this.filteredUsers = this.outOfOfficeForm.get('userId')
            .valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.code),
                map(filterValue => filterValue ? this._filterUsers(filterValue) : this.users.slice())
            );
    }

    private _filterUsers(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.users.filter(
            user => user.text.toLowerCase().includes(filterValue)
        );
    }

    private startFilterInterimOfficers(): void {
        this.filteredInterimOfficers = this.outOfOfficeForm.get('interimOfficerId')
            .valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.code),
                map(filterValue => filterValue ? this._filterInterimOfficers(filterValue) : this.interimOfficers.slice())
            );
    }

    private _filterInterimOfficers(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.interimOfficers.filter(
            user => user.name.toLowerCase().includes(filterValue)
        );
    }

    public getSelectedUser(event) {
        this.isLoading = true
        this._userService.getUserOutOfOffice(event).subscribe(res => {
            this.outOfOffice = res
            this.outOfOfficeForm.get('startTime').setValue(new Date(this.outOfOffice.startDate).getHours() + ':' + new Date(this.outOfOffice.startDate).getMinutes())
            this.outOfOfficeForm.get('endTime').setValue(new Date(this.outOfOffice.endDate).getHours() + ':' + new Date(this.outOfOffice.endDate).getMinutes())
            this.isLoading = false
            if (this.outOfOffice.isOutOfOfficeRangeSet) {
                this.outOfOfficeForm.get('startDate').setValidators(Validators.required)
                this.outOfOfficeForm.get('endDate').setValidators(Validators.required)
                this.outOfOfficeForm.get('startTime').setValidators(Validators.required)
                this.outOfOfficeForm.get('endTime').setValidators(Validators.required)
                this.outOfOfficeForm.get('startDate').markAsTouched()
                this.outOfOfficeForm.get('endDate').markAsTouched()
                this.outOfOfficeForm.get('startTime').markAsTouched()
                this.outOfOfficeForm.get('endTime').markAsTouched()
                this.outOfOfficeForm.get('startDate').enable()
                this.outOfOfficeForm.get('endDate').enable()
                this.outOfOfficeForm.get('startTime').enable()
                this.outOfOfficeForm.get('endTime').enable()
            }
            else {
                this.outOfOfficeForm.get('startDate').disable()
                this.outOfOfficeForm.get('endDate').disable()
                this.outOfOfficeForm.get('startTime').disable()
                this.outOfOfficeForm.get('endTime').disable()
            }
        })
    }

    public displayFnPerson(personId): string {
        if (!personId) return '';
        if (this.users) {
            if (this.users.length > 0) {
                let index = this.users.findIndex(user => user.id === personId);
                return this.users[index].text;
            }
        }
    }

    public displayFnOfficer(officerId): string {
        if (!officerId) return '';
        if (this.interimOfficers) {
            if (this.interimOfficers.length > 0) {
                let index = this.interimOfficers.findIndex(manager => manager.id === officerId);
                return this.interimOfficers[index].name;
            }
        }
    }

    public checkOutOfOffice(ev) {
        if(ev.checked === true) {
            this.outOfOfficeForm.get('startDate').setValidators(Validators.required)
            this.outOfOfficeForm.get('endDate').setValidators(Validators.required)
            this.outOfOfficeForm.get('endDate').updateValueAndValidity({
                onlySelf: true,
            })
            this.outOfOfficeForm.get('startDate').updateValueAndValidity({
                onlySelf: true,
            })
            this.outOfOfficeForm.get('startDate').markAsTouched()
            this.outOfOfficeForm.get('endDate').markAsTouched()

            this.outOfOfficeForm.get('startTime').setValidators(Validators.required)
            this.outOfOfficeForm.get('endTime').setValidators(Validators.required)
            this.outOfOfficeForm.get('endTime').updateValueAndValidity({
                onlySelf: true,
            })
            this.outOfOfficeForm.get('startTime').updateValueAndValidity({
                onlySelf: true,
            })
            this.outOfOfficeForm.get('startTime').markAsTouched()
            this.outOfOfficeForm.get('endTime').markAsTouched()
            this.outOfOfficeForm.updateValueAndValidity({
                onlySelf: true,
            })
            this.outOfOfficeForm.get('startDate').enable()
            this.outOfOfficeForm.get('endDate').enable()
            this.outOfOfficeForm.get('startTime').enable()
            this.outOfOfficeForm.get('endTime').enable()
        }
        else {
            this.outOfOfficeForm.get('startDate').clearValidators()
            this.outOfOfficeForm.get('endDate').clearValidators()
            this.outOfOfficeForm.get('endDate').updateValueAndValidity({
                onlySelf: true,
            })
            this.outOfOfficeForm.get('startDate').updateValueAndValidity({
                onlySelf: true,
            })
            this.outOfOfficeForm.get('startTime').clearValidators()
            this.outOfOfficeForm.get('endTime').clearValidators()
            this.outOfOfficeForm.get('endTime').updateValueAndValidity({
                onlySelf: true,
            })
            this.outOfOfficeForm.get('startTime').updateValueAndValidity({
                onlySelf: true,
            })
            this.outOfOfficeForm.updateValueAndValidity({
                onlySelf: true,
            })
            this.outOfOfficeForm.get('startDate').disable()
            this.outOfOfficeForm.get('endDate').disable()
            this.outOfOfficeForm.get('startTime').disable()
            this.outOfOfficeForm.get('endTime').disable()
        }
    }

}
