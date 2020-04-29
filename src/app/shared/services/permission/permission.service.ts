import { Injectable } from '@angular/core';
import { ValuesServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Observable,of as observableOf } from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService{
  permissions: Array<any> = [];
  perms :Array<any> = [];
  userId :string;
  constructor(private valuesService: ValuesServiceProxy,private store: Store<AppState>,private localStorageService: LocalstorageService) {
    this.init();
   }

  init() {
     this.store.select(state => state.currentUser).subscribe(result => {
     this.userId = result.userId;
     this.getUserPermissions(this.userId);
     })
  }

  getUserPermissions(userId : string){
   this.valuesService.getUserPermissions(userId).subscribe(list => {
      this.permissions = list;
      //  this.localStorageService.addPermissions(list);
      localStorage.setItem("permissions", JSON.stringify(list));
   })
  }

  isgranted(permName : string){
    if(this.permissions.length == 0){
    this.permissions = JSON.parse(localStorage.getItem("permissions"))
    }
    if(this.permissions.length>0){
        this.perms = this.permissions.find(x => x.PermissionName == permName)
        if(this.perms){
          return true;
        }
        else{
          return false;
        }
    }
  }

  isGrantedWithStage(permName : string,process:string,stage:string){
    if(this.permissions.length ==0){
    this.permissions = JSON.parse(localStorage.getItem("permissions"))
    }
    if(this.permissions.length>0){
        this.perms = this.permissions.find(x => x.PermissionName == permName && x.ProcessId == process && x.StageId == stage )
        if(this.perms){
          return true;
        }
        else{
          return false;
        }
    }
  }

}
