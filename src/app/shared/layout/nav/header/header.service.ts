import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class ActionNoitifyService {
  private notifySvcSource = new Subject<any>();
  public notifySvc$ = this.notifySvcSource.asObservable();

  notifySvc(result: any) {
      debugger
    this.notifySvcSource.next(result);
  }

}