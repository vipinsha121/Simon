import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PartyServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Router } from '@angular/router';

@Component({
  selector: 'party-summary',
  templateUrl: './party-summary.component.html',
  styleUrls: ['./party-summary.component.scss']
})
export class PartySummaryComponent implements OnInit, OnChanges {

  @Input() dealId: number = 0;
  partySave: any[];
  primaryParty: any = {};
  showOtherParties: boolean = false;
  isPrimary: boolean;

  constructor(private partyServiceProxy: PartyServiceProxy,
    private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes.dealId && changes.dealId.previousValue != changes.dealId.currentValue) {
      this.partyServiceProxy.getPartyListForDeal(this.dealId, 'internal').subscribe(res => {
        this.primaryParty = res.filter(x => {

          res.forEach(val => {
            if (val.primary == true) {
              this.isPrimary = true;
            }
          });
          return x.primary;
        })[0];
        this.partySave = res.filter(x => {
          return !x.primary;
        });
      });
    }
  }

  toggleBorrowers() {
    this.showOtherParties = !this.showOtherParties;
  }
  navigateTo(url, partyId) {
    this.router.navigateByUrl(url + partyId);
  }
}
