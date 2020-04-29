import { Component, OnInit, ViewEncapsulation,Input } from '@angular/core';
import { MessagingServiceProxy } from '../services/service-proxy/service-proxies';
import { ActivatedRoute,Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { AppState } from 'src/app/shared/models/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'message-thread',
  templateUrl: './message-thread.component.html',
  styleUrls: ['./message-thread.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MessageThreadComponent implements OnInit {
  @Input() isUserMessages: boolean = false;
  messageFull: boolean = true;
  dealId: number = 0;
  threads: Array<any> = [];
  thread: any = {};
  subscription:Subscription;
  newThread : boolean;
  threadTitle : string;
  currentUserInfo: any;
  searchText :string;
  userUnreadMsgCnt : number;

  constructor(private messageService: MessagingServiceProxy,private router:Router,
    private activatedRoute: ActivatedRoute,private eventEmitterService :EventEmitterService,private store: Store<AppState>) {
    activatedRoute.parent.params.subscribe(params => {
      this.dealId = params["dealId"];
    });
  }

  ngOnInit() {
    this.store.select(state => state.currentUser).subscribe(result => {
      this.currentUserInfo = result;
    });
    if(this.isUserMessages){
      this.getUserMessages();
    }
    else{
    this.getDealConversations();
    }
    this.subscription = this.eventEmitterService.getThread().subscribe(data => {
      if (data) {
        this.threads = data;
      }
    });
  }

  selectThread(thread) {
    this.thread = thread;
    this.messageFull = false;
  }

  onCloseMessage() {
    this.messageFull = true;
    this.thread = {};
  }

  createNewThread(threadTitle:string){
    if(threadTitle){
    var encodedSubject = encodeURIComponent(threadTitle);
    var threadDetails :any= {};
    threadDetails.subject = encodedSubject;
    threadDetails.participants = [this.currentUserInfo.userId];
    this.messageService.beginDealConversation(this.currentUserInfo.userId,this.dealId,threadDetails).subscribe((data: any) => {
      this.getDealConversations();
      this.threadTitle = "";
    });
   }
  }

  getDealConversations(){
    this.messageService.getDealConversations(this.dealId, this.currentUserInfo.userId).subscribe(res => {
      this.threads = res;
    });
  }

  openDeal(dealId:number){
    this.router.navigateByUrl("/main/deal/" + dealId);
  }

  getUserMessages(){
    this.messageService.getUserMessages(this.currentUserInfo.userId).subscribe(res => {
      this.threads = res;
    });
    this.messageService.getUserUnReadMessagesCount(this.currentUserInfo.userId).subscribe(res => {
      this.userUnreadMsgCnt = res.messageCount;
    });
  }

}
