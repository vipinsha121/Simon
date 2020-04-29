import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { confirmModalPopupService } from '../confirmService';
import { map, startWith } from 'rxjs/operators';
import { GetListModel } from '../add-party/add-party.component';
import { ParticipantServiceProxy, UserDropdownCustomModel, MessagingServiceProxy, CodeServiceProxy, UserServiceProxy, PartyServiceProxy, DealParticipantDto } from '../../shared/services/service-proxy/service-proxies';
import { Alert } from 'selenium-webdriver';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-addparticipant-model',
  templateUrl: './add-internal-participant.component.html',
  styleUrls: ['./add-internal-participant.component.css']
})

export class AddparticipantModelComponent implements OnInit {
  public userdata: any;
  public userid: any;
  public primaryrole: any;
  public primary: any;
  filteredUsers: GetListModel[];
  participantForm: FormGroup;
  party: UserDropdownCustomModel = new UserDropdownCustomModel();
  partydata: DealParticipantDto = new DealParticipantDto;
  Users: GetListModel[] | any;
  dealId: any;
  currentUser: any;
  modalRef: NgbModalRef;
  constructor(private _participantserviceproxy: ParticipantServiceProxy,
    public activeModal: NgbActiveModal,
    private FormBuilder: FormBuilder,
    private codeService: CodeServiceProxy,
    private confirmService: confirmModalPopupService,
    private _userService: UserServiceProxy,
    private router: Router,
    private localStorageService: LocalstorageService,
    private _messagingserviceproxy: MessagingServiceProxy,
    private _partyserviceproxy: PartyServiceProxy) {
    this.participantForm = this.FormBuilder.group({
      participantName: ['', [
        Validators.required
      ]],
      participantRole: ['', [
        Validators.required
      ]],
      interim: ['', [

      ]]
    });

  }
  data = [];
  title = 'Add Participant';
  selectedValue: any
  checked: boolean;
  participants: any;

  mycontrol = new FormControl();


  ngOnInit() {

    this._participantserviceproxy.getUsersForDropdown().subscribe((res: any) => {
      const ELEMENT_DATA: GetListModel[] = res;
      this.Users = res;
    })

    let url = this.router.url.split('/')
    this.dealId = url[url.length - 1];
    this.currentUser = this.localStorageService.get("currentUser");

  }
  participantmethod(string) {
    this._userService.primaryRole(string).subscribe((res: any) => res)
  }

  participantList() {
    this.filteredUsers = this.Users.filter((user: GetListModel) => user.text.toLocaleLowerCase().indexOf(this.partydata.personName.toLocaleLowerCase()) !== -1);
  }

  getPrimaryRoles(value) {
    this.codeService.getDropdownData("InternalParticipation").subscribe(result => {
      this.participants = result;
    });
    this.userid = value;
    this._userService.primaryRole(value).subscribe((res: any) => { 
      this.primary = res;
      if(this.primary.primaryRole !== 'OFFICER'){
        this.participants.shift();
      }
    } );
  }

  checkValidParticipant(): boolean {
    if (this.Users.some(user => user.text.toLocaleLowerCase() === this.partydata.personName.toLocaleLowerCase())) {
      return true
    }
    else {
      return false
    }
  }

  postparticipant() {
    this.partydata.createUserId = this.currentUser.userId;
    this.partydata.dealId = this.dealId;
    this.partydata.personId = this.userid;

    if (this.partydata.participationId == "91") {
      this.modalRef = this.confirmService.openConfirmationModal('Add Internal Participation', 'Are you sure you want to Change this Officer to the Primary Officer?');
      this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
        this.modalRef.close();
      });

      this.modalRef.componentInstance.onConfirmClick.subscribe(d => {
        this.saveInternalParticipant();
          this.modalRef.close();
      });
    }

    else {
      this.saveInternalParticipant();
    }
  }
  saveInternalParticipant() {
    this._participantserviceproxy.post(this.partydata).subscribe(res => {
      res;
      this.activeModal.close();
      this.modalRef = this.confirmService.openParticipantListModal('Internal Participants');
    });

   }
}

