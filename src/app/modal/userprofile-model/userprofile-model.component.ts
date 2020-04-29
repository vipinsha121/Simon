import { Component, Injectable, Directive, TemplateRef, ElementRef, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserServiceProxy, CodeServiceProxy, ParticipantServiceProxy, UserFullProfileDto, ConfigServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
    selector: 'userprofile-model',
    templateUrl: './userprofile-model.component.html',
    styleUrls: ['./userprofile-model.component.css']
})
export class UserProfileModalComponent implements OnInit {
    public userProfileForm: FormGroup
    public user: UserFullProfileDto
    public managers: Array<any>
    public loanAssistants: Array<any>
    public regions: Array<any>
    public branches: Array<any>
    public departments: Array<any>
    public costCenters: Array<any>
    private userRoles: Array<any>
    private loanAssistantUserRoles: Array<any>
    private selectedUserRoles: Array<any>
    public users: Array<any>
    public filteredUsers: Observable<any>
    public filteredManagers: Observable<any>
    private mgmtRoles : Array<any>
    public permittedUserRole: boolean
    public permittedLoanAssistantRole: boolean
    public isLoading: boolean
    private modalRef: NgbModalRef;
    public confirmFlag: boolean = false
    @Input() reportLoanData: Array<any> = [];
    @Input() title;
    @Output() onSaveClick: EventEmitter<any> = new EventEmitter();
    @ViewChild ('searchUser') searchUser: ElementRef<HTMLInputElement>;
    @ViewChild('searchManager') searchManager: ElementRef<HTMLInputElement>;


    constructor(
        private _userService: UserServiceProxy,
        private _dropDownService: CodeServiceProxy,
        private _participantsService: ParticipantServiceProxy,
        private _configService: ConfigServiceProxy,
        public activeModal: NgbActiveModal,
        public confirmService: confirmModalPopupService,
        private FormBuilder: FormBuilder,
        private store: Store<AppState>
    ) {
        this.user = new UserFullProfileDto()
        this.regions = []
        this.branches = []
        this.departments = []
        this.costCenters = []
        this.loanAssistants = []
        this.userRoles = []
        this.loanAssistantUserRoles = []
        this.selectedUserRoles = []
        this.users = []
        this.mgmtRoles = []
        this.managers = []
        this.isLoading = false
        this.userProfileForm = this.FormBuilder.group({
            userId: [''],
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],
            title: [''],
            phoneNumber: [''],
            faxNumber: [''],
            email: ['', Validators.required],
            nmlsNumber: [''],
            officeNumber: [''],
            fileDownloadModeEnabled: [''],
            manager: [''],
            loanAssistant: [''],
            region: [''],
            branch: [''],
            department: [''],
            costCenter: ['']
        })
        store.select(state => state.currentUser).subscribe(user => {
            if(user.userId) {
                this._userService.getUserFullProfile(user.userId).subscribe(res => {
                    this.user = res
                })
                this._userService.getUserRoles(user.userId).subscribe(res => {
                    this.userRoles = res
                    this._configService.getConfigValue('UserProfileMgmtRoles').subscribe(res => {
                        if (res.value_10) {
                            this.mgmtRoles = res.value_10.split("|")
                            this.permittedUserRole = this.userRoles.some(role => {
                                if (this.mgmtRoles.indexOf(role) >= 0) {
                                    return true
                                }
                                else {
                                    return false
                                }
                            })
                        }
                        if (this.permittedUserRole) {
                            this.userProfileForm.get('userId').setValidators(Validators.required)
                        }
                    })
                    this._userService.getLaAssistantUserRole().subscribe(res => {
                        this.loanAssistantUserRoles = res.split("|")
                        this.permittedLoanAssistantRole = this.userRoles.some(role => {
                            if(this.loanAssistantUserRoles.indexOf(role) >= 0) {
                                return true
                            }
                            if(this.userRoles.indexOf('OFFICER') >= 0) {
                                return true
                            }
                            else {
                                return false
                            }
                        })
                    })
                })
               
            }
        })
    }
    ngOnInit() {
        this.startFilterUsers()
        this.startFilterManagers()
        this.isLoading = true
        this._dropDownService.getDropdownData('admregion').subscribe(res => {
            this.regions = res
            this.regions.forEach(region => {
                if(region.id) {
                    region.id = Number(region.id)
                }
            })
        })
        this._dropDownService.getDropdownData('admbranch').subscribe(res => {
            this.branches = res
            this.branches.forEach(branch => {
                if (branch.id) {
                    branch.id = Number(branch.id)
                }
            })
        })
        this._dropDownService.getDropdownData('admdepartment').subscribe(res => {
            this.departments = res
            this.departments.forEach(department => {
                if (department.id) {
                    department.id = Number(department.id)
                }
            })
        })
        this._dropDownService.getDropdownData('admcostcenter').subscribe(res => {
            this.costCenters = res
            this.costCenters.forEach(costCenter => {
                if (costCenter.id) {
                  costCenter.id = Number(costCenter.id)
                }
            })
        })
        this._participantsService.getUsersByRole('LNASSIST').subscribe(res => {
            this.loanAssistants = res
        })
        this._participantsService.getManagerUsers().subscribe(res => {
            this.managers = res
        })
        this._participantsService.getUsersForDropdown().subscribe(res => {
            this.isLoading = false
            this.users = res
        })
    }
    private startFilterUsers(): void {
        this.filteredUsers = this.userProfileForm.get('userId')
            .valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : ''),
                map(filterValue => filterValue ? this._filterUsers(filterValue) : this.users.slice())
            );
    }

    private _filterUsers(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.users.filter(
            user => user.text.toLowerCase().includes(filterValue)
        );
    }

    private startFilterManagers(): void {
        this.filteredManagers = this.userProfileForm.get('manager')
            .valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : ''),
                map(filterValue => filterValue ? this._filterManagers(filterValue) : this.managers.slice())
            );
    }

    private _filterManagers(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.managers.filter(
            manager => manager.name.toLowerCase().includes(filterValue)
        );
    }

    public getSelectedUser(event) {
        this.isLoading = true 
        this._userService.getUserFullProfile(event).subscribe(res => {
            this.isLoading = false
            this.user = res
            this._userService.getUserRoles(this.user.userId).subscribe(res => {
                this.selectedUserRoles = res
                this.permittedLoanAssistantRole = this.selectedUserRoles.some(role => {
                    if (this.loanAssistantUserRoles.indexOf(role) >= 0) {
                        return true
                    }
                    if (this.selectedUserRoles.indexOf('OFFICER') >= 0) {
                        return true
                    }
                    else {
                        return false
                    }
                })
            })
        })
    }

    public displayFnPerson(personId): string {
        if (!personId) return '';
        if(this.users) {
            if (this.users.length > 0) {
                let index = this.users.findIndex(user => user.id === personId);
                return this.users[index].text;
            } 
        }
    }

    public displayFnManager(managerId): string {
        if (!managerId) return '';
        if (this.managers) {
            if (this.managers.length > 0) {
                let index = this.managers.findIndex(manager => manager.id === managerId.toLowerCase());
                if(this.managers[index]){
                    return this.managers[index].name;
                }
            }
        }
    }

    onYesClick() {
        this.confirmFlag = true
        this.userProfileForm.disable()
        // this.modalRef = this.confirmService.openConfirmationModal('Confirm User Profile', 'Do you confirm this changes?');
        // this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
        //     this.modalRef.dismiss()
        // })
       
    }

    public onConfirm() {
        this.isLoading = true
        this._userService.setUserFullProfile(this.user).subscribe(res => {
            this.isLoading = false
            this.onSaveClick.emit(this.user);
        }, err => {
        })
    }

    public cancel() {
        if(this.confirmFlag) {
            this.confirmFlag = false
            this.userProfileForm.enable()
        }
        else {
            this.activeModal.dismiss()
        }
    }

}
