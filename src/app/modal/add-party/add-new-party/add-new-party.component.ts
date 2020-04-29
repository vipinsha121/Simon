import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { DealDto,
  DealServiceProxy, PartyServiceProxy, PartyDto, CodeServiceProxy, ParticipantServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import * as _moment from 'moment';
import { CustomValidatorsComponent } from 'src/app/shared/validators/custom-validators/custom-validators.component';
import { ExternalService } from '../../add-external-participant/external.service';
import { PartyListModel } from '../add-party.component';
const moment = _moment;

@Component({
  selector: 'app-add-new-party',
  templateUrl: './add-new-party.component.html',
  styleUrls: ['./add-new-party.component.css']
})
export class AddNewPartyComponent implements OnInit {
  @Input() IsOpenFromAddParty;
  partyDetailForm: FormGroup;
  partyDetailFormCompany: FormGroup;
  dealHasPrimaryBorrower: boolean;
  modalRef: NgbModalRef;
  entityType: Array<any> = [];
  stateList: Array<any> = [];
  @Input() DealID: any;
  @Output() partySave = new EventEmitter<any[]>();
  roleType: any;
  @Input() party: any;
  date = new FormControl(moment('12-25-1995', ['MM-DD-YYYY', 'YYYY-MM-DD']));
  TINmask = [/\d/, /\d/,  /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  TINbusMask = [/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  phoneMask = [/\d/, /\d/,  /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  filteredCompanies: any;

  constructor(private partyService: PartyServiceProxy,
              private codeService: CodeServiceProxy,
              public confirmService: confirmModalPopupService,
              private eventEmitterService: EventEmitterService,
              public activeModal: NgbActiveModal,
              private router: Router,
              private extSvc: ExternalService,
              private participantService: ParticipantServiceProxy) { }


  buildForms() {
            // Party Form For Individual
            this.partyDetailForm = new FormGroup({
              title: new FormControl(this.party.title, [
                Validators.required,
                Validators.maxLength(10)
              ]),
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
              company: new FormControl(this.party.company, [
                Validators.required,
              ]),
              role: new FormControl(this.party.role, [
                // Validators.required
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
                // CustomValidatorsComponent.zipCodeValidator
              ]),
              phone: new FormControl(this.party.phone, [
                // CustomValidatorsComponent.phoneValidator
              ]),
              phoneMobile: new FormControl(this.party.mobilePhone, [
                // CustomValidatorsComponent.phoneValidator
              ]),
              birthdate: new FormControl([], CustomValidatorsComponent.isDateValid),
              email: new FormControl([]),
              state: new FormControl([])
            });
            this.partyDetailForm.get('title').markAsTouched()
            this.partyDetailForm.get('firstName').markAsTouched()
            this.partyDetailForm.get('lastName').markAsTouched()
            this.partyDetailForm.get('company').markAsTouched()

            // Party Form For Company
            this.partyDetailFormCompany = new FormGroup({
              name:  new FormControl(this.party.name, [
                Validators.required,
                Validators.maxLength(50)
              ]),
              tinBus:  new FormControl(this.party.tin,
                CustomValidatorsComponent.einValidator
              ),
              hostId:  new FormControl(this.party.hostId, [
                CustomValidatorsComponent.cifValidator
              ]),
              type:  new FormControl(this.party.type, [
                Validators.required
              ]),
              role:  new FormControl(this.party.role, [
                // Validators.required
              ]),
              street1:  new FormControl(this.party.street1, [
                Validators.maxLength(50)
              ]),
              street2:  new FormControl(this.party.street2, [
                Validators.maxLength(50)
              ]),
              city:  new FormControl(this.party.city, [
                Validators.maxLength(50)
              ]),
              zip:  new FormControl(this.party.zip, [
                // CustomValidatorsComponent.zipCodeValidator
              ]),
              phone: new FormControl(this.party.phone, [
                // CustomValidatorsComponent.phoneValidator
              ]),
              phoneTwo: new FormControl(this.party.mobilePhone, [
                // CustomValidatorsComponent.phoneValidator
              ]),
              state: new FormControl(this.party.state, [])
            });
            this.partyDetailFormCompany.get('name').markAsTouched()
            this.partyDetailFormCompany.get('type').markAsTouched()
  }

  anyFunctionParties() {
    if (!this.dealHasPrimaryBorrower) {
        this.partyService.getPartyListForDeal(this.DealID, "internal").subscribe(parties => {
          parties.forEach(party => {
            if (party.participation == "01" && party.primary == true) {
                  this.dealHasPrimaryBorrower = true;
            }
          });
          if (this.dealHasPrimaryBorrower) {
              var elementPos =  this.roleType.map(function (x) { return x.name; }).indexOf('Borrower');
              this.roleType.splice(elementPos, 1); // "borrower" location in participants list
              }
        });
    }
  }



  saveParty(party) {
    party.dealId = this.DealID;
    party.partyId = 0;
    if (party.participation === '11') {
        this.modalRef = this.confirmService.openConfirmationModal('Party Primary Borrower', 'Are you sure you want to change to Primary?');
        this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
          this.modalRef.close();
      });

        this.modalRef.componentInstance.onConfirmClick.subscribe(d => {
            // Save party code
        this.modalRef.close();
        this.partyService.post(party).subscribe(res => {
          this.activeModal.close();
          this.eventEmitterService.UpdatePartyList();
          if(this.IsOpenFromAddParty){
          this.router.navigateByUrl("/main/deal/" + this.DealID + "/party/" + res.partyId);}
          this.extSvc.setCompanyData(res);
        });

      });
    } else {
        // Save party code
        this.partyService.post(party).subscribe(res => {
           this.activeModal.close();
           this.eventEmitterService.UpdatePartyList();
           if(this.IsOpenFromAddParty){
           this.router.navigateByUrl("/main/deal/" + this.DealID + "/party/" + res.partyId);}
           this.extSvc.setCompanyData(res);
      });
    }
  }

  openAddPartyModal() {
    this.activeModal.close();
    this.modalRef = this.confirmService.openAddPartyModal('New Party', this.DealID);
  }

  ngOnInit() {
    this.buildForms();
    this.codeService.getDropdownData("UnitedStates").subscribe(result => {
      this.stateList = result;
    });
    this.codeService.getDropdownData("EntityType").subscribe(result => {
      this.entityType = result;
    });

    this.codeService.getDropdownData("LoanParticipation").subscribe(result => {
      this.roleType = result;
      this.anyFunctionParties();
      if (this.dealHasPrimaryBorrower) {
        var elementPos =  this.roleType.map(function (x) { return x.name; }).indexOf('Borrower');
        this.roleType.splice(elementPos, 1); // "borrower" location in participants list
        }
    });
  }

}
