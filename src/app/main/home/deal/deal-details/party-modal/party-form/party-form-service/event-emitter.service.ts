import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject, Observable } from 'rxjs';
import {
  DealDto, DealServiceProxy, LoanServiceProxy, CodeServiceProxy, RequirementServiceProxy, EcmDocumentManagerServiceProxy,
  MessagingServiceProxy, PartyServiceProxy, CollateralServiceProxy
} from 'src/app/shared/services/service-proxy/service-proxies';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  // private dataSource = new BehaviorSubject('Eric');
  // data = this.dataSource.asObservable();
  Slidercall: Subject<any>;
  private subject = new Subject<any>();
  private subjectLoan = new Subject<any>();
  private PartyFullSubject = new Subject<any>();
  private PartyFormDropdownSubject = new Subject<any>();
  private UpdateStageHistorySubject = new Subject<any>();
  private UpdateDealNameSubject = new Subject<any>();
  private UpdatePartyListEventSubject = new Subject<any>();
  private UpdatePartyDocumentListEventSubject = new Subject<any>();
  private UpdateReqDocumentListEventSubject = new Subject<any>();
  private UpdateDealSubject = new Subject<any>();
  private subjectCollateral = new Subject<any>();
  private subjectCollateralList = new Subject<any>();
  private subjectReqList = new Subject<any>();
  private UpdateDocumentsReqStatuSubject = new Subject<any>();
  private navBarDates = new Subject<any>();


  invokeFirstComponentFunction = new EventEmitter();
  invokeRemoveLoanFunction = new EventEmitter();
  invokeNewLoanFunction = new EventEmitter();
  UpdatePartyListEvent = new EventEmitter();
  invokeUpdatedDatesNavbar = new EventEmitter();


  invokePartyEditFunction = new EventEmitter();
  invokeNavBarToAssignUserName = new EventEmitter();
  invokeNonExistingLoan = new EventEmitter();
  InvokeCloseDropdownRequirementPartyForm = new EventEmitter();
  invokeNewCollateralFunction = new EventEmitter();
  invokeCollateralDetails = new EventEmitter();
  invokeCancelDetails = new EventEmitter();

  subsVar: Subscription;
  rmloan: Subscription;
  newloan: Subscription;
  partyedit: Subscription;
  assignedUserName: Subscription;
  nonExistingLoan: Subscription;
  navbarDates: Subscription;
  requirementDropdownClose: Subscription;
  newCollateral: Subscription;
  loanData: any;
  synergyDocData: any;
  threads: any;
  requirements: any;
  completeRequirement: number = 0;
  openRequirements: number = 0;
  refreshCollateral: Subscription;
  refereshCancelCollateral: Subscription;
  reqType: Array<any> = [];
  newReqId: string;
  collateralData: any;
  collData: any;

  constructor(private loanService: LoanServiceProxy, private activatedRoute: ActivatedRoute, private ecmDocService: EcmDocumentManagerServiceProxy,
    private messageService: MessagingServiceProxy, private partyService: PartyServiceProxy, private codeService: CodeServiceProxy,
    private collateralService: CollateralServiceProxy) {
    this.Slidercall = new BehaviorSubject<any>(null);

  }

  // updatedDataSelection(data: any){
  //   this.dataSource.next(data);
  // }


  onFirstComponentButtonClick() {
    this.invokeFirstComponentFunction.emit();
  }

  UpdatePartyList() {
    // this.UpdatePartyListEvent.emit();
    this.UpdatePartyListEventSubject.next(true);
    return this.UpdatePartyListEventSubject.asObservable();
  }

  UpdatePartyDocumentList() {
    // this.UpdatePartyListEvent.emit();
    this.UpdatePartyDocumentListEventSubject.next(true);
    return this.UpdatePartyDocumentListEventSubject.asObservable();
  }
  UpdateReqDocumentList() {
    // this.UpdatePartyListEvent.emit();
    this.UpdateReqDocumentListEventSubject.next(true);
    return this.UpdateReqDocumentListEventSubject.asObservable();
  }

  // UpdateDealName(){
  //   this.UpdateDealNameSubject.next('true');
  //   return this.UpdateDealNameSubject.asObservable();
  // }
  updateDeals() {
    this.UpdateDealSubject.next('true');
    return this.UpdateDealSubject.asObservable();
  }

  //Used to get default view after remove loan
  onRemoveLoanButtonClick() {
    this.invokeRemoveLoanFunction.emit();
  }

  //Used to open new loan form.
  onNewLoanButtonClick(reqId) {
    this.invokeNewLoanFunction.emit(reqId);
  }

  //To open new loan.
  setNewloanReqId(reqId) {
    this.subjectLoan.next(reqId);
  }
  getNewloanReqId() {
    return this.subjectLoan.asObservable();
  }

  navigateToPartyEdit(map) {
    this.invokePartyEditFunction.emit(map);
  }

  onAssignUserName() {
    this.invokeNavBarToAssignUserName.emit();
  }

  onNonExistingloan() {
    this.invokeNonExistingLoan.emit();
  }

  // onUpdateNavbarDates() {
  //   this.invokeUpdatedDatesNavbar.emit();
  // }

  closeDropdownRequirementPartyForm() {
    // this.InvokeCloseDropdownRequirementPartyForm.emit();
    this.PartyFormDropdownSubject.next(true);
    return this.PartyFormDropdownSubject.asObservable();
  }

  closeDropdownRequirementListFromPartyModal() {
    this.PartyFormDropdownSubject.next(true);
    return this.PartyFormDropdownSubject.asObservable();
  }

  setloanlist(dealId: any) {
    this.loanService.getLoansForDeal(dealId).subscribe(res => {
      this.loanData = res;
      this.subject.next(this.loanData);
    });
  }

  getloanlist() {
    return this.subject.asObservable();
  }

  setSynergyDoclist(dealId: any) {
    this.ecmDocService.getDealEcmDocumentsList(dealId).subscribe(res => {
      this.synergyDocData = res;
      this.subject.next(this.synergyDocData);
    });
  }

  getSynergyDoclist() {
    return this.subject.asObservable();
  }

  changePartyFull() {
    this.PartyFullSubject.next(true);
    return this.PartyFullSubject.asObservable();
  }

  UpdateStageHistory() {
    this.UpdateStageHistorySubject.next('true');
    return this.UpdateStageHistorySubject.asObservable();
  }

  UpdateDocumentsReqStatus(){
    this.UpdateDocumentsReqStatuSubject.next();
    return this.UpdateDocumentsReqStatuSubject.asObservable();
  }

  setThread(dealId: any, userId: any) {
    this.messageService.getDealConversations(dealId, userId).subscribe(res => {
      this.threads = res;
      this.subject.next(this.threads);
    });
  }

  getThread() {
    return this.subject.asObservable();
  }

  //Used to open new loan form.
  onNewCollateralButtonClick() {
    this.invokeNewCollateralFunction.emit();
  }

  setDocumentCount(dealId: any, partyId: any) {
    this.partyService.getPartyRequirementsList(dealId, partyId).subscribe(reqs => {
      this.requirements = reqs;
      this.completeRequirement = this.requirements.filter(req => {
        return req.complete === true;
      }).length;
      this.openRequirements = this.requirements.length - this.completeRequirement;
      this.subject.next(this.requirements);
    });
  }

  getDocumentCount() {
    return this.subject.asObservable();
  }

  // Use to open specific tab like Details 
  setAddNewCollateral(collId) {
    //debugger;
    this.subjectCollateral.next(collId);
  }

  getAddNewCollateral() {
    //debugger;
    return this.subjectCollateral.asObservable();
  }

  onRefreshCollateral() {
    this.invokeCollateralDetails.emit();
  }

  // onSetCloseRefreshCollateralListAddCancel(dealId : any) {
  //   //debugger
  //   this.collateralService.getCollateralForDeal(dealId).subscribe(res => {
  //     this.collateralData = res;
  //     this.subjectCollateralClose.next(this.collateralData);
  //   });
  // }

  // onGetCloseRefreshCollateralListAddCancel() {
  //   return this.subjectCollateralClose.asObservable();
  // }

  setCollateralList(dealId: any) {
    this.collateralService.getCollateralForDeal(dealId).subscribe(res => {
      this.collData = res;
      this.subjectCollateralList.next(this.collData);
    });
  }

  getCollateralList() {
    return this.subjectCollateralList.asObservable();
  }

  // On requirement save refresh requirement list in modal pop up
  setReqListInModalPopUp(reqDue: any) {
    this.subjectReqList.next(reqDue);
  }

  // On requirement save get update requirement list in modal pop up
  getReqListInModalPopUp() {
    return this.subjectReqList.asObservable();
  }

  onSetNavbarDates(data : any) {
    this.navBarDates.next(data);
  }

  getGetNavbarDates() {
    return this.navBarDates.asObservable();
  }

}
