import { Component, OnInit } from '@angular/core';
import { SimonTab } from '../shared/models/tab.model';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { SelectedMenuModel } from 'src/app/shared/models/menu.model';
import { AppConsts } from 'src/app/shared/app-constants';
import { UserServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { MainService } from './main.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  isSideClosed: boolean = true;
  openrequests: any[] = [];
  subscription: Subscription;
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;
  currentMenu: SelectedMenuModel;
  events: string[] = [];
  msgcount: number = 1;


  constructor(private store: Store<AppState>,
    private userService: UserServiceProxy,
    private localStorageService: LocalstorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private mainService: MainService) {

    this.subscription = this.mainService.getOpen().subscribe(openrequest => {
      if (openrequest) {
        this.openrequests.push(openrequest);
        this.isSideClosed = true;
      } else {
        this.openrequests = [];
      }
    });
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  sendClose(): void {
    this.mainService.sendClose('false');
    this.isSideClosed = false;
  }

  ngOnInit() {
    this.userService.getUserFullProfile("mmcbroom").subscribe(user => {
      this.localStorageService.addCurrentUser(user);
    });
    this.store.select(state => state.selectedMenu).subscribe(result => {
      this.currentMenu = result;
    });
  }

  OnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.subscription.unsubscribe();
  }

  showInbox() {
    // tslint:disable-next-line: curly
    if (this.currentMenu)
      return this.currentMenu.type == AppConsts.inbox;
  }
  showDeal() {
    // tslint:disable-next-line: curly
    if (this.currentMenu)
      return this.currentMenu.type == AppConsts.deal;
  }


}
