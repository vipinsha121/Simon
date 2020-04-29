import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { LoanAdminComponent } from '../loanadmin/loanadmin.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { DealServiceProxy, CodeServiceProxy, WorkFlowRequestDto, WorkFlowServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Observable } from 'rxjs';


@Component({
  selector: 'toolbar-add-external-participant',
  templateUrl: './external-participant.component.html',
  styleUrls: ['./external-participant.component.css']
})
export class ExternalParticipant implements OnInit {
    dealId: any;
    modalRef: NgbModalRef;
  constructor(private confirmService: confirmModalPopupService) { }

  ngOnInit() { }

openParticipantListModal() {
  this.modalRef = this.confirmService.openParticipantListModal("External Participants");
}
}
