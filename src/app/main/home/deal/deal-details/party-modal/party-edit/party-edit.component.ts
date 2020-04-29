import { Component, OnInit, Input } from '@angular/core';
import { DealDto, DealServiceProxy, PartyServiceProxy, CodeServiceProxy, PartyDto } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DealHeaderService } from '../../../deal-header/deal-header.service';
import { Subscription } from 'rxjs';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-party-edit',
  templateUrl: './party-edit.component.html',
  styleUrls: ['./party-edit.component.scss']
})
export class PartyEditComponent implements OnInit {

  @Input() currentDeal: any;

  EditPartyRoles: PartyDto = new PartyDto();
  partyFull: boolean;
  partyId: number = 0;
  dealId: number = 0;
  parties: Array<any> = [];
  isDirtyParties: Array<any> = [];
  partyData: any;
  partyCount: number;
  roleType: Array<any> = [];
  partyRole: any[];
  modalRef: NgbModalRef;
  dealHasPrimaryBorrower : boolean;
  participation: any;
  partyEditForm: FormGroup;
  party: any;
  primaryBorrowerParty :any;

  constructor(private partyService: PartyServiceProxy,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private codeService: CodeServiceProxy,
    public confirmService: confirmModalPopupService,
    ) {

    activatedRoute.parent.params.subscribe(params => {
      this.dealId = params["dealId"];
      this.partyService.getPartyListForDeal(this.dealId, "internal").subscribe(res => {
        this.parties = res;
        this.partyCount = res.length;

      });
    });
  }
  
    
  // getParties() {
  //   return this.parties.sort((a, b) => a.primary - b.primary);

  // }

  ngOnInit() {
    
    this.getPrimaryParties(this.dealId);
    this.codeService.getDropdownData("LoanParticipation").subscribe(result => {
      this.roleType = result;
      
            if(this.dealHasPrimaryBorrower){
                 var elementPos =  this.roleType.map(function (x) { return x.name; }).indexOf('Borrower');
                     this.roleType.splice(elementPos, 1); // "borrower" location in participants list
                  }
    });

    this.partyEditForm = new FormGroup({
      roleType: new FormControl(this.party),
    });
  }

  getChangeRoles(roles, party)
  {  
    party.participation = roles;
    this.party = party;
    party.isPartyDirty = true;
    if(roles == "11"){
         this.participation = roles;
         this.primaryBorrowerParty = party;
    }
  }
  clearDirty() {
    this.partyEditForm.markAsPristine();
  }

  SavePartyRole(party)
  {
          this.isDirtyParties = [];
          this.isDirtyParties = this.parties.filter((party) =>{
                    return party.isPartyDirty == true;
                });
                var primaryborrowerParties = this.isDirtyParties.filter((party) =>{
                    return party.participation == "11";
                });
                var count = primaryborrowerParties.length;
                if(count > 1)
                {
                        this.modalRef = this.confirmService.openErrorModal('Party Primary Borrower','You have selected more than one primary borrower');
                            this.modalRef.componentInstance.onCloseClick.subscribe(d => {
                            this.modalRef.close();
                        });
                }
                else
                {
                      if(this.participation == "11")
                      {
                          this.modalRef = this.confirmService.openConfirmationModal('Party Primary Borrower', 'Are you sure you want to change (' +this.primaryBorrowerParty.name + ') to Primary Borrower?');
                          this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
                          this.modalRef.close();
                         })

                         this.modalRef.componentInstance.onConfirmClick.subscribe(d => {
                         // Save party role code
                          this.modalRef.close();
                         this.partyService.savePartyRoles(this.isDirtyParties).subscribe(res => {
                           this.ResetPartiesToPristine();   
                           this.getPartyList();         
                           this.participation = null;              
                         this.router.navigateByUrl("/main/deal/" + this.dealId + "/party/" + this.partyId);
                         })

                         })
                      } 
                     else 
                      {                    
                        this.partyService.savePartyRoles(this.isDirtyParties).subscribe(res => {
                        this.ResetPartiesToPristine();   
                         this.getPartyList();        
                           // this.modalRef.close();            
                         this.participation = null;                          
                        this.router.navigateByUrl("/main/deal/" + this.dealId + "/party/" + this.partyId);
                         })
                      };
                 }
  }

  ResetPartiesToPristine()
  {
    this.parties.forEach(x => {
      x.isPartyDirty = null;
    });
  }
  getPartyList(){
         this.partyService.getPartyListForDeal(this.dealId, "internal").subscribe(res => {
        this.parties = res;
        this.partyCount = res.length;
            this.ngOnInit(); 
      });
  }

  routeToPartyComponent(p) {
    this.partyId = p.partyId;
    this.router.navigateByUrl("/main/deal/" + this.dealId + "/party/" + this.partyId);
    this.partyFull = false;
    // this.partyId/main/deal/{{dealId}}/party/{{party.partyId}}/
  }
     getPrimaryParties(dealId) {
      if(!this.dealHasPrimaryBorrower){
                this.partyService.getPartyListForDeal(dealId, "internal").subscribe(parties => {
                          parties.forEach(party => {
                      if(party.participation == "01" && party.primary == true){
                          this.dealHasPrimaryBorrower = true;
                      }
                     });
                   if(this.dealHasPrimaryBorrower){
                 var elementPos =  this.roleType.map(function (x) { return x.name; }).indexOf('Borrower');
                     this.roleType.splice(elementPos, 1); // "borrower" location in participants list
                  }
          });
      }
     }

}
