import { Component, OnInit, ViewChild } from '@angular/core';
import { InboxServiceProxy, UserFullProfileDto } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { pageFilter } from 'src/app/shared/models/pagefilter.model';
import { Inbox } from 'src/app/shared/models/inbox.model';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { AmqpService } from 'src/app/shared/services/amqp/amqp.service';
import { SimonSharedService } from 'src/app/shared/services/SimonGlobalService';
declare var $:any;

@Component({
  selector: 'simon-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  filterValue: string = 'null';
  inboxDef: any = {};
  data: any = {};
  currentMenu: Inbox;
  inboxObservable$: Observable<Inbox[]>;
  public isTableLoading = false;
  currentPageFilter = new pageFilter();
  currentUser: UserFullProfileDto = new UserFullProfileDto();

  constructor(private _inboxService: InboxServiceProxy,
    store: Store<AppState>,
    private localStorageService: LocalstorageService,
    private router: Router,
    private simonSharedSvc:SimonSharedService,
    private amqpServie: AmqpService) {
    this.inboxObservable$ = store.select(state => state.inbox);
  }

  ngOnInit() {
    this.inboxObservable$.subscribe(result => {
      this.simonSharedSvc.clearSearch(result);
      this.currentMenu = result.filter(x => x.active == true)[0];
      if (this.currentMenu) {
        this.currentPageFilter = new pageFilter();
         this.isTableLoading = true;
        this._inboxService.getInbox(this.currentMenu.id, 'mmcbroom', this.filterValue, this.currentPageFilter.orderBy, this.currentMenu.defaultRowsPerPage, this.currentPageFilter.page, this.currentPageFilter.reverseSort).subscribe(res => {
          this.isTableLoading = false;
          this.inboxDef = res;
          this.currentPageFilter.maxInboxSize = res.dataCount;
          this.currentPageFilter.numRecords = this.currentMenu.defaultRowsPerPage;
        });
      }
    });
  }

  viewDeal(deal: any) {
    this.localStorageService.addDealToStore({
      dealId: deal.dealid_05,
      dealName: deal.partyname_10,
      active: true,
      routerURL: '/app/main/deal/' + deal.dealid_05
    });
    this.router.navigateByUrl("/app/main/deal/" + deal.dealid_05);
  }

  getFromInboxList(columnList: Array<any>) {
    return columnList.sort(x => x.orderBy);
  }

  public onPageChange(): void {
    this.isTableLoading = true;
    this._inboxService.getInbox(this.currentMenu.id, 'mmcbroom', this.filterValue, this.currentPageFilter.orderBy, this.currentMenu.defaultRowsPerPage, this.currentPageFilter.page, this.currentPageFilter.reverseSort).subscribe(res => {
      this.isTableLoading = false;
      this.inboxDef = res;
      this.currentPageFilter.maxInboxSize = res.dataCount;
      this.currentPageFilter.numRecords = this.currentMenu.defaultRowsPerPage;
    });
  }

  rightPanelStyle: Object = {};
  
  detectRightMouseClick($event) {
       if($event.which === 3) {
            this.rightPanelStyle = {'display':'block','left':$event.clientX + 'px','top':$event.clientY + 'px'};
            return false;
       }
}

closeContextMenu() {
  this.rightPanelStyle = {'display':'none'};
}
}
