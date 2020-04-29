import { Injectable } from '@angular/core';
import { InboxServiceProxy, UserFullProfileDto } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { simonGridData } from 'src/app/shared/models/simongriddata.model';
import { simonGridColumn } from 'src/app/shared/models/simongridcolumn.model';
import { Inbox } from 'src/app/shared/models/inbox.model';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { pageFilter } from 'src/app/shared/models/pagefilter.model';


@Injectable({
    providedIn: 'root'
})
export class simonGridService {


    filterValue: string = 'null';
    inboxDef: any = {};
    griddata: Array<simonGridData> = [];
    gridcolumns: Array<simonGridColumn> = [];
    currentPageFilter = new pageFilter();
    currentMenu: Inbox;
    inboxObservable$: Observable<Inbox[]>;
    public isTableLoading = false;

    currentUser: UserFullProfileDto = new UserFullProfileDto();
    constructor(private _inboxService: InboxServiceProxy,
        private store: Store<AppState>,
        private localStorageService: LocalstorageService,
        private router: Router,
    ) {

        this.localStorageService.getCurrentUser().subscribe(x => {
            this.currentUser = x;
        })

        this.store.select(state => state.inbox).subscribe(res => {
            this.currentMenu = res.filter(x => x.active == true)[0];

        });

    }

    getInbox(inboxId: any) {
        return this._inboxService.getInbox(inboxId, 'mmcbroom', this.filterValue, this.currentPageFilter.orderBy, this.currentMenu.defaultRowsPerPage, this.currentPageFilter.page, this.currentPageFilter.reverseSort)
    }
}