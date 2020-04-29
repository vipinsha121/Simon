import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { DealMessageComponent } from '../deal-message/deal-message.component';

@Component({
  selector: 'toolbar-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  @ViewChild(DealMessageComponent)
  DealMessageComponent: DealMessageComponent;
  @Input() dealId: any;

  constructor(public confirmService: confirmModalPopupService) { }

  ngOnInit() {
  }
  modalRef: NgbModalRef;

  onclickreport(key) {
    if (key == 'Approvals') {
      this.modalRef = this.confirmService.showReportAddModal('Approval Report', 'QRApprovalsByDeal', this.dealId);
    } else {
      if (key == 'Fair Lending') {
        this.modalRef = this.confirmService.showReportAddModal('Fair Lending', 'QRExceptionsByDeal', this.dealId);
      }
      else {
        if (key == 'Missing Items') {
          this.modalRef = this.confirmService.showReportAddModal('Missing Items', 'QRMissingItemsByDeal', this.dealId);
        }
        else {
          if (key == 'Requirement Comments') {
            this.modalRef = this.confirmService.showReportAddModal('Requirement Comments', 'QRRequirementCommentsByDeal', this.dealId);
          }
          else {
            if (key == 'Messages') {
              this.modalRef = this.confirmService.showReportAddModal('Messages', 'QRMessage', this.dealId);
            }
            else {
                alert("Something Wrong to Open Report");
            }
          }
        }
      }
    }
  }

  getDealMessage(dealNumber: any) {
  this.DealMessageComponent.open(dealNumber);
  }
}
