import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DealHeaderService {

  subject = new Subject<any>();

  sendFullParty(openFullRequests: string) {
    this.subject.next({ text: openFullRequests });
  }

  getFullParty(): Observable<any> {
    return this.subject.asObservable();
  }

  sendFullLoan(openFullRequests: string) {
    this.subject.next({ text: openFullRequests });
  }

  getFullLoan(): Observable<any> {
    return this.subject.asObservable();
  }

  sendActiveToggle(activeToggle) {
    this.subject.next({ text: activeToggle });
  }

  getActiveToggle(): Observable<any> {
    return this.subject.asObservable();
  }

}
