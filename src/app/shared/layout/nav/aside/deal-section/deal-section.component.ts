import {
  Component,
  OnInit,
  HostBinding,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { Inbox } from 'src/app/shared/models/inbox.model';
import { Deal } from 'src/app/shared/models/deal.model';
import { isNgTemplate } from '@angular/compiler';
import { DealHeaderService } from '../../../../../main/home/deal/deal-header/deal-header.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';

@Component({
  selector: 'deal-section',
  templateUrl: './deal-section.component.html',
  styleUrls: ['./deal-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DealSectionComponent implements OnInit {
  subscription: Subscription;
  activeToggle: any[] = [];
  @Input() dealMenu: Array<Deal>;

  constructor(
    private localStorageService: LocalstorageService,
    private dealHeaderservice: DealHeaderService,
    private store: Store<AppState>,
    ) {
              //   this.subscription = this.dealHeaderservice.getActiveToggle().subscribe(activeToggle => {
              //     if (activeToggle) {
              //         this.activeToggle.push(activeToggle);
              //     } else {
              //         this.activeToggle = [];
              //     }
              // });
            }

  ngOnInit(): void { }

  showDeal(deal: Deal) {
    if (deal) {
      this.dealMenu.forEach(de => {
        if (de.dealId != deal.dealId) {
          de.active = false
        }
      })
      deal.active = true;
    }
    this.localStorageService.addDealToStore(deal);
  }

   sendToggle(): void {
    this.dealHeaderservice.sendActiveToggle('true');
  }
}
