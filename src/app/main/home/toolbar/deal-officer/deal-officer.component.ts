import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { LoanAdminComponent } from '../loanadmin/loanadmin.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { DealServiceProxy, CodeServiceProxy, WorkFlowRequestDto, WorkFlowServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Observable } from 'rxjs';


@Component({
  selector: 'toolbar-deal-officer',
  templateUrl: './deal-officer.component.html',
  styleUrls: ['./deal-officer.component.css']
})
export class DealOfficerComponent implements OnInit {
  

  constructor(public confirmService: confirmModalPopupService, private dealService: DealServiceProxy, private store: Store<AppState>,
    private codeService: CodeServiceProxy, private workFlowService: WorkFlowServiceProxy) {

    store.select(state => state.deal).subscribe(result => {
      this.currentDealData = result.filter(x => x.active == true)[0];
      if (this.currentDealData) {
      }
    });

    this.store.select(state => state.currentUser).subscribe(result => {
      this.currentUserInfo = result;
      this.userId = result.userId;
    });
    
  }
  currentDealData: any;
  currentUserInfo: any;
  userId: string;
  // Primary Officer
  @Input() dealPrimaryOfficerForDeal: any;

  ngOnInit() {
  }
}
