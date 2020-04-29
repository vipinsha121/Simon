import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MainService {

  subject = new Subject<any>();

  sendClose(openrequest: string) {
    this.subject.next({ text: openrequest });
  }

  sendOpen(openrequest: string) {
    this.subject.next({ text: openrequest });
  }


  getOpen(): Observable<any> {
    return this.subject.asObservable();
  }

}
