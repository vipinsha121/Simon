import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from '../confirmService';
import { PartyServiceProxy, PartyUserSearchFilterCustomModel, ParticipantServiceProxy, CodeServiceProxy, PartyDto } from 'src/app/shared/services/service-proxy/service-proxies';
import { PartyListModel } from '../add-party/add-party.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { ExternalService } from './external.service';

@Component({
  selector: 'app-add-external-participant',
  templateUrl: './add-external-participant.component.html',
  styleUrls: ['./add-external-participant.component.css']
})
export class AddExternalParticipantComponent implements OnInit {

  dealId: any;
  Search: PartyUserSearchFilterCustomModel = new PartyUserSearchFilterCustomModel();
  filteredCompanies: any[];
  isSelected: boolean;
  filteredPerson: any;
  participants: any;
  participantForm: FormGroup;
  party: PartyDto = new PartyDto();
  companyId: any;
  currentUser: any;
  modalRef: NgbModalRef;
  
  constructor(public activeModal: NgbActiveModal,
    private router: Router,
    private confirmService: confirmModalPopupService,
    private FormBuilder: FormBuilder,
    private extSvc: ExternalService,
    private partyService: PartyServiceProxy,
    private participantService: ParticipantServiceProxy,
    private codeService: CodeServiceProxy,
    private activatedRoute: ActivatedRoute,
    private localStorageService : LocalstorageService) {
      this.extSvc.companydata$.subscribe(data => {
        console.log(data);
        if(data.type == "I"){
        this.party.name = data.name; 
        this.party.partyId = data.partyId; }
        if (data.type == "C"){
          this.party.company = data.name;
          this.party.companyId = data.partyId;
          this.isSelected = true;
        }
      });
    this.participantForm = this.FormBuilder.group({
      companyName: ['', [
        Validators.required
      ]],
      person: ['', [
        Validators.required
      ]],
      role: ['', [
        Validators.required
      ]]
    });
  }

  ngOnInit() {

    this.codeService.getDropdownData("ExternalParticipation").subscribe(result => {
      this.participants = result;
    })
    let url = this.router.url.split('/')
    this.dealId = url[url.length-1];
    this.currentUser = this.localStorageService.get("currentUser");
  }


  openAddPartyModal(type) {
      this.party.type = type;
      // this.confirmService.openAddPartyModal('New Party', this.dealId, type, true, this.party);
      this.modalRef = this.confirmService.openNewPartyFormModal(this.dealId, this.party, false);

  }

  getSearchData(SearchKey) {
    this.participantService.searchCompany(this.party.company, 2).subscribe((res: any) => {
      // const ELEMENT_DATA: PartyListModel[] = res;
      this.filteredCompanies = res;
    })
  }

  getPersonByCompany(companyId) {
    this.party.dealId = this.dealId;
    this.party.companyId = companyId;
    this.party.lastModBy = this.currentUser.userId;
    this.isSelected = true;
    this.participantService.getPersonsByCompany(companyId).subscribe(res => {
      this.filteredPerson = res;
    })
  }

  updateParty(person){
    this.party.partyId = person.partyId;
  }

  getSearchPerson() {
    this.participantService.searchPerson(this.party.name, 1).subscribe(res => {
    })
  }


  saveExternalParticipation(party) {
    this.partyService.saveExternalParticipation(party).subscribe(res => {
      this.activeModal.close();
      this.modalRef = this.confirmService.openParticipantListModal("External Participants");
    } );
  }
}
