import { Component, OnInit, EventEmitter, Output, HostListener, Renderer2 } from '@angular/core';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { InboxServiceProxy, UserServiceProxy, MessagingServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Inbox } from 'src/app/shared/models/inbox.model';
import { ADD_INBOX } from 'src/app/shared/store/actions/inbox/inbox.action';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { loginUser } from 'src/app/shared/models/loginuser.modal';
import { AppConsts } from 'src/app/shared/app-constants';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { MainService } from '../../../../main/main.service';
import { Subscription } from 'rxjs';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ActionNoitifyService } from '../../../layout/nav/header/header.service';
import { User } from 'src/app/shared/models/current-user.modal';
@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() inboxAdd = new EventEmitter();
  openrequests: any[] = [];
  isButtonClosed: boolean;
  subscription: Subscription;
  inboxList: Array<any> = [];
  recentMenu: Array<Inbox> = [];
  currentuser: loginUser[];
  modalRef: NgbModalRef;
  mobileQuery: MediaQueryList;
  hideAlertCount;
  hideMessageCount;
  public clear: any;
  public y = true;
  public  message: any;
  public userunread: any;
  public useralert: any;
  public messagelength: any;
  public notification: any;
  public currentUser1: any;
  public enteredButton = false;
  public isMatMenuOpen = false;
  public isMatMenu2Open = false;
  public showMsg = false;
  public showNotification = false;
  public actionNotifySub: ISubscription;
  _mobileQueryListener: () => void;
  unReadMessages: any;
  @HostListener('document:click', ['$event']) clickedOutside($event) {
    // here you can hide your menu
    this.showMsg = false;
    this.showNotification = false;
  }
  constructor(private store: Store<AppState>,
              private inboxService: InboxServiceProxy,
              private userService: UserServiceProxy,
              private localStorageService: LocalstorageService,
              private confirmService: confirmModalPopupService,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher,
              private mainService: MainService,
              private ren: Renderer2,
              private actionNotifySvc: ActionNoitifyService,
              private messageService: MessagingServiceProxy,
              private _msgDialogSvc: MessageDialogService) {

    this.inboxService.getUserInboxList('mmcbroom').subscribe(result => {
      this.inboxList = result;
    });

    this.subscription = this.mainService.getOpen().subscribe(openrequest => {
      if (openrequest) {
        this.openrequests.push(openrequest);
        this.isButtonClosed = true;
      } else {
        this.openrequests = [];
      }
    });

    this.getMenusFromLocalStorage();
    this.bindcurrentuserprofile();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.actionNotifySub = this.actionNotifySvc.notifySvc$.subscribe(result => {
        if (result) {
        this.messageService.getAlertsForUser(this.currentUser1.userId).subscribe(p=>{this.notification=p;});
        }
    });

  }


  sendOpen(): void {
    this.mainService.sendClose('true');
    this.isButtonClosed = false;
  }

  ngOnInit() {
    this.currentUser1 = this.localStorageService.get('currentUser');
    // console.log(this.currentUser1)
    setInterval(() => {
      this.getMessages();
      this.messageService.getMessagesForUser().subscribe(p => {
        this.message = p;
        if (this.message.length > 0) {
          this.hideMessageCount = false;
        } else {
          this.hideMessageCount = true;
        }
      });
      this.messageService.getAlertsForUser(this.currentUser1.userId).subscribe(p => {
          this.notification = p;
          if (this.notification.alertcount > 0) {
            this.hideAlertCount = false;
          } else {
            this.hideAlertCount = true;
          }
        });
    }, 10000);
   }


  OnDestroy() {
    this.subscription.unsubscribe();
  }


  addInbox(inbox: any, routeURL: string) {
    if (!routeURL) {
      routeURL = '/app/main';
    }

    this.localStorageService.addInboxToStore(
      {
        id: inbox.inboxId,
        inbox: inbox.caption,
        active: true,
        routerURL: routeURL,
        defaultRowsPerPage: inbox.defaultRowsPerPage
      });
    this.router.navigateByUrl(routeURL);
  }

  menuenter() {
    this.isMatMenuOpen = true;
    if (this.isMatMenu2Open) {
      this.isMatMenu2Open = false;
    }
  }


  menuLeave(trigger, button) {
    setTimeout(() => {
      if (!this.isMatMenu2Open && !this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.ren.removeClass(button._elementRef.nativeElement, 'cdk-focused');
        this.ren.removeClass(button._elementRef.nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80);
  }

  getMenusFromLocalStorage() {
    this.store.select(state => state.inbox).subscribe(res => {
      this.recentMenu = res;
    });
  }

  bindcurrentuserprofile() {
    this.currentuser = [{ id: '01', title: 'User Profile', icon: 'fa fa-user' },
    { id: '02', title: 'Out Of Office', icon: 'fa fa-street-view' },
    { id: '03', title: 'Manage Participation', icon: 'fa fa-asterisk' },
    { id: '04', title: 'Logout', icon: 'fa fa-power-off' },
    ];
  }
  onSelect(user) {
    if (user.id == AppConsts.userprofile) {
      this.modalRef = this.confirmService.openUserProfileModal('User Profile');
      this.modalRef.componentInstance.onSaveClick.subscribe((user: User) => {
        this.localStorageService.addCurrentUser(user);
        this.currentUser1 = this.localStorageService.get('currentUser');
        console.log(this.currentUser1);
        this.modalRef.close();
      });
    } else if (user.id == AppConsts.outofoffice) {
      this.modalRef = this.confirmService.openoutofofficeModal('Out Of Office');
      this.modalRef.componentInstance.onSaveClick.subscribe(() => {
        this.modalRef.close();
      });
    } else if (user.id == AppConsts.manageparticipation) {
      this.modalRef = this.confirmService.openManageParticipationModal('MANAGE DEAL PARTICIPATION');
    }
  }

  getMessages() {
    const userId =  this.localStorageService.get('currentUser').userId;
    this.messageService.getUserUnReadMessagesCount(userId).subscribe(res => {
      this.unReadMessages = res.messageCount;
    });
  }

  getInbox() {
    const userId = this.localStorageService.get('currentUser').userId;
    this.messageService.inboxMessages(userId, 5).subscribe(res => {
    });
  }
  postmarkallasread() {
    this.messageService.markUserAlertsAsReadByType(this.currentUser1.userId,'N', 0).subscribe(x => {
      if (x == 'Success') {
        this.messageService.getAlertsForUser(this.currentUser1.userId).subscribe(p => {
        this.notification = p;
      });
    }
    });
  }


  postMarkAlertAsRead(id) {

  this.messageService.markAlertAsRead(this.currentUser1.userId, id, 0).subscribe(x => {
    if (x == 'Success') {

      this.messageService.getAlertsForUser(this.currentUser1.userId).subscribe(p => {
        this.notification = p;

      });
    }
  });
  }

  clearMessage(recipient: string, id: number) {

    this.messageService.markMessageAsRead(recipient, id).subscribe(res => {
      if (res == 'Success') {

        this.messageService.getMessagesForUser().subscribe(p => {
          this.message = p;
        });

       }
    });

  }

  clearNotification(id) {
   alert(id);
  }
  showDlg(message, type) {
    this._msgDialogSvc.showDialog(message, type);
  }

  clickedInside($event: Event, toggle: boolean, option: any) {
    $event.preventDefault();
    $event.stopPropagation();

    switch (option) {
      case 'notification': {
        this.showMsg = false;
        if (toggle) {
          this.showNotification =  !this.showNotification;
        } else {
          this.showNotification = true;
        }
        break;
      }
      case 'message': {
        this.showNotification = false;
        if (toggle) {
          this.showMsg =  !this.showMsg;
        } else {
          this.showMsg = true;
        }
        break;
      }
    }
  }
}


