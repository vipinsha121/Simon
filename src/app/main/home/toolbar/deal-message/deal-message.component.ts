import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {
   DealMessagesServiceProxy, MessagingServiceProxy, EditMessagesServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { pageFilter } from 'src/app/shared/models/pagefilter.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';

@Component({
  selector: 'toolbar-deal-message',
  templateUrl: './deal-message.component.html',
  styleUrls: ['./deal-message.component.css']
})
export class DealMessageComponent implements OnInit {
  @ViewChild('questionModal')
  questionModal: any;
  enableEdit = false;
  enableEditIndex = null;
  dealMessagesList:any[]=[];
  inboxmessages: Array<any> = [];
  threadmessages: Array<any> = [];
  @Input() msg: any;
  threadMsg: number;
  dealNumber: any;
  dealId: number = 15461;
  page: number = 1;
  pageSize: number = 10;
  currentPageFilter = new pageFilter();
  modalReference: any;
  modalRef: NgbModalRef;
  constructor(private modalService: NgbModal,
              public confirmService: confirmModalPopupService,
              private messageService: MessagingServiceProxy,
              private dealMessageServiceProxy: DealMessagesServiceProxy,
              private editMessageServiceProvy : EditMessagesServiceProxy) { }

  ngOnInit() {
  }

  open(dealId: any) {
    this.dealNumber = dealId;
    this.modalReference = this.modalService.open(this.questionModal, {
      centered: true,
      size: 'lg'
    });
    this.dealMessageServiceProxy.getDealMessages(this.dealNumber, this.page, this.pageSize)
    .subscribe(res => {
      this.dealMessagesList = res.messages;
    },
    (error) => {
    });
    this.modalReference.result.then((result: any) => {}, (reason: any) => {});
  }
  closeMessageModal(e: any) {
    this.modalReference.close();
  }

 

  onclickreport(key) {
    if (key == 'Messages') {
      this.modalRef = this.modalRef = this.confirmService.showReportAddModal('Messages', 'QRMessage', this.dealNumber);
    }else {
           alert("Something Wrong to Open Report");
          }
}

CheckDealArchive(event: any, deal: any) {
  const checked = event.target.checked;
  if (checked){
    deal.archive = true;
  } else {
    deal.archive = false;
  }
  this.EditMessage(deal)
}

CheckMemoToFile(event: any, deal: any) {
  const checked = event.target.checked;
  if (checked){
    deal.memoToFile = true;
  } else {
    deal.memoToFile = false;    
  }
  this.EditMessage(deal)
}

EditMessage(deal: any) {

   this.editMessageServiceProvy.editMessage(deal).subscribe(data => {},
   error => {
     if (error.status === 409) {
     }
   }
   );
 }

messageEdit(event: any, i: any) {
  this.enableEdit = true;
  this.enableEditIndex = i;
}

messageCancel() {
  this.enableEditIndex = null;
}

messageSave(deal: any) {
  this.enableEditIndex = null;
  this.editMessageServiceProvy.editMessage(deal).subscribe(data => {
  },
    error => {
      if (error.status === 409) {
      }
    }
    );
}
}

