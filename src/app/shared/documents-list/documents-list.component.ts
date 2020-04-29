import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { DocumentServiceProxy, LoanServiceProxy, RequirementServiceProxy, PartyServiceProxy } from '../services/service-proxy/service-proxies';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.css']
})
export class DocumentsListComponent implements OnInit {
  @Input() reqDocuments: any;
  modalRef: NgbModalRef;
  @Input() dealId: number = 0;
  @Input() loanId: number = 0;
  @Input() partyId: number = 0;
  @Input() IsFromParty;
  @Input() IsFromLoan;
  requirementDetails: any;
  searchText : string;
  UpdatePartyDocumentListsubscription: Subscription;

  constructor(public confirmService: confirmModalPopupService,
    private documentService: DocumentServiceProxy,
    private loanService: LoanServiceProxy,
    private partyService: PartyServiceProxy,
    private eventEmitterService: EventEmitterService,
    private requirementService: RequirementServiceProxy,) { }

  ngOnInit() {    
    this.partyService.getRequirementDocumentsForParty(this.dealId, this.partyId).subscribe(res => {
          this.reqDocuments = res;
        });
    this.UpdatePartyDocumentListsubscription = this.eventEmitterService.UpdatePartyDocumentList().subscribe(x => {
         this.partyService.getRequirementDocumentsForParty(this.dealId, this.partyId).subscribe(res => {
          this.reqDocuments = res;
        })
    });
  }


  removePartydocument(docId, requirementId) {

    this.modalRef = this.confirmService.openConfirmationModal('Document', 'Are you sure you want to remove this document?');
    this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
      this.modalRef.close();
    });
    this.modalRef.componentInstance.onConfirmClick.subscribe(d => {
      //Remove document requirement
      this.documentService.deleteDocumentRequirement(docId, requirementId).subscribe(res => {

        this.partyService.getRequirementDocumentsForParty(this.dealId, this.partyId).subscribe(res => {
          this.reqDocuments = res;
          this.modalRef.close();
        })
      });
    });
  }

  removeLoandocument(docId, requirementId) {
    
    this.modalRef = this.confirmService.openConfirmationModal('Document', 'Are you sure you want to remove this document?');
    this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
      this.modalRef.close();
    });
    this.modalRef.componentInstance.onConfirmClick.subscribe(d => {
      //Remove document requirement
      this.documentService.deleteDocumentRequirement(docId, requirementId).subscribe(res => {

        this.modalRef.close();
        this.loanService.getRequirementDocumentsForLoan(this.dealId, this.loanId).subscribe(data => {
          
          this.reqDocuments = data;
        });
      });
    });
  }

  editDocument(currentDocument) {

    this.requirementService.getRequirementDetails(this.dealId, currentDocument.requirementId, currentDocument.entityType).subscribe(data => {
      this.requirementDetails = data;
      if (this.requirementDetails) {

        this.modalRef = this.confirmService.openDocumentEditModal(currentDocument, this.requirementDetails);
      }
    })
    //this.modalRef = this.confirmService.openDocumentEditModal(currentDocument, requirement);
  }
}
