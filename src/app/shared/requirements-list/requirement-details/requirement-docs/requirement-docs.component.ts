import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { confirmModalPopupService } from "../../../../modal/confirmService";
import { FormBuilder } from "@angular/forms";
import { Subscription } from 'rxjs';
import { Store } from "@ngrx/store";
import { AppState } from "../../../models/app.state";
import { MediaMatcher } from "@angular/cdk/layout";
import {
  CodeServiceProxy,
  DocumentServiceProxy,
  RequirementServiceProxy
} from "../../../services/service-proxy/service-proxies";
import { EventEmitterService } from "../../../../main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-requirement-docs',
  templateUrl: './requirement-docs.component.html',
  styleUrls: ['./requirement-docs.component.scss']
})
export class RequirementDocsComponent implements OnChanges, OnInit {

  @Input() dealId: number;
  @Input() requirementId: number;
  @Input() reqType: string;

  searchText: string;
  requirement: any;
  modalRef: NgbModalRef;
  UpdateReqDocumentListsubscription : Subscription;
  DocumentUpdateSubscription: Subscription;

  constructor(private fb: FormBuilder,
    private store: Store<AppState>,
    private confirmService: confirmModalPopupService,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private documentService: DocumentServiceProxy,
    private requirementService: RequirementServiceProxy,
    private eventEmitterService: EventEmitterService,
    public activeModal: NgbActiveModal) { }

  getRequirementDocuments(){
    this.requirementService.getRequirementDetails(this.dealId, this.requirementId, this.reqType).subscribe(req => {
      this.requirement = req;
 });
  }
  ngOnChanges() {
    this.getDetails();
    this.UpdateReqDocumentListsubscription = this.eventEmitterService.UpdateReqDocumentList().subscribe(x => {
      this.getRequirementDocuments();
    });
  }

  ngOnInit() {
    this.DocumentUpdateSubscription = this.eventEmitterService.UpdateReqDocumentList().subscribe(data => {
      this.getRequirementDocuments();
    });
  }
  getDetails() {
    if (!this.dealId || !this.requirementId || !this.reqType) return;

    this.requirementService.getRequirementDetails(this.dealId, this.requirementId, this.reqType).subscribe(req => {
      this.requirement = req;
    });
  }

  showDocumentAdd(requirement) {
    this.modalRef = this.confirmService.openDocumentAddModal(requirement);
  }

  removeDocument(docId, reqId, partyId) {
    this.modalRef = this.confirmService.openConfirmationModal('Document', 'Are you sure you want to remove this document?');
    this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
      this.modalRef.close();
    });
    this.modalRef.componentInstance.onConfirmClick.subscribe(d => {
      // Remove document requirement
      this.documentService.deleteDocumentRequirement(docId, reqId).subscribe(res => {
        this.modalRef.close();
        this.requirementService.getDocumentsForRequirement(reqId).subscribe(res => {
          this.requirement.documents = res;
          this.eventEmitterService.setDocumentCount(this.dealId, partyId);
          //this.onRequirementUpdate.emit(this.requirement);
        });
      });
    });
  }

  editDocument(currentDocument, requirement) {
    this.confirmService.openDocumentEditModal(currentDocument, requirement)
  }
}
