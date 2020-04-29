import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { DealDto, DealServiceProxy, CodeServiceProxy, ReportServiceProxy, LoanServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppConsts } from 'src/app/shared/app-constants';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { analyzeAndValidateNgModules } from '@angular/compiler';

import * as _moment from 'moment';
const moment = _moment;
@Component({
    selector: 'deal-dates',
    templateUrl: './deal-dates-modal.component.html',
    styleUrls: ['./deal-dates-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class DealDatesComponent implements OnInit, OnChanges {
    @Input() currentDeal: any;
    dealId;
    loanList: any;
    loanListDefault: string;
    activeDeal: Deal;
    dealDates: any;
    dealDates$: Observable<Deal[]>;
    public dates = 1;
    datesFormRecent: any;
    editCopyDates : any = {};
    summary : any = {};
    applicationDate: Date;
    applicationComplete : Date;
    decisionDue: Date;
    conoat : Date;
    estimatedClosing: Date;
    approvedDate : Date;
    appDateDiff : any;
    appDateDiffClose : any;
    appCompleteDiff : any;
    decisionDueDiff : any;
    conoatDiff: any;
    loanAmount: any;
    loanName: any;
    currentUser : any;
    showAppDateDiff: string;
    showAppCompleteDiff: string;
    showCLosingDiff: string;
    showDecisionDueDiff: string;
    showConoatDiff: string;
    SelectedLone: any;
    appDateLoan : any = {};
    appCompleteLoan : any = {};
    decisionDueLoan : any = {};
    closingDateLoan : any = {};
    approvedLoan : any = {};
    conoatLoan : any = {};

    tooltipOptions = {
      'tooltip-class': 'tooltip-font-size-md'
    };
    constructor(private loanService: LoanServiceProxy,
                private activatedRoute: ActivatedRoute,
                private DealService: DealServiceProxy,
                private eventEmitterService : EventEmitterService,
                private store: Store<AppState>) {
                  this.datesFormRecent = new FormGroup({
                    applicationDate: new FormControl({value: '', disabled: true}),
                    applicationComplete: new FormControl({value: '', disabled: true}),
                    decisionDue: new FormControl({value: '', disabled: true}),
                    conoat: new FormControl({value: '', disabled: true}),
                    estimatedClosing: new FormControl({value: '', disabled: true}),
                    approvedDate: new FormControl({value: '', disabled: true}),
                  });
                }

    setValuesDatesFormRecent() {
      this.datesFormRecent.setValue({
        applicationDate: this.dealDates.applicationDate,
        applicationComplete: this.dealDates.applicationCompleteDate,
        decisionDue: this.dealDates.decisionDueDate,
        conoat: this.dealDates.conoatDate,
        estimatedClosing: this.dealDates.estimatedClosingDate,
        approvedDate: this.dealDates.approvedDate
      });
      this.setLoanDetails(this.dealDates);
    }

    getDealSpecificDates() {
      this.dealDates$.subscribe(result => {
          this.activeDeal = result.filter(x => x.active === true)[0];
          if (this.activeDeal) {
              this.DealService.getDealDates(parseInt(this.activeDeal.dealId)).subscribe(res => {
                  this.dealDates = res;
                  this.setValuesDatesFormRecent();
              });
          }
      });
    }

    ngOnChanges() {
    }

    ngOnInit() {
      this.dealDates$ = this.store.select(state => state.deal);
      this.store.select(state => state.currentUser).subscribe(result => {
      this.currentUser = result;
    });
      this.activatedRoute.parent.params.subscribe(params => {
        this.dealId = params.dealId;
      });

      this.getDealLoans();
      this.getDealSpecificDates();
      this.calculateDateDiff();
    }

   assignLoanDates(loan)  {
            this.SelectedLone = loan.value;
            loan = loan.value;
            // this.loanName = loan.productName;
            // this.loanAmount = loan.amount;
            this.assignLoanNames(loan);
            this.summary.selectedLoan = loan;
            if (loan) {
                this.summary.applicationDate = loan.applicationDate;
                this.summary.applicationComplete = loan.applicationCompleteDate;
                this.summary.estimatedClosing = loan.estimatedClosingDate;     
                     if (loan.applicationCompleteDate != null && loan.decisionDueDate != null) {
                    var decduedate = new Date(loan.applicationCompleteDate);
                    this.summary.decisionDue = new Date();
                    this.summary.decisionDue.setDate(decduedate.getDate() + 30);
                }
                else {
                    this.editCopyDates.decisionDueDate = this.decisionDue;
                }   
                this.loanService.getLoanConoatDate(loan.id,this.dealId,'CONOAT').subscribe(date => {
                 this.summary.conoat = date;
                 this.calculateDateDiff();
                 if(date == null && loan.applicationCompleteDate != null){
                           this.loanService.getLoanConoatDate(loan.id,this.dealId,'DecisionDueDate').subscribe(date => {
                                 this.summary.decisionDue = date;
                                 this.calculateDateDiff();
                           });
                 }
                });  
                this.datesFormRecent.get('applicationDate').enable();
                this.datesFormRecent.get('applicationComplete').enable();
                this.datesFormRecent.get('estimatedClosing').enable()
                this.datesFormRecent.get('conoat').enable();
                //    this.datesFormRecent = new FormGroup({
                //     applicationDate: new FormControl({value: this.summary.applicationDate, disabled: false}),
                //     applicationComplete: new FormControl({value: this.summary.applicationComplete, disabled: false}),
                //     decisionDue: new FormControl({value: '', disabled: true}),
                //     conoat: new FormControl({value: '', disabled: false}),
                //     estimatedClosing: new FormControl({value: this.summary.estimatedClosing, disabled: false}),
                //     approvedDate: new FormControl({value: '', disabled: false})
                //   });
            }          
        };
        getDealLoans(){
               this.loanService.getLoansForDeal(this.dealId).subscribe(res => {
               this.loanList = res;
              });
        }


        calculateDateDiff() {
            if (this.summary) {
                if (this.summary.applicationDate) {
                    this.appDateDiff = this.getAppDateDiffClose(this.summary.applicationDate);
                    if(this.appDateDiff > 0){
                        if(this.appDateDiff < 30){this.showAppDateDiff = 'due';}
                        else{this.showAppDateDiff = 'approaching';}
                    }
                    else{this.showAppDateDiff = 'closed';
                          this.appDateDiff = this.appDateDiff * -1}
                }
                if (this.summary.estimatedClosing) {
                    this.appDateDiffClose = this.getAppDateDiffClose(this.summary.estimatedClosing);
                       if(this.appDateDiffClose > 0){
                        if(this.appDateDiffClose < 30){this.showCLosingDiff = 'due';}
                        else{this.showCLosingDiff = 'approaching';}
                    }
                    else{this.showCLosingDiff= 'closed';
                 this.appDateDiffClose = this.appDateDiffClose * -1}
                }
                if (this.summary.applicationComplete) {
                    this.appCompleteDiff = this.getAppDateDiffClose(this.summary.applicationComplete);
                       if(this.appCompleteDiff > 0){
                        if(this.appCompleteDiff < 30){this.showAppCompleteDiff = 'due';}
                        else{this.showAppCompleteDiff = 'approaching';}
                    }
                    else{this.showAppCompleteDiff = 'closed';
                       this.appCompleteDiff = this.appCompleteDiff * -1}
                }
                if (this.summary.decisionDue) {
                    this.decisionDueDiff = this.getAppDateDiffClose(this.summary.decisionDue);
                       if(this.decisionDueDiff > 0){
                        if(this.decisionDueDiff < 30){this.showDecisionDueDiff = 'due';}
                        else{this.showDecisionDueDiff = 'approaching';}
                    }
                    else{this.showDecisionDueDiff = 'closed';
                         this.decisionDueDiff = this.decisionDueDiff * -1}
                }
                if (this.summary.conoat) {
                    this.conoatDiff = this.getAppDateDiffClose(this.summary.conoat);
                       if(this.conoatDiff > 0){
                        if(this.conoatDiff < 30){this.showConoatDiff = 'due';}
                        else{this.showConoatDiff = 'approaching';}
                    }
                    else{this.showConoatDiff = 'sent';
                    this.conoatDiff = this.conoatDiff * -1}
                }
            }
        }

        getAppDateDiffClose(closeDate) {
            if (closeDate) {
                closeDate = moment(closeDate);
                var currDate = moment();
                var diffClose = closeDate.diff(currDate, 'days');
                return diffClose;
            }
        };

        saveLoansDates(summary) {
            if (summary.applicationDate && summary.estimatedClosing) {
                if (summary.isSaveForAllLoans) {
                    this.loanService.getLoansForDeal(this.dealId).subscribe(data => {
                            var loans = data;
                            loans = data.filter(function (obj) {
                                return obj.active == true || obj.active == null;
                            });
                            loans.forEach((loan,array) => {
                                var saveLoan = loan;
                                saveLoan.lastModBy = this.currentUser.userId;
                                if (summary.closingDateChanged) {
                                    saveLoan.estimatedClosingDate = summary.estimatedClosing;
                                }
                                if (summary.appDateChanged) {
                                    saveLoan.applicationDate = summary.applicationDate;
                                }
                                if (summary.appCompleteDateChanged) {
                                    saveLoan.applicationCompleteDate = summary.applicationComplete;
                                }
                                if (summary.conoatDateChanged) {
                                    saveLoan.conoatDate = summary.conoat;
                                }
                                
                                this.loanService.saveLoanDates(saveLoan).subscribe(loan => {
                                    this.summary.closingDateChanged = false;
                                    this.summary.appDateChanged = false;
                                    this.summary.appCompleteDateChanged = false;
                                    this.summary.conoatDateChanged = false;
                                    this.summary.isSaveForAllLoans = false;
                                    this.summary.conoat = loan.conoatDate;  
                                    this.getDealLoans();
                                    this.calculateDateDiff();
                                    this.eventEmitterService.onSetNavbarDates(loan);
                                    //this.eventEmitterService.onUpdateNavbarDates(); 
                                }) ;
                                                                  
                            });
                        });
                }
                else {
                    var saveLoan = summary.selectedLoan;
                    saveLoan.lastModBy = this.currentUser.userId;
                    saveLoan.estimatedClosingDate = summary.estimatedClosing;
                    saveLoan.applicationDate = summary.applicationDate;
                    saveLoan.applicationCompleteDate = summary.applicationComplete;
                    saveLoan.conoatDate = summary.conoat;
                        this.loanService.saveLoanDates(saveLoan).subscribe(loan => {               
                            this.summary.conoat = loan.conoatDate;  
                             this.calculateDateDiff();
                             this.eventEmitterService.onSetNavbarDates(loan);
                            //this.eventEmitterService.onUpdateNavbarDates();   
                      }) ;
                }
            }

        }

        setChangedDate(dateType)
        {
              switch (dateType) {
                case "appDate":
                {
                   if(this.summary.selectedLoan.applicationDate != this.summary.applicationDate){
                       this.summary.appDateChanged = true;
                    }
                }              
                break;
                case "appCompleteDate":
                {
                   if(this.summary.selectedLoan.applicationComplete != this.summary.applicationComplete){
                       this.summary.appCompleteDateChanged = true;
                    }
                }
                break;
                case "closing":
                  {
                   if(this.summary.selectedLoan.estimatedClosing != this.summary.estimatedClosing){
                       this.summary.closingDateChanged = true;
                    }
                }
                break;
                case "conoat":
                  {
                   if(this.summary.selectedLoan.conoat != this.summary.conoat){
                       this.summary.conoatDateChanged = true;
                    }
                }
                break;
              }
        }

        refreshDates(){
            this.ngOnInit();
             this.datesFormRecent = new FormGroup({
                    applicationDate: new FormControl({value: '', disabled: true}),
                    applicationComplete: new FormControl({value: '', disabled: true}),
                    decisionDue: new FormControl({value: '', disabled: true}),
                    conoat: new FormControl({value: '', disabled: true}),
                    estimatedClosing: new FormControl({value: '', disabled: true}),
                    approvedDate: new FormControl({value: '', disabled: true}),
                  });
            
        }

        cancelDates(){
            this.summary.applicationDate = this.SelectedLone.applicationDate;
            this.summary.applicationComplete = this.SelectedLone.applicationCompleteDate;
            this.summary.estimatedClosing = this.SelectedLone.estimatedClosingDate;  
            this.summary.decisionDue = this.SelectedLone.decisionDue; 
            this.summary.conoat = this.SelectedLone.conoat; 
        }

        assignLoanNames(loan){
          this.appDateLoan.appDateLoanName = loan.productName;
         this.appCompleteLoan.appCompleteLoanName  = loan.productName;
         this.decisionDueLoan.decisionDueLoanName  = loan.productName;
         this.closingDateLoan.closingDateLoanName  = loan.productName;
         this.approvedLoan.approvedLoanName  = loan.productName;
         this.conoatLoan.conoatLoanName  = loan.productName;

         this.appDateLoan.appDateLoanAmount = loan.amount;
         this.appCompleteLoan.appCompleteLoanAmount = loan.amount;
         this.decisionDueLoan.decisionDueLoanAmount = loan.amount;
         this.closingDateLoan.closingDateLoanAmount  = loan.amount;
         this.approvedLoan.approvedLoanAmount  = loan.amount;
         this.conoatLoan.conoatLoanAmount  = loan.amount;
        }

        assignDealLoanName(date,type){
            var filterloan;
            switch(type) {
                case 'appDate' :
                {
                filterloan = this.loanList.filter(x => x.applicationDate === date)[0];
                break;
                } 
                case  'appCompleteDate' :
                {
                filterloan = this.loanList.filter(x => x.applicationCompleteDate === date)[0];
                break;
                }
                case  'closingDate' :
                {
                filterloan = this.loanList.filter(x => x.estimatedClosingDate === date)[0];   
                break;
                }
            }
           return filterloan;
         }
    
       setLoanDetails(dealDates){
         var apploan = this.assignDealLoanName(dealDates.applicationDate,'appDate');
         var appcompleteloan =  this.assignDealLoanName(dealDates.applicationCompleteDate,'appCompleteDate');
         var closingdate =  this.assignDealLoanName(dealDates.estimatedClosingDate,'closingDate');
         this.appDateLoan.appDateLoanName = apploan.productName;
         this.appCompleteLoan.appCompleteLoanName  = appcompleteloan.productName;
         this.closingDateLoan.closingDateLoanName  = closingdate.productName;
         this.appDateLoan.appDateLoanAmount = apploan.amount;
         this.appCompleteLoan.appCompleteLoanAmount = appcompleteloan.amount;
         this.closingDateLoan.closingDateLoanAmount  = closingdate.amount;
       }

}
