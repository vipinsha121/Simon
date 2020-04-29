import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConfirmModalComponent } from './confirm-model.component';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from './error-modal.component';
import { QuickViewModalComponent } from '../main/home/deal/reports/quickview-modal.component';
import { LoanAdminComponent } from '../main/home/toolbar/loanadmin/loanadmin.component';
import { RequirementsDueComponent } from '../main/home/deal/deal-details/requirementsdue-modal/requirementdue-modal.component';
import { UserProfileModalComponent } from './userprofile-model/userprofile-model.component';
import { OutOfOfficeModalComponent } from './outofoffice-modal/outofoffice-modal.component';
import { ManageParticipationModalComponent } from './manageparticipation-modal/manageparticipation-modal.component';
import { DealQuickViewModalComponent } from './dealquickview-modal/dealquickview-modal.component';
import { RequirementAddComponent } from './requirement-add/requirement-add.component';
import { DocumentAddComponent } from './document-add/document-add.component';
import { ReportApprovalModalComponent } from './report/report-approval-modal.component';
import { AssignModalComponent } from '../modal/assign-deal/assign-modal.component';
import { AddPartyComponent } from './add-party/add-party.component';
import { RemoveLoanConfirmModalComponent } from './removeloanconfirmation/removeloanconfirmation.component';
import { ParticipantModalComponent } from '../modal/show-participant/participant-modal.component';
import { DocumentEditComponent } from './document-edit/document-edit.component';
import { DeleteParticipantModalComponent } from '../modal/delete-participant/delete-participant-modal.component';
import { DocumentsUploadComponent } from '../shared/documents-upload/documents-upload.component';
import { StageChangeComponent } from '../modal/stage-change/stage-change.component'
import { RequiredLoanFieldsComponent } from '../modal/required-loan-fields/required-loan-fields.component'
import { ReqQuestionModalComponent } from './req-question/req-question.component';
import { AddManualRequrementComponent } from './add-manual-requrement/add-manual-requrement.component';
import { AddParticipantModalComponent } from './add-participant-modal/add-participant-modal.component';
import { RequirementDetailsComponent } from '../shared/requirements-list/requirement-details/requirement-details.component';
import { RequirementsListComponent } from '../shared/requirements-list/requirements-list.component';
import { AddExternalParticipantModalComponent } from './add-external-participant-modal/add-external-participant-modal.component';
import { RelatedDocumentsComponent } from './related-documents/related-documents.component';
import { GlobalRemoveModalComponent } from './global-remove-modal/global-remove-modal.component';
import { AddExistingPartyFormComponent } from './add-party/add-existing-party-form/add-existing-party-form.component';
import { AddNewPartyComponent } from './add-party/add-new-party/add-new-party.component';
import { AddExternalParticipantComponent } from './add-external-participant/add-external-participant.component';
import { AddparticipantModelComponent } from './add-internal-participant/add-internal-participant.component';
import { HistoryModalComponent } from './history-modal/history-modal.component';
import { ParticipantEditComponent } from './participant-edit-modal/participant-edit.component';

@Injectable()
export class confirmModalPopupService {


  constructor(private modalService: NgbModal,
    public activeModal: NgbActiveModal) { }
  modalRef: NgbModalRef;

  ModalConfig: NgbModalOptions = {
  };

  openConfirmationModal(title: string, reportLoanData: any) {
    this.modalRef = this.modalService.open(ConfirmModalComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.reportLoanData = reportLoanData;
    return this.modalRef;
  }

  openErrorModal(modaltitle: string, message: string) {
    this.modalRef = this.modalService.open(ErrorModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.modaltitle = modaltitle;
    this.modalRef.componentInstance.message = message;
    return this.modalRef;
  }

  openQuickViewModal(title: string) {
    this.modalRef = this.modalService.open(QuickViewModalComponent, { size: 'sm' });
    this.modalRef.componentInstance.title = title;
    return this.modalRef;
  }

  openparticipantModal(title: string, participant: any = {}) {
    this.modalRef = this.modalService.open(LoanAdminComponent);
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.participant = participant;
    return this.modalRef;
  }

  openExternalParticipantModal(title: string, participant: any = {}) {
    this.modalRef = this.modalService.open(LoanAdminComponent);
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.participant = participant;
    return this.modalRef;
  }
  openRequirementDueModal(reqList: Array<any>) {
    this.modalRef = this.modalService.open(RequirementsListComponent, { size: 'lg' });
    this.modalRef.componentInstance.requirementList = reqList;
    return this.modalRef;
  }

  openUserProfileModal(title: string) {
    this.modalRef = this.modalService.open(UserProfileModalComponent);
    this.modalRef.componentInstance.title = title;
    return this.modalRef;
  }

  openoutofofficeModal(title: string) {
    this.modalRef = this.modalService.open(OutOfOfficeModalComponent);
    this.modalRef.componentInstance.title = title;
    return this.modalRef;
  }
  openManageParticipationModal(title: string) {
    this.modalRef = this.modalService.open(ManageParticipationModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.title = title;
    return this.modalRef;
  }

  openDealQuickVeiwModal(title: string, dealId: string) {
    this.modalRef = this.modalService.open(DealQuickViewModalComponent, { size: 'sm' });
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.dealId = dealId;
    return this.modalRef;
  }

  openRequirementAddModal(title: string) {
    this.modalRef = this.modalService.open(RequirementAddComponent);
    this.modalRef.componentInstance.title = title;
    return this.modalRef;
  }

  openDocumentAddModal(requirement: any) {
    this.modalRef = this.modalService.open(DocumentAddComponent);
    this.modalRef.componentInstance.requirement = requirement;
    return this.modalRef;
  }

  openDocumentEditModal(currentDocument: any, requirement: any) {
    this.modalRef = this.modalService.open(DocumentEditComponent);
    this.modalRef.componentInstance.currentDocument = currentDocument;
    this.modalRef.componentInstance.requirement = requirement;
    return this.modalRef;
  }

  showReportAddModal(title: string, queryId: string, dealId: number) {
    this.modalRef = this.modalService.open(ReportApprovalModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.queryName = queryId;
    this.modalRef.componentInstance.dealId = dealId;
    return this.modalRef;
  }

  openAssignModal(title: string) {
    this.modalRef = this.modalService.open(AssignModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.title = title;
    return this.modalRef;
  }

  openAddPartyModal(title: string, DealID: any, partyType?: any, isOpenedFromExtP?:boolean, party?: any) {
    this.modalRef = this.modalService.open(AddPartyComponent, { windowClass: 'modal-window-xl' });
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.DealID = DealID;
    this.modalRef.componentInstance.partyType = partyType;
    this.modalRef.componentInstance.isOpenedFromExtP = isOpenedFromExtP;
    this.modalRef.componentInstance.party = party;
    return this.modalRef;
  }

  openExistingPartyFormModal(title: string, DealID: any, party: any, IsOpenFromAddParty) {
    this.modalRef = this.modalService.open(AddExistingPartyFormComponent, { size: 'lg' });
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.DealID = DealID;
    this.modalRef.componentInstance.party = party;
    this.modalRef.componentInstance.IsOpenFromAddParty = IsOpenFromAddParty;
    return this.modalRef;
  }

  openNewPartyFormModal(DealID: any, party: any, IsOpenFromAddParty) {
    this.modalRef = this.modalService.open(AddNewPartyComponent, { size: 'lg' });
    this.modalRef.componentInstance.DealID = DealID;
    this.modalRef.componentInstance.party = party;
    this.modalRef.componentInstance.IsOpenFromAddParty = IsOpenFromAddParty;
    return this.modalRef;
  }

  openRemoveLoanConfirmationModal(title: string, loanMessage: any, isCollAssociated: boolean) {
    this.modalRef = this.modalService.open(GlobalRemoveModalComponent);
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.loanMessage = loanMessage;
    this.modalRef.componentInstance.isCollAssociated = isCollAssociated;
    return this.modalRef;
  }

  openCommonConfirmationModal(title: string, message: string) {
    this.modalRef = this.modalService.open(RemoveLoanConfirmModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.loanMessage = message;
    return this.modalRef;
  }

  openCommonRemoveModal(title: string, message: string) {
    this.modalRef = this.modalService.open(GlobalRemoveModalComponent);
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.loanMessage = message;
    return this.modalRef;
  }

  openParticipantListModal(title: string) {
    this.modalRef = this.modalService.open(ParticipantModalComponent);
    this.modalRef.componentInstance.title = title;
    return this.modalRef;
  }

  openAddParticipantModal(title: string) {
    this.modalRef = this.modalService.open(AddparticipantModelComponent);
    this.modalRef.componentInstance.title = title;
    return this.modalRef;
  }

  // openAddExternalParticipantModal(title: string) {
  //   this.modalRef = this.modalService.open(AddExternalParticipantComponent);
  //   this.modalRef.componentInstance.title = title;
  //   return this.modalRef;
  // }

  showParticipantDeleteModal(participantType: string, participant: any) {
    //debugger;
    this.modalRef = this.modalService.open(DeleteParticipantModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.participant = participant;
    this.modalRef.componentInstance.participantType = participantType;
    return this.modalRef;
  }

  openDocumentUploadModal(currentDeal) {
    this.modalRef = this.modalService.open(DocumentsUploadComponent, { size: 'sm' });
    this.modalRef.componentInstance.currentDeal = currentDeal;
    return this.modalRef;
  }

  openSendStageModal(dealId: any, statusCode: any) {
    this.modalRef = this.modalService.open(StageChangeComponent, { size: 'lg' });
    this.modalRef.componentInstance.dealId = dealId;
    this.modalRef.componentInstance.statusCode = statusCode;
    return this.modalRef;
  }

  openRequiredFieldModal(reqFields: Array<any>) {
    this.modalRef = this.modalService.open(RequiredLoanFieldsComponent, { size: 'lg' });
    this.modalRef.componentInstance.requiredLoanFields = reqFields;
    return this.modalRef;
  }

  openReqQuestionModal(req: any, openReqQuestion: any) {
    this.modalRef = this.modalService.open(ReqQuestionModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.requirement = req;
    this.modalRef.componentInstance.openReqQuestionModal = openReqQuestion;
    return this.modalRef;
  }

  openAddManualRequrement(dealId, isOpenFromDocPortlet, currentDoc) {
    this.modalRef = this.modalService.open(AddManualRequrementComponent, { windowClass: 'modal-window-sm' });
    this.modalRef.componentInstance.currentDeal = dealId;
    this.modalRef.componentInstance.isOpenFromDocPortlet = isOpenFromDocPortlet;
    this.modalRef.componentInstance.currentDoc = currentDoc;
    return this.modalRef;
  }

  openSelectedReqModal(requirement, dealId, stageHistory) {
    this.modalRef = this.modalService.open(RequirementDetailsComponent, { size: 'lg' });
    this.modalRef.componentInstance.requirement = requirement;
    this.modalRef.componentInstance.dealId = dealId;
    this.modalRef.componentInstance.stageHistory = stageHistory;
    return this.modalRef;
  }

  openRelatedSelectedModal(docTypes, currentDealiD, RelatedSelectedDocuments) {
    this.modalRef = this.modalService.open(RelatedDocumentsComponent, { size: 'lg' });
    this.modalRef.componentInstance.docTypes = docTypes;
    this.modalRef.componentInstance.currentDealiD = currentDealiD;
    this.modalRef.componentInstance.RelatedSelectedDocuments = RelatedSelectedDocuments;
    return this.modalRef;
  }

  openAddExternalParticipantModal(dealId) {
    this.modalRef = this.modalService.open(AddExternalParticipantComponent);
    this.modalRef.componentInstance.dealId = dealId;
    return this.modalRef;
  }

  openAddParticipantPerson() {
    this.modalRef = this.modalService.open(AddparticipantModelComponent);
    return this.modalRef;
  }

  openHistoryModal(title, summaryList: any) {
    this.modalRef = this.modalService.open(HistoryModalComponent);
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.summaryList = summaryList;
    return this.modalRef;
  }

  openRequirementDueModalInPopUp(reqList: Array<any>, isStageChange: boolean, grpCode: any) {
    this.modalRef = this.modalService.open(RequirementsListComponent, { size: 'lg' });
    this.modalRef.componentInstance.requirementList = reqList;
    this.modalRef.componentInstance.isStageChangeClick = isStageChange;
    this.modalRef.componentInstance.groupCode = grpCode;
    return this.modalRef;
  }

  openEditParticipantModal() {
    this.modalRef = this.modalService.open(ParticipantEditComponent);
    return this.modalRef;
  }
}
