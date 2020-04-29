import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { LoanServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { parse } from 'querystring';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-summary',
  templateUrl: './loan-summary.component.html',
  styleUrls: ['./loan-summary.component.scss']
})
export class LoanSummaryComponent implements OnInit, OnChanges {

  @Input() dealId: number = 0;
  showOtherLoans: boolean = false;
  loanDetails: any;
  isExistsMultipleLoans: boolean;
  primaryDepartmentName: any;
  sumLoanAmount: number;
  isPrimary: boolean;
  currentDealData: any;
  primaryId: any;
  primaryPurpose: any;
  secondaryPurpose: any;
  primaryProductName: any;
  primaryRequestType: any;
  loanAmount: any;
  primaryLoanAmount: any;
  nonPrimaryDeal: any;

  constructor(private loanService: LoanServiceProxy,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges(changes: any): void {
    this.getDealDetails();
    this.getLoanDetailsApplicationSummary();
  }

  getDealDetails() {
    // Get current deal details specifically DealId
    this.store.select(state => state.deal).subscribe(result => {
      this.currentDealData = result.filter(x => x.active == true)[0];
    })
  }

  getLoanDetailsApplicationSummary() {

    // Get loan details for deal to be displyed in Application Summmary
    // Example, loans , primary loan, department name etc..
    this.loanService.getLoansForDeal(parseInt(this.currentDealData.dealId)).subscribe(data => {
      this.loanDetails = data;
      this.sumLoanAmount = 0;
      
      if (data) {
        // Returns the primary product name (loan) and amount
        data.forEach(value => {
          if (value.primary === true) {
            this.primaryProductName = value.productName;
            this.isPrimary = true;
            this.primaryLoanAmount = value.amount;
            this.primaryId = value.id;
            this.primaryPurpose = value.purposePrimaryName;
            this.secondaryPurpose = value.purposeSecondaryName;
            this.primaryRequestType = value.requestTypeDescription;
          }

          // Returns the non primary product (loan) details like product name, amount etc
           this.nonPrimaryDeal = data.filter(x => {
            return !x.primary;
          });

        });
      }
    });
  }

  toggleBorrowers() {
    this.showOtherLoans = !this.showOtherLoans;
  }

  navigateTo(url, loanId) {
    this.router.navigateByUrl(url + loanId);
  }
}
