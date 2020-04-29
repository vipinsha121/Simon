import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomValidatorsComponent } from "../../../../../../shared/validators/custom-validators/custom-validators.component";
import {
  CodeServiceProxy, DealServiceProxy,
  PartyDto,
  PartyServiceProxy
} from "../../../../../../shared/services/service-proxy/service-proxies";
import { PeriodicElement, State } from "../party-form/party-form.component";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { confirmModalPopupService } from "../../../../../../modal/confirmService";
import { EventEmitterService } from "../party-form/party-form-service/event-emitter.service";
import { ActivatedRoute } from "@angular/router";
import { SnackbarComponent } from "../../../../../../shared/snackbar/snackbar.component";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Component({
  selector: 'app-party-details',
  templateUrl: './party-details.component.html',
  styleUrls: ['./party-details.component.scss']
})
export class PartyDetailsComponent implements OnInit {

  partyDetailForm: FormGroup;
  partyDetailFormBus: FormGroup;
  party: PartyDto = new PartyDto();
  dealId: number = 0;
  partyId: number = 0;
  roleType: Array<any> = [];
  dealHasPrimaryBorrower: boolean;
  modalRef: NgbModalRef;
  editMode: boolean;
  minDate = new Date(1900, 0, 1);
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
  DealID: any;
  snackBarRef: any;
  entityType: Array<any> = [];
  configSuccess: MatSnackBarConfig = {
    panelClass: 'u-background-green-light',
  };
  configCancel: MatSnackBarConfig = {
    panelClass: 'u-background-red',
  };
  TINmask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  TINbusMask = [/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  constructor(private partyService: PartyServiceProxy,
    private codeService: CodeServiceProxy,
    public confirmService: confirmModalPopupService,
    private eventEmitterService: EventEmitterService,
    private activatedRoute: ActivatedRoute,
    private dealService: DealServiceProxy,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log('Route data', history.state.data);
    if (history.state.data) {
      this.dealId = history.state.data.dealId;
      this.partyId = history.state.data.partyId;
    }

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
      }
    });

    this.buildForms();
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
          //this.partySave.emit(res);
          this.resetFlags();
          this.modalRef.close();
        });

      });
    } else {
      // Save party code
      this.partyService.put(party).subscribe(res => {
        this.eventEmitterService.UpdatePartyList();
        this.Navigate();
        //this.partySave.emit(res);
        this.resetFlags();
      });
    }
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

  resetFlags() {
    this.getPartyDetails();
    this.editMode = false;
  }
  Navigate() {
    this.eventEmitterService.changePartyFull();
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

}
