import { Injectable } from '@angular/core';
import { Inbox } from '../../models/inbox.model';
import { Deal } from '../../models/deal.model';
import { Permission } from '../../models/permission.model';
import { ADD_INBOX, UPDATE_INBOX, INACTIVATE_INBOX } from '../../store/actions/inbox/inbox.action';
import { ADD_DEAL, UPDATE_DEAL } from '../../store/actions/deals/deals.action';
import { ADD_PERMISSIONS } from '../../store/actions/permission/permission.action';
import { AppState } from '../../models/app.state';
import { Store } from '@ngrx/store';
import { AppConsts } from '../../app-constants';
import { SELECT_MENU } from '../../store/actions/selected-menu/menu.action';
import { SelectedMenuModel } from '../../models/menu.model';
import { DebugContext } from '@angular/core/src/view';
import { User } from '../../models/current-user.modal';
import { ADD_USER } from '../../store/actions/current-user.action';


@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor(private store: Store<AppState>) { }

  //GET ITEM FROM LOCAL STORAGE BY KEY
  get(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

  //ADD ITEM TO LOCAL STORAGE BY KEY
  // add(key: string, data): any {
  //   localStorage.setItem(key, JSON.stringify(data));
  // }

  //ADD LIST OF ITEMS TO LOCAL STORAGE BY KEY
  // addList(key: string, data: any) {
  //   let items: any[] = this.get(key);
  //   if (items == null) {
  //     items = [];
  //   }
  //   if (this.checkDuplicateInList(items, data)) {
  //     items.push(data);
  //   }
  //   this.add(key, items);
  // }

  //REMOVE FROM LOCAL STORAGE
  // remove(key: string): boolean {
  //   localStorage.removeItem(key);
  //   return true;
  // }

  // //CHECK IF KEY EXIST IN LOCAL STORAGE
  // isKeyExist(key: string): boolean {
  //   return localStorage.getItem(key) !== null;
  // }

  //CHECK DUPLICATES IN LIST
  private checkDuplicateInList(items: any[], data): Boolean {
    if (!items.some((item) => item.id == data.id)) {
      return true;
    }
    return false;
  }

  //NGRX Methods

  //ADD INBOX TO STORE
  addInboxToStore(inbox: Inbox) {

    this.store.dispatch({
      type: UPDATE_INBOX,
      payload: inbox
    })
    this.inActivateMenus(AppConsts.deal);

    this.setCurrentMenu({
      active: inbox.active,
      id: inbox.id,
      name: inbox.inbox,
      routerURL: inbox.routerURL,
      type: AppConsts.inbox
    })
  }

  //SET ACTIVATE FLAG TO FALSE FOR MENU
  inActivateMenus(type: string) {
    switch (type) {
      case AppConsts.inbox:
        this.store.dispatch({
          type: INACTIVATE_INBOX
        })
        break;
      case AppConsts.deal:
        //deal inactive
        break;
    }
  }

  //Set Current Menu
  setCurrentMenu(selectedMenu: SelectedMenuModel) {
    this.store.dispatch({
      type: SELECT_MENU,
      payload: selectedMenu
    });
  }

  addDealToStore(deal: Deal) {
    this.store.dispatch({
      type: UPDATE_DEAL,
      payload: deal
    })

    
    this.inActivateMenus(AppConsts.inbox);

    this.setCurrentMenu({
      active: deal.active,
      id: deal.dealId,
      name: deal.dealName,
      routerURL: deal.routerURL,
      type: AppConsts.deal
    })
  }

  //Set Current Menu
  addCurrentUser(user: User) {
    this.store.dispatch({
      type: ADD_USER,
      payload: user
    });
  }

  getCurrentUser(){
   return this.store.select(x=>x.currentUser);
  }

  addPermissions(permission: Permission) {
    this.store.dispatch({
      type: ADD_PERMISSIONS,
      payload: permission
    });
  }

}

