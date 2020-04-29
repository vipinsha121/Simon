import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { CollateralServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';

@Component({
  selector: 'app-collateral-summary',
  templateUrl: './collateral-summary.component.html',
  styleUrls: ['./collateral-summary.component.scss']
})
export class CollateralSummaryComponent implements OnInit, OnChanges {

  @Input() dealId: number = 0;
  sumCollateralAmount: number;
  isPrimary: boolean;
  collateralData: any;
  primaryCollateralId: any;
  primaryCollateralName: any;
  primaryCollateralAmount: any;
  collateralAmount: any;
  nonPrimaryCollateral: any;
  currentDealData: any;
  showOtherCollaterals: boolean;
  group: any;
  category: any;
  collateralId: number;
  collateral: any;

  constructor(private collateralService: CollateralServiceProxy, private store: Store<AppState>) { }

  ngOnInit() {
  }

  ngOnChanges(changes: any): void {
    this.getCollateralDetailsApplicationSummary();
  }

  getCollateralDetailsApplicationSummary() {

    // Get current deal details specifically DealId
    this.store.select(state => state.deal).subscribe(result => {
      this.currentDealData = result.filter(x => x.active == true)[0];
    })

    this.collateralService.getCollateralForDeal(parseInt(this.currentDealData.dealId)).subscribe(data => {

      this.collateral = data;
      this.sumCollateralAmount = 0;

      if (data) {
        // Returns the primary product name (loan) and amount
        data.forEach(value => {
          if (value.primary == true) {
            this.group = value.group;
            this.isPrimary = true;
            this.category = value.category;
            this.primaryCollateralId = value.collateralId;
            this.collateralId = value.collateralId;
          }

          // Returns the non primary product (loan) details like product name, amount etc
          this.nonPrimaryCollateral = data.filter(x => {
            return !x.primary;
          });
          this.nonPrimaryCollateral;
        });
      }
    })
  }

  toggleBorrowers() {
    this.showOtherCollaterals = !this.showOtherCollaterals;
  }


}
