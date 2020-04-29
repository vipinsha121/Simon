import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { PartyServiceProxy, PartyUserSearchFilterCustomModel, ParticipantServiceProxy, PartyDto, DealServiceProxy, ConfigServiceProxy, CodeServiceProxy, } from 'src/app/shared/services/service-proxy/service-proxies';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewEncapsulation } from '@angular/core';
import { ExternalService } from '../add-external-participant/external.service';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CustomValidatorsComponent } from '../../shared/validators/custom-validators/custom-validators.component';

const moment = _moment;

export class PartyListModel {
  partyType?: string | undefined;
  companyName?: string | undefined;
  firstName?: string | undefined;
  middleName?: string | undefined;
  lastName?: string | undefined;
  officer?: string | undefined;
  tin?: string | undefined;
  hostId?: string | undefined;
  entityTypeCode?: any | undefined;
  totalRecords?: any | undefined;
  partyId?: any | undefined;
  city?: any | undefined;
  street?: any | undefined;
  state?: any | undefined;
}
export class GetListModel
{
description?:string|undefined;
id?:number | undefined;
text?:string|undefined;
}
export interface State {
  id: number;
  name: string;
  abbrv: string;
}
@Component({
  selector: 'app-add-party',
  templateUrl: './add-party.component.html',
  styleUrls: ['./add-party.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddPartyComponent implements OnInit, OnChanges {
  @Input() title: any;
  @Input() partyType;
  @Input() isOpenedFromExtP;
  stateList: State[];
  map: any;
  DealID: any;
  urlPartyId;
  PartyDealID: Array<any> = [];
  PartyMapID: any;
  partyDetailForm: FormGroup;
  partyDetailFormBus: FormGroup;
  pageEvent: PageEvent;
  IndividualFields: FormGroup;
  CompanyFields: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  AddNewFormI = false;
  AddNewFormC = false;
  Officerr = false;
  date = new FormControl(moment('12-25-1995', ['MM-DD-YYYY', 'YYYY-MM-DD']));
  @Input() party: PartyDto = new PartyDto();
  roleType: any[];
  IndividualColumns: any[] = ['checked', 'partyId', 'firstName', 'middleName', 'lastName', 'tin', 'hostId',
    'street', 'city', 'state', 'officer'];
  entityType: Array<any> = [];
  officers: Array<any> = [];
  CompanyColumns: any[] = ['checked', 'partyId', 'companyName', 'tin', 'hostId', 'street', 'city', 'state', 'officer'];
  OfficerColumns: any[] = ['checked', 'tin', 'hostId', 'street', 'city', 'state', 'officer'];
  dataSource: MatTableDataSource<PartyListModel>;
  Search: PartyUserSearchFilterCustomModel = new PartyUserSearchFilterCustomModel();

  selectPartyType: any;
  modalRef: any;
  IsOpenFromAddParty = false;
  TINmask = [/\d/, /\d/,  /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  disableSaveBtn = false;
  constructor(private PartyServiceProxy: PartyServiceProxy,
              private configService: ConfigServiceProxy,
              private codeService: CodeServiceProxy,
              private partyService: PartyServiceProxy,
              private activatedRoute: ActivatedRoute,
              private eventEmitterService: EventEmitterService,
              public activeModal: NgbActiveModal,
              public confirmService: confirmModalPopupService,
              private ParticipantService: ParticipantServiceProxy,
              private router: Router,
  ) {
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
        Validators.required,
        CustomValidatorsComponent.ssnValidator
      ]),
      hostId: new FormControl(this.party.hostId, [
        Validators.maxLength(50),
        CustomValidatorsComponent.cifValidator
      ]),
      role: new FormControl(this.party.role, [
        Validators.required
      ]),

    });
    this.partyDetailForm.get('firstName').markAsTouched();
    this.partyDetailForm.get('lastName').markAsTouched();
    this.partyDetailForm.get('role').markAsTouched();

    // Party Form For Company
    this.partyDetailFormBus = new FormGroup({
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
      type:  new FormControl(this.party.type, []),
      role:  new FormControl(this.party.role, [
        Validators.required
      ])
    });


    this.partyDetailFormBus.get('name').markAsTouched();
    this.partyDetailFormBus.get('type').markAsTouched();
    this.partyDetailFormBus.get('role').markAsTouched();

    this.IndividualFields = new FormGroup({
      firstName: new FormControl(),
      middleName: new FormControl(),
      lastName: new FormControl()
    });

    this.CompanyFields = new FormGroup({
      companyName: new FormControl(),
    });
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

  get role() {
    return this.partyDetailForm.get('role');
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


  ngOnInit() {
    this.selectPartyType = this.partyType;
    if(this.selectPartyType != null && this.isOpenedFromExtP == true){
      if(this.selectPartyType == 'I'){
        this.addNewPartyI(this.party, false);
      }
      else{
        this.addNewPartyC(this.party, false);
      }
    }
    if (this.router.url.indexOf('party')) {
      this.urlPartyId = true;
    }

    this.configService.getConfigValue('PartySearchTopRows').subscribe(result => {

      this.Search.totalRecords = result.value_10;
      const pageevent: any = {};
    });

    this.ParticipantService.getUsersByRole('Officer').subscribe(res => {
      this.officers = res;
    });

  }

  ngOnChanges() {
    this.dataSource.paginator = this.paginator;
  }

  getSearchData(SearchKey) {
    this.PartyServiceProxy.getPartyUsers(this.Search).subscribe((res: any) => {
      const ELEMENT_DATA: PartyListModel[] = res;
      this.dataSource = new MatTableDataSource<PartyListModel>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    });

  }

  getParty(selectPartyType) {
    this.Search.partyType = selectPartyType.value;

    this.AddNewFormI = false;
    this.AddNewFormC = false;
    // this.selectPartyType = selectPartyType.value
  }


  NewPartyForm_I(Search) {
    this.AddNewFormI = true;
    if(Search){
    this.party.firstName = Search.firstName;
    this.party.middleName = Search.middleName;
    this.party.lastName = Search.lastName;}
    this.party.dealId = this.DealID;
    this.party.type = this.selectPartyType;


    this.codeService.getDropdownData('LoanParticipation').subscribe(result => {
        this.roleType = result;
    });
  }

  NewPartyForm_C(Search) {

    this.AddNewFormC = true;
    this.party.name = Search.companyName;
    this.party.dealId = this.DealID;
    this.party.type = this.Search.partyType;

    this.codeService.getDropdownData('EntityType').subscribe(result => {
      this.entityType = result;
    });
    this.codeService.getDropdownData('LoanParticipation').subscribe(result => {
      this.roleType = result;
    });
  }

  saveParty(party) {
    this.disableSaveBtn = true;
    this.partyService.post(party).subscribe(res => {
      this.eventEmitterService.UpdatePartyList();
      this.activeModal.dismiss();
    });
  }
  getofficer() {
    this.Officerr = true;
  }

  public clearIndividualForm() {
    this.partyDetailForm.reset();
    this.AddNewFormI = false;
  }

  public clearCompanyForm() {
    this.partyDetailFormBus.reset();
    this.AddNewFormC = false;
  }

  checkedParty(partyId, dealId) {
    // this.activeModal.close();
    // this.router.navigateByUrl('/main/deal/' + dealId + '/party/' + partyId);
    // this.PartyDealID = [partyId, dealId];
    // this.PartyMapID = this.PartyDealID.map(data => {
    //   return {
    //     partyId: partyId,
    //     dealId: dealId
    //   }
    // });

    // this.map = new Map();
    // this.map.set("partyId",partyId);
    // this.map.set("dealId",dealId);
    // this.eventEmitterService.navigateToPartyEdit(this.map);
    // this.eventEmitterService.Slidercall.next(this.map);
    // this.eventEmitterService.updatedDataSelection(map);
  }
    addExistingParty(party, IsOpenFromAddParty) {
      this.activeModal.close();
      party.type = party.partyType;
      party.name = party.companyName;
      this.modalRef = this.confirmService.openExistingPartyFormModal('Add Existing Party', this.DealID, party, IsOpenFromAddParty);
    }

    addNewPartyI(party, IsOpenFromAddParty) {
      this.activeModal.close();
      party.type = 'I';
      this.modalRef = this.confirmService.openNewPartyFormModal(this.DealID, party, IsOpenFromAddParty);
    }

    addNewPartyC(party, IsOpenFromAddParty) {
      this.activeModal.close();
      party.type = 'C';
      // party.name = party.companyName;
      // party.tin = party.tin;
      this.modalRef = this.confirmService.openNewPartyFormModal(this.DealID, party, IsOpenFromAddParty);
    }


}
