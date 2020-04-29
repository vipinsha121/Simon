import { Component, OnInit, Input } from '@angular/core';
import {
  DealDto,
  DealServiceProxy,
  PartyServiceProxy,
  CollateralServiceProxy,
  LoanServiceProxy
} from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { AnyARecord } from 'dns';
import { ShowPortlet } from 'src/app/shared/models/showportlet.model';
import { debug } from 'util';
import { SelectedMenuModel } from 'src/app/shared/models/menu.model';
import { ActivatedRoute } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';



@Component({
  selector: 'simon-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.css']
})
export class DealComponent implements OnInit {

  @Input() currentDeal: any;
  dealdetails: string;
  currentDealData: Deal;
  dealData: DealDto;
  tempdealData: DealDto;
  partyData: [];
  collateralData: any;
  loanData: any;
  summaryData: any;
  showPortlet: ShowPortlet = new ShowPortlet();
  currentMenu: SelectedMenuModel;

  constructor(private dealService: DealServiceProxy,
    private store: Store<AppState>,
    private partyService: PartyServiceProxy,
    private collateralService: CollateralServiceProxy,
    private loanService: LoanServiceProxy,
    activatedRoute: ActivatedRoute,
    localStorageService: LocalstorageService
  ) {
    activatedRoute.params.subscribe(param => {
      let dealId = param["dealId"];
      store.select(state => state.deal).subscribe(result1 => {
        this.currentDealData = result1.filter(x => x.active == true)[0];
        if (dealId) {
          this.dealService.getDealById(parseInt(dealId)).subscribe(result => {
            //if routed deal and deal in store is not same
            // Add deal to store            
            if (!this.currentDealData || (dealId != this.currentDealData.dealId)) {
              this.currentDealData = {
                dealId: result.dealId,
                dealName: result.name,
                active: true,
                routerURL: '/main/deal/' + result.dealId
              }
              //add to store
              localStorageService.addDealToStore(this.currentDealData);
            }
            //set deal data
            this.dealData = result;            
          });
        }
      }).unsubscribe();

    });

    this.store.select(state => state.selectedMenu).subscribe(result => {
      this.currentMenu = result;
    });

  }

  ngOnInit() {}

  dealHeaderPartyClickEvent() {
    this.showPortlet.party = true;
  }

  dealHeaderCollateralclickEvent() {
    this.showPortlet.collateral = true;
  }

  dealHeaderLoanClickEvent() {
    this.showPortlet.loan = true;
  }

  dealHeadersummaryclickEvent() {
    this.showPortlet.summary = true;
  }
  requirementEventClicked() {
    this.showPortlet.requirement = true;
  }

  documentEventClicked() {
    this.showPortlet.document = true;
  }

  datesEventClicked() {
    this.showPortlet.dates = true;
  }

  eventsClicked() {
    this.showPortlet.events = true;
  }

  processeseventClicked() {
    this.showPortlet.process = true;
  }

}
