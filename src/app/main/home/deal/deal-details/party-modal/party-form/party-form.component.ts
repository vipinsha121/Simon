import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { PartyServiceProxy, CodeServiceProxy, PartyDto, DealServiceProxy, RequirementServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PartyFormService} from './party-form-service/party-form.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { EventEmitterService } from './party-form-service/event-emitter.service';
import * as _moment from 'moment';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CustomValidatorsComponent } from 'src/app/shared/validators/custom-validators/custom-validators.component';

const moment = _moment;
export interface State {
  id: number;
  name: string;
  abbrv: string;
}

export interface PeriodicElement {
  dealId: any;
  accountNumber: any;
  requestType: any;
  productDesc: any;
  amount: any;
  role: any;
  stageLabel: any;
  loanId: any;
  participationCode;
  partyId;
  stageId;
  stageStatus;
}


@Component({
  selector: 'party-form',
  templateUrl: './party-form.component.html',
  styleUrls: ['./party-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PartyFormComponent implements OnInit {
  date = new FormControl(moment('12-25-1995', ['MM-DD-YYYY', 'YYYY-MM-DD']));
  @Output() partySave = new EventEmitter<any[]>();
  Related_deals: any[];
  displayedColumns: any[] = ['dealId', 'accountNumber', 'requestType', 'productDesc', 'amount',
    'role', 'stageLabel'];
  dataSource: any[];
  switchTab: string;
  partyDetailForm: FormGroup;
  partyDetailFormBus: FormGroup;
  editMode: boolean;
  dealHasPrimaryBorrower: boolean;
  stateList: State[] = [
    {
      id: 1,
      name: 'Colorado',
      abbrv: 'CO'
    },
    {
      id: 2,
      name: 'Alabama',
      abbrv: 'AL'
    },
    {
      id: 3,
      name: 'Alaska',
      abbrv: 'AK'
    },
    {
      id: 4,
      name: 'Arizona',
      abbrv: 'AZ'
    },
    {
      id: 5,
      name: 'Arkansas',
      abbrv: 'AR'
    },
    {
      id: 6,
      name: 'California',
      abbrv: 'CA'
    },
    {
      id: 7,
      name: 'Connecticut',
      abbrv: 'CT'
    },
    {
      id: 8,
      name: 'Delaware',
      abbrv: 'DE'
    },
    {
      id: 9,
      name: 'Florida',
      abbrv: 'FL'
    },
    {
      id: 10,
      name: 'Georgia',
      abbrv: 'GA'
    },
    {
      id: 11,
      name: 'Hawaii',
      abbrv: 'HI'
    },
    {
      id: 12,
      name: 'Idaho',
      abbrv: 'ID'
    },
    {
      id: 13,
      name: 'Illinois',
      abbrv: 'IL'
    },
    {
      id: 14,
      name: 'Indiana',
      abbrv: 'IN'
    },
    {
      id: 15,
      name: 'Iowa',
      abbrv: 'IA'
    },
    {
      id: 16,
      name: 'Kansas',
      abbrv: 'KS'
    },
    {
      id: 17,
      name: 'Kentucky',
      abbrv: 'KY'
    },
    {
      id: 18,
      name: 'Louisiana',
      abbrv: 'LA'
    },
    {
      id: 19,
      name: 'Maine',
      abbrv: 'ME'
    },
    {
      id: 20,
      name: 'Maryland',
      abbrv: 'MD'
    },
    {
      id: 21,
      name: 'Massachusetts',
      abbrv: 'MA'
    },
    {
      id: 22,
      name: 'Michigan',
      abbrv: 'MI'
    },
    {
      id: 23,
      name: 'Minnesota',
      abbrv: 'MN'
    },
    {
      id: 24,
      name: 'Mississippi',
      abbrv: 'MN'
    },
    {
      id: 25,
      name: 'Missouri',
      abbrv: 'MO'
    },
    {
      id: 26,
      name: 'Montana',
      abbrv: 'MT'
    },
    {
      id: 27,
      name: 'Nebraska',
      abbrv: 'NE'
    },
    {
      id: 28,
      name: 'Nevada',
      abbrv: 'NV'
    },
    {
      id: 29,
      name: 'New Hampshire',
      abbrv: 'NH'
    },
    {
      id: 30,
      name: 'New Jersey',
      abbrv: 'NJ'
    },
    {
      id: 31,
      name: 'New Mexico',
      abbrv: 'NM'
    },
    {
      id: 32,
      name: 'New York',
      abbrv: 'NY'
    },
    {
      id: 33,
      name: 'North Carolina',
      abbrv: 'NC'
    },
    {
      id: 34,
      name: 'North Dakota',
      abbrv: 'ND'
    },
    {
      id: 35,
      name: 'Ohio',
      abbrv: 'OH'
    },
    {
      id: 36,
      name: 'Oklahoma',
      abbrv: 'OK'
    },
    {
      id: 37,
      name: 'Oregon',
      abbrv: 'OR'
    },
    {
      id: 38,
      name: 'Pennsylvania',
      abbrv: 'PA'
    },
    {
      id: 39,
      name: 'Rhode Island',
      abbrv: 'RI'
    },
    {
      id: 40,
      name: 'South Carolina',
      abbrv: 'SC'
    },
    {
      id: 41,
      name: 'South Dakota',
      abbrv: 'SD'
    },
    {
      id: 42,
      name: 'Tennessee',
      abbrv: 'TN'
    },
    {
      id: 43,
      name: 'Texas',
      abbrv: 'TX'
    },
    {
      id: 44,
      name: 'Utah',
      abbrv: 'UT'
    },
    {
      id: 45,
      name: 'Vermont',
      abbrv: 'VT'
    },
    {
      id: 46,
      name: 'Virginia',
      abbrv: 'VA'
    },
    {
      id: 47,
      name: 'Washington',
      abbrv: 'WA'
    },
    {
      id: 48,
      name: 'West Virginia',
      abbrv: 'WV'
    },
    {
      id: 49,
      name: 'Wisconsin',
      abbrv: 'WI'
    },
    {
      id: 50,
      name: 'Wyoming',
      abbrv: 'WY'
    },
    {
      id: 51,
      name: 'District of Columbia',
      abbrv: 'DC'
    }
  ];
  party: PartyDto = new PartyDto();
  openRequirements: number = 0;
  completeRequirement: number = 0;
  dealId: number = 0;
  partyId: number = 0;
  requirements: Array<any> = [];
  entityType: Array<any> = [];
  roleType: Array<any> = [];
  modalRef: NgbModalRef;
  DealID: any;
  snackBarRef: any;
  configSuccess: MatSnackBarConfig = {
    panelClass: 'u-background-green-light',
  };
  configCancel: MatSnackBarConfig = {
    panelClass: 'u-background-red',
  };
  TINmask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  TINbusMask = [/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  phoneMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  IsFromParty: boolean = true;
  reqDocuments: any;
  navLinks: any[];
  activeLinkIndex = -1;

  constructor(private activatedRoute: ActivatedRoute,
    private partyService: PartyServiceProxy,
    private codeService: CodeServiceProxy,
    private fb: FormBuilder,
    private eventEmitterService: EventEmitterService,
    public confirmService: confirmModalPopupService,
    private dealService: DealServiceProxy,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private requirementService: RequirementServiceProxy) {
    this.navLinks = [
      {
        label: 'requirements',
        link: './requirements',
        index: 0
      }, {
        label: 'documents',
        link: './documents',
        index: 1
      }, {
        label: 'detail',
        link: './detail',
        index: 2
      }, {
        label: 'related-deals',
        link: './related-deals',
        index: 3
      }
    ];
  }

  openSnackBarSave(message, action) {
    this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data: 'Party Form Saved',
      duration: 2000,
      ...this.configSuccess
    });
  }

  openSnackBarCancel() {
    this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data: 'Party Form Changes Cancelled',
      duration: 2000,
      ...this.configCancel
    });
  }

  private buildForms() {
    // Party Form For Individual
    this.partyDetailForm = new FormGroup({
      firstName: new FormControl(this.party.firstName, [
        Validators.required,
        Validators.maxLength(50)
      ]),
      middleName: new FormControl(this.party.middleName, [
        Validators.maxLength(50)
      ]),
      lastName: new FormControl(this.party.lastName, [
        Validators.required,
        Validators.maxLength(50)
      ]),
      tin: new FormControl(this.party.tin, [
        CustomValidatorsComponent.ssnValidator
      ]),
      hostId: new FormControl(this.party.hostId, [
        Validators.maxLength(50),
        CustomValidatorsComponent.cifValidator
      ]),
      role: new FormControl(this.party.role, [
        Validators.required
      ]),
      street1: new FormControl(this.party.street1, [
        Validators.maxLength(50)
      ]),
      street2: new FormControl(this.party.street2, [
        Validators.maxLength(50)
      ]),
      city: new FormControl(this.party.city, [
        Validators.maxLength(50)
      ]),
      zip: new FormControl(this.party.zip, [
        CustomValidatorsComponent.zipCodeValidator
      ]),
      phone: new FormControl(this.party.phone,
        // CustomValidatorsComponent.phoneValidator
      ),
      phoneMobile: new FormControl(this.party.mobilePhone,
        // CustomValidatorsComponent.phoneValidator
      ),
      birthdate: new FormControl('', CustomValidatorsComponent.isDateValid),
      email: new FormControl([]),
      state: new FormControl([])
    });
    this.partyDetailForm.get('firstName').markAsTouched()
    this.partyDetailForm.get('lastName').markAsTouched()
    this.partyDetailForm.get('role').markAsTouched()


    // Party Form For Company
    this.partyDetailFormBus = new FormGroup({
      name: new FormControl(this.party.name, [
        Validators.required,
        Validators.maxLength(50)
      ]),
      tinBus: new FormControl(this.party.tin,
        CustomValidatorsComponent.einValidator
      ),
      hostId: new FormControl(this.party.hostId, [
        CustomValidatorsComponent.cifValidator
      ]),
      type: new FormControl(this.party.type, [
        Validators.required
      ]),
      role: new FormControl(this.party.role, [
        Validators.required
      ]),
      street1: new FormControl(this.party.street1, [
        Validators.maxLength(50)
      ]),
      street2: new FormControl(this.party.street2, [
        Validators.maxLength(50)
      ]),
      city: new FormControl(this.party.city, [
        Validators.maxLength(50)
      ]),
      zip: new FormControl(this.party.zip, [
        CustomValidatorsComponent.zipCodeValidator
      ]),
      phone: new FormControl(this.party.phone,
        // CustomValidatorsComponent.phoneValidator
      ),
      phoneTwo: new FormControl(this.party.mobilePhone,
        // CustomValidatorsComponent.phoneValidator
      ),
      state: new FormControl(this.party.state, [])
    });

    this.partyDetailFormBus.get('name').markAsTouched()
    this.partyDetailFormBus.get('role').markAsTouched()
    this.partyDetailFormBus.get('type').markAsTouched()
  }

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });

    this.codeService.getDropdownData("EntityType").subscribe(result => {
      this.entityType = result;
    });

    this.codeService.getDropdownData("LoanParticipation").subscribe(result => {
      this.roleType = result;
      if (this.dealHasPrimaryBorrower) {
        var elementPos = this.roleType.map(function (x) { return x.name; }).indexOf('Borrower');
        this.roleType.splice(elementPos, 1); // "borrower" location in participants list
      }
    });
    this.activatedRoute.parent.parent.params.subscribe(params => {
      this.dealId = params['dealId'];
    });

    // Observes parameter for url
    // Get partyId from URL
    this.activatedRoute.params.subscribe(params => {
      this.partyId = params['partyId'];
      if (this.partyId > 0) {
        this.partyService.getPartyDetails(this.dealId, this.partyId).subscribe(partyRes => {
          this.party = partyRes;
          this.DealID = partyRes.dealId;
        });

        this.dealService.getRelateDeals(this.partyId).subscribe(relatedDeals => {
          this.Related_deals = relatedDeals;
          const ELEMENT_DATA: PeriodicElement[] = relatedDeals;
          this.dataSource = ELEMENT_DATA;
        });

        this.partyService.getPartyRequirementsList(this.dealId, this.partyId).subscribe(reqs => {
          this.requirements = reqs;
          this.completeRequirement = this.requirements.filter(req => {
            return req.complete === true;
          }).length;
          this.openRequirements = this.requirements.length - this.completeRequirement;
        });

        this.bindDocuments();
      }
    });

    this.buildForms();
  }
  bindDocuments() {
    this.partyService.getRequirementDocumentsForParty(this.dealId, this.partyId).subscribe(res => {
      this.reqDocuments = res;
    });
  }

  //   public findInvalidControls() {
  //     const invalid = [];
  //     const controls = this.partyDetailForm.controls;
  //     for (const name in controls) {
  //         if (controls[name].invalid) {
  //             invalid.push(name);
  //         }
  //     }
  //     return invalid;
  // }

  get firstName() {
    return this.partyDetailForm.get('firstName');
  }

  get middleName() {
    return this.partyDetailForm.get('middleName');
  }

  get lastName() {
    return this.partyDetailForm.get('lastName');
  }

  get hostId() {
    return this.partyDetailForm.get('hostId');
  }

  get birthdate() {
    return this.partyDetailForm.get('birthdate');
  }

  get role() {
    return this.partyDetailForm.get('role');
  }

  get email() {
    return this.partyDetailForm.get('email');
  }

  get phone() {
    return this.partyDetailForm.get('phone');
  }

  get phoneMobile() {
    return this.partyDetailForm.get('phoneMobile');
  }

  get street1() {
    return this.partyDetailForm.get('street1');
  }

  get street2() {
    return this.partyDetailForm.get('street2');
  }

  get state() {
    return this.partyDetailForm.get('state');
  }

  get city() {
    return this.partyDetailForm.get('city');
  }

  get zip() {
    return this.partyDetailForm.get('zip');
  }

  get tin() {
    return this.partyDetailForm.get('tin');
  }

  // GET BUS FORM DATA

  get name() {
    return this.partyDetailFormBus.get('name');
  }

  get tinBus() {
    return this.partyDetailFormBus.get('tinBus');
  }

  get phoneBus() {
    return this.partyDetailFormBus.get('phone');
  }

  get hostIdBus() {
    return this.partyDetailFormBus.get('hostId');
  }

  get street1Bus() {
    return this.partyDetailFormBus.get('street1');
  }

  get street2Bus() {
    return this.partyDetailFormBus.get('street2');
  }

  get stateBus() {
    return this.partyDetailFormBus.get('state');
  }

  get cityBus() {
    return this.partyDetailFormBus.get('city');
  }

  get zipBus() {
    return this.partyDetailFormBus.get('zip');
  }

  clearDirty() {
    this.partyDetailForm.markAsPristine();
  }

  clearDirtyBus() {
    this.partyDetailFormBus.markAsPristine();
  }

  getPartyDetails() {
    this.partyService.getPartyDetails(this.dealId, this.partyId).subscribe(partyRes => {
      this.party = partyRes;
    });
  }

  saveParty(party) {

    if (party.participation === '11') {
      this.modalRef = this.confirmService.openConfirmationModal('Party Primary Borrower', 'Are you sure you want to change to Primary?');
      this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
        this.modalRef.close();
      });

      this.modalRef.componentInstance.onConfirmClick.subscribe(d => {
        // Save party code
        this.partyService.put(party).subscribe(res => {
          this.eventEmitterService.UpdatePartyList();
          this.Navigate();
          this.partySave.emit(res);
          this.resetFlags();
          this.modalRef.close();
        });

      });
    } else {
      // Save party code
      this.partyService.put(party).subscribe(res => {
        this.eventEmitterService.UpdatePartyList();
        this.Navigate();
        this.partySave.emit(res);
        this.resetFlags();
      });
    }
  }


  deleteParty(party: any) {
    if (party.primary === true) {
      this.dialog.open(PrimaryDiaglog);
    } else {
      this.modalRef = this.confirmService.openConfirmationModal('Remove Party From Deal', 'Are you sure you want to remove this party?');
      this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {

        this.modalRef.close();
      });
      this.modalRef.componentInstance.onConfirmClick.subscribe(d => {
        // Delete party code
        this.partyService.delete(this.party.dealPartyId).subscribe(res => {
          this.eventEmitterService.UpdatePartyList();
          this.modalRef.close();
          this.Navigate();
        });
      });
    }
  }

  resetFlags() {
    this.getPartyDetails();
    this.editMode = false;
  }

  anyFunctionParties(dealId) {
    if (!this.dealHasPrimaryBorrower) {
      this.partyService.getPartyListForDeal(dealId, "internal").subscribe(parties => {
        parties.forEach(party => {
          if (party.participation === "01" && party.primary === true) {
            this.dealHasPrimaryBorrower = true;
          }
        });
        if (this.dealHasPrimaryBorrower) {
          var elementPos = this.roleType.map(function (x) { return x.name; }).indexOf('Borrower');
          this.roleType.splice(elementPos, 1); // "borrower" location in participants list
        }
      });
    }
  }
  getRoles() {
    this.codeService.getDropdownData('LoanParticipation').subscribe(result => {
      this.roleType = result;
      if (this.dealHasPrimaryBorrower) {
        var elementPos = this.roleType.map(function (x) { return x.name; }).indexOf('Borrower');
        this.roleType.splice(elementPos, 1); // "borrower" location in participants list
      }
    });
  }

  Navigate() {
    this.eventEmitterService.changePartyFull();
  }

}


@Component({
  selector: 'primary-dialog',
  templateUrl: 'primary-dialog.html',
})
export class PrimaryDiaglog {
  constructor(public dialogRef: MatDialogRef<PrimaryDiaglog>) { }
}
