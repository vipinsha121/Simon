import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class MessageDialogService {
  private showDialogSource = new Subject<any>();
  public showDialog$ = this.showDialogSource.asObservable();

  showDialog(msg: any,type:any) {
    if(type=='notification'){
      msg['type']= 'notification';
    }else{
      msg['type']= 'message';
    }
    this.showDialogSource.next(msg);
  }
}
