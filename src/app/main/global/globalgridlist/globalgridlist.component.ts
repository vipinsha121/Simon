import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { SelectedMenuModel } from 'src/app/shared/models/menu.model';
import { AppConsts } from 'src/app/shared/app-constants';
import { UserServiceProxy, MessagingServiceProxy, InboxServiceProxy, UserFullProfileDto } from 'src/app/shared/services/service-proxy/service-proxies';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { pageFilter } from 'src/app/shared/models/pagefilter.model';
import { Router } from '@angular/router';
import { Inbox } from 'src/app/shared/models/inbox.model';
import { Observable } from 'rxjs';
@Component({
    selector: 'app-globalGridList',
    templateUrl: './globalgridlist.component.html',
    styleUrls: ['./globalgridlist.component.css']
})

export class GlobalGridListComponent implements OnInit {

    filterValue: string = 'null';
    inboxDef: any = {};
    data: any = {};
    currentMenu: Inbox;
    currentUser: UserFullProfileDto = new UserFullProfileDto();
    currentPageFilter = new pageFilter();
    inboxObservable$: Observable<Inbox[]>;
    public isTableLoading = false;
    constructor(private _inboxService: InboxServiceProxy,
        store: Store<AppState>,
        private localStorageService: LocalstorageService,
        private router: Router) {

        this.inboxObservable$ = store.select(state => state.inbox);
    }

    ngOnInit() {
        //Currently binding inbox data later need to change.
        this.inboxObservable$.subscribe(result => {
            this.currentMenu = result.filter(x => x.active == true)[0];
            if (this.currentMenu) {
                this.currentPageFilter = new pageFilter();
                this.isTableLoading = true;
                this._inboxService.getInbox(this.currentMenu.id, 'mmcbroom', this.filterValue, this.currentPageFilter.orderBy, this.currentMenu.defaultRowsPerPage, this.currentPageFilter.page, this.currentPageFilter.reverseSort).subscribe(res => {
                    this.isTableLoading = false;
                    this.inboxDef = res;
                    this.currentPageFilter.maxInboxSize = res.DataCount;
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
            routerURL: '/app/main'
        });
        this.router.navigateByUrl("/app/main");
    }

    public onPageChange(): void {
        this.isTableLoading = true;
        this._inboxService.getInbox(this.currentMenu.id, 'mmcbroom', this.filterValue, this.currentPageFilter.orderBy, this.currentMenu.defaultRowsPerPage, this.currentPageFilter.page, this.currentPageFilter.reverseSort).subscribe(res => {
            this.isTableLoading = false;
            this.inboxDef = res;
            this.currentPageFilter.maxInboxSize = res.DataCount;
            this.currentPageFilter.numRecords = this.currentMenu.defaultRowsPerPage;
        });
    }
}
