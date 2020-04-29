import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { SelectedMenuModel } from 'src/app/shared/models/menu.model';
import { AppConsts } from 'src/app/shared/app-constants';
import { UserServiceProxy, MessagingServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { pageFilter } from 'src/app/shared/models/pagefilter.model';


@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {


  inboxmessages: Array<any> = [];
  threadmessages: Array<any> = [];
  @Input() msg: any;
  threadMsg: number;
  page: number = 1;
  pageSize: number = 10;
  currentPageFilter = new pageFilter();

  constructor(private messageService: MessagingServiceProxy) { }

  ngOnInit() {

    this.messageService.inboxMessages('mmcbroom', this.currentPageFilter.page, null, null, null, true).subscribe(messages => {
      this.inboxmessages = messages;
      this.currentPageFilter.maxInboxSize = messages.TotalRecords;
      this.currentPageFilter.numRecords = this.pageSize;
    });

  }

  openThreadMsg(threadId) {
    this.messageService.getThreadMessages(threadId).subscribe(result => {
      this.threadmessages = result;
    });
  }

  onPageChange() {
    this.messageService.inboxMessages('mmcbroom', this.currentPageFilter.page, null, null, null, true).subscribe(messages => {
      this.inboxmessages = messages;
      this.currentPageFilter.maxInboxSize = messages.TotalRecords;
      this.currentPageFilter.numRecords = this.pageSize;
    });
  }

}
