import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { SelectedMenuModel } from 'src/app/shared/models/menu.model';
import { AppConsts } from 'src/app/shared/app-constants';
import { UserServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mobileQuery: MediaQueryList;
  drawerOpen: boolean;
  currentMenu: SelectedMenuModel;

  _mobileQueryListener: () => void;

  drawer() {
    this.drawerOpen = !this.drawerOpen;
  }


  constructor(private store: Store<AppState>,
    private userService: UserServiceProxy,
    private localStorageService: LocalstorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnInit() {
    this.drawerOpen = true;
    this.userService.getUserFullProfile("mmcbroom").subscribe(user => {
      this.localStorageService.addCurrentUser(user);
    });
    this.store.select(state => state.selectedMenu).subscribe(result => {
      this.currentMenu = result;
    });
  }

  OnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
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
