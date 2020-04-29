import { Component, OnInit } from '@angular/core';
import { PeriodicElement } from "../party-form/party-form.component";
import { ActivatedRoute } from "@angular/router";
import {
  DealServiceProxy,
  PartyDto,
  PartyServiceProxy
} from "../../../../../../shared/services/service-proxy/service-proxies";

@Component({
  selector: 'app-party-related-deals',
  templateUrl: './party-related-deals.component.html',
  styleUrls: ['./party-related-deals.component.scss']
})
export class PartyRelatedDealsComponent implements OnInit {

  dealId: number;
  partyId: number;
  party: PartyDto = new PartyDto();
  Related_deals: any[];
  dataSource: any[];
  requirements: Array<any> = [];
  openRequirements: number = 0;
  displayedColumns: any[] = ['dealId', 'accountNumber', 'requestType', 'productDesc', 'amount', 'role', 'stageLabel'];

  constructor(private activatedRoute: ActivatedRoute,
    private partyService: PartyServiceProxy,
    private dealService: DealServiceProxy, ) { }

  ngOnInit() {
    // Get partyId from URL
    this.activatedRoute.params.subscribe(params => {
      this.partyId = params['partyId'];
      if (this.partyId > 0) {
        this.dealService.getRelateDeals(this.partyId).subscribe(relatedDeals => {
          this.Related_deals = relatedDeals;
          const ELEMENT_DATA: PeriodicElement[] = relatedDeals;
          this.dataSource = ELEMENT_DATA;
        });
      }
    });
  }
}
