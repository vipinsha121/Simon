import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, HostListener, Inject, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

// import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Inbox } from 'src/app/shared/models/inbox.model';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppState } from 'src/app/shared/models/app.state';
import { UserServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { ADD_INBOX } from '../../../store/actions/inbox/inbox.action';
import { AppConsts } from 'src/app/shared/app-constants';
import { MatExpansionModule } from '@angular/material/expansion';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { matExpansionAnimations, MatExpansionPanelState } from '@angular/material';
import {LocalstorageService} from "../../../services/local-storage/localstorage.service";

@Component({
    selector: 'm-aside-left',
    templateUrl: './aside.component.html',
    styleUrls: ['./aside.component.css'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class AsideComponent implements OnInit, AfterViewInit {
    panelOpenState = true;

    @HostBinding('id') id = 'm_aside_left';

    currentRouteUrl: string = '';
    insideTm: any;
    outsideTm: any;
    recentInboxes: Array<Inbox> = [];
    recentDeals: Array<Deal> = [];

  inboxes: Observable<Inbox[]>;

  // Restore the deal store with the base route on close tab
    @HostListener('window:beforeunload', [ '$event' ])
    beforeUnloadHander(event) {
        this.recentDeals = this.recentDeals.map(deal => {
        let baseRoute = deal.routerURL.match(/\/main\/deal\/\w{5}/);
        deal.routerURL = baseRoute[0];
        return deal;
        })
        localStorage.setItem("deal", JSON.stringify(this.recentDeals));
    }

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private userService: UserServiceProxy,
    private localStorageService: LocalstorageService,
    @Inject(DOCUMENT) private document: Document
  ) {

        this.getMenusFromLocalStorage();
        // this.checkForMenus(this.recentMenu);
        this.getDealsFromLocalStorage();

    }

    ngAfterViewInit(): void {
        setTimeout(() => {
        });
    }

    ngOnInit() {
        this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
              this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
              // Set active full route
              if (/\/deal\/\d.+\/*?/g.test(this.currentRouteUrl)) {
                this.recentDeals = this.recentDeals.map(deal => {
                  if (this.currentRouteUrl.includes(deal.dealId)) {
                    deal.routerURL = this.currentRouteUrl;
                  }
                  return deal;
                })
              }
            });
    }

    isMenuItemIsActive(item): boolean {
        if (item.submenu) {
            return this.isMenuRootItemIsActive(item);
        }

        if (!item.page) {
            return false;
        }

        // dashboard
        if (item.page !== '/' && this.currentRouteUrl.startsWith(item.page)) {
            return true;
        }
        return this.currentRouteUrl === item.page;
    }

    isMenuRootItemIsActive(item): boolean {
        let result: boolean = false;

        for (const subItem of item.submenu) {
            result = this.isMenuItemIsActive(subItem);
            if (result) {
                return true;
            }
        }

        return false;
    }

    /**
     * Use for fixed left aside menu, to show menu on mouseenter event.
     * @param e Event
     */
    mouseEnter() {
        // check if the left aside menu is fixed
        if (this.document.body.classList.contains('m-aside-left--fixed')) {
            if (this.outsideTm) {
                clearTimeout(this.outsideTm);
                this.outsideTm = null;
            }

            this.insideTm = setTimeout(() => {
                // if the left aside menu is minimized
                if (this.document.body.classList.contains('m-aside-left--minimize') && mUtil.isInResponsiveRange('desktop')) {
                    // show the left aside menu
                    this.document.body.classList.remove('m-aside-left--minimize');
                    this.document.body.classList.add('m-aside-left--minimize-hover');
                }
            }, 300);
        }
    }

    /**
     * Use for fixed left aside menu, to show menu on mouseenter event.
     * @param e Event
     */
    mouseLeave() {
        if (this.document.body.classList.contains('m-aside-left--fixed')) {
            if (this.insideTm) {
                clearTimeout(this.insideTm);
                this.insideTm = null;
            }

            this.outsideTm = setTimeout(() => {
                // if the left aside menu is expand
                if (this.document.body.classList.contains('m-aside-left--minimize-hover') && mUtil.isInResponsiveRange('desktop')) {
                    // hide back the left aside menu
                    this.document.body.classList.remove('m-aside-left--minimize-hover');
                    this.document.body.classList.add('m-aside-left--minimize');
                }
            }, 500);
        }
    }


    checkForMenus(recentMenu: Array<Inbox> = []) {
        if (recentMenu.length == 0 || recentMenu.length < AppConsts.inboxMaxLength) {
            this.userService.getRecentInboxData().subscribe(result => {
                if (result != null) {
                    for (let inboxmenus of result) {

                        this.store.dispatch({
                            type: ADD_INBOX,
                            payload: { inbox: inboxmenus.InboxDesc, id: inboxmenus.InboxId, routerURL: '/main/inbox' }
                        })
                    }
                }

            });
        }
        this.getMenusFromLocalStorage();
    }





    getMenusFromLocalStorage() {
        this.store.select(state => state.inbox).subscribe(res => {
            this.recentInboxes = res;
        });
    }

    getDealsFromLocalStorage() {
        this.store.select(dealstate => dealstate.deal).subscribe(result => {
            this.recentDeals = result; 
            this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
            if (/\/deal\/\d.+\/*?/g.test(this.currentRouteUrl)) {
                // console.log('theres an active deal')
            }
            else {
                this.recentDeals.forEach(deal => {
                    deal.active = false
                })
            }
        });
    }

}
