import {
  Component,
  OnInit,
  Input,
  NgModule,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import {
  DealDto,
  LoanDto,
  DealServiceProxy,
  CodeServiceProxy,
  ReportServiceProxy,
  LoanServiceProxy
} from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppConsts } from 'src/app/shared/app-constants';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'summary-modal',
  templateUrl: './summary-modal.component.html',
  styleUrls: ['./summary-modal.component.scss']
})
export class SummaryModalComponent implements OnInit {
  mediaQuery;
  mobileQuery;
  showBorrowers;
  showLoans;
  showCollateral;
  @Input()
  currentDeal: any;
  summaryData: any;
  isbuttondiv: boolean = false;
  currentDealData: Deal;
  dealData: DealDto;
  loanData: LoanDto;
  summaryHistoryList: Array<any> = [];
  dealId: number = 0;

  private _mobileQueryListener: () => void;
  sumLoanAmount: number;
  primaryDepartmentName: any;
  isPrimary: boolean;
  primaryPurpose: any;
  secondaryPurpose: any;

  constructor(private dealService: DealServiceProxy,
    private reportService: ReportServiceProxy,
    private loanService: LoanServiceProxy,
    private store: Store<AppState>,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private activedRoute: ActivatedRoute) {

    activedRoute.params.subscribe(params => {
      this.dealId = params["dealId"];
    });

    this.mobileQuery = media.matchMedia('(max-width: 800px');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


    store.select(state => state.deal).subscribe(result => {
      this.currentDealData = result.filter(x => x.active == true)[0];
      if (this.currentDealData) {
        this.dealService.getDealById(parseInt(this.currentDealData.dealId)).subscribe(result => {
          this.dealData = result;
        });
        this.loanService.getLoansForDeal(parseInt(this.currentDealData.dealId)).subscribe(result => {
          this.loanData = result;
          this.sumLoanAmount = 0;

          if (result) {
            result.forEach(value => {
              if (value.primary == true) {
                this.primaryDepartmentName = value.departmentName;
                this.isPrimary = true;
              }
              this.primaryPurpose = value.purposePrimaryName;
              this.secondaryPurpose = value.purposeSecondaryName;
              this.sumLoanAmount = this.sumLoanAmount + value.amount;
            });
          }
        });
      }
    });
  }

  toggleBorrowers() {
    this.showBorrowers = !this.showBorrowers;
  }

  ngOnInit() {
    this.showBorrowers = false;
    this.reportService.showReport('QRDealHistoryPSF', parseInt(this.currentDealData.dealId)).subscribe(result => {

      this.summaryHistoryList = result;
    });

  }


}
