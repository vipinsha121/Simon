import { Component,Input,Output, OnInit,EventEmitter} from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { DealDto,
  DealServiceProxy, PartyServiceProxy, PartyDto, CodeServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import * as _moment from 'moment';
const moment = _moment;
@Component({
  selector: 'app-add-existing-party-form',
  templateUrl: './add-existing-party-form.component.html',
  styleUrls: ['./add-existing-party-form.component.css']
})

export class AddExistingPartyFormComponent implements OnInit {
  @Input() IsOpenFromAddParty;
  @Input() party: any;
  @Input() DealID: any;
  partyDetailForm: FormGroup;
  partyDetailFormCompany: FormGroup;
  dealHasPrimaryBorrower: boolean;
  modalRef: NgbModalRef;
  entityType: Array<any> = [];

  @Output() partySave = new EventEmitter<any[]>();
  roleType: any;

  constructor(private fb: FormBuilder,
              private partyService: PartyServiceProxy,
              private codeService: CodeServiceProxy,
              public confirmService: confirmModalPopupService,
              private eventEmitterService: EventEmitterService,
              public activeModal: NgbActiveModal,
              private router: Router,
  ) {
    // Party Form For Individual
    this.partyDetailForm = this.fb.group({
      role: ['', Validators.required ]
    });

    this.partyDetailForm.get('role').markAsTouched()

    // Party Form For Company
    this.partyDetailFormCompany = this.fb.group({
      type: ['', [ Validators.required] ],
      role: ['', Validators.required ]
    });

    this.partyDetailFormCompany.get('type').markAsTouched()
    this.partyDetailFormCompany.get('role').markAsTouched()

  }

  ngOnInit() {
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

 anyFunctionParties() {
    if (!this.dealHasPrimaryBorrower) {
          this.partyService.getPartyListForDeal(this.DealID, "internal").subscribe(parties => {
                parties.forEach(party => {
                if (party.participation === "01" && party.primary === true) {
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
          this.router.navigateByUrl("/main/deal/" + this.DealID + "/party/" + res.partyId);
        });
      });
    } else {
        // Save party code
        this.partyService.post(party).subscribe(res => {
           this.activeModal.close();
           this.eventEmitterService.UpdatePartyList();
           this.router.navigateByUrl("/main/deal/" + this.DealID + "/party/" + res.partyId);
      });
    }
  }
}
