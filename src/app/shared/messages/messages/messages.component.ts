import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { MessagingServiceProxy, RequirementDto, MessageDto, ParticipantServiceProxy, MessageThreadDto,NotificationServiceProxy,NotificationRequestDto } from '../../services/service-proxy/service-proxies';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { AppState } from 'src/app/shared/models/app.state';
import { Store } from '@ngrx/store';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnChanges, AfterViewChecked {
  @ViewChild('scrollToBottom') private scrollContainer: ElementRef;
  @Input() dealId: number = 0;
  @Input() threadId: number = 0;
  @Input() requirementId: number = 0;
  @Input() threadName: string = "";
  @Input() isUserMessages: boolean = false;

  @Output() onCloseMessage: EventEmitter<any> = new EventEmitter();

  messages: Array<MessageDto> = [];
  message: MessageDto = new MessageDto();
  isMessagingLoading: boolean = false;
  threadUsers: Array<any> = [];
  users: Array<any> = [];
  tempThreadUSers: Array<any> = [];
  searchText: string;
  editTitle: boolean = false;
  currenThread: MessageThreadDto = new MessageThreadDto();
  currentUserInfo: any;
  memoToFile : boolean;
  modalRef: NgbModalRef;
  notificationRequest: NotificationRequestDto = new NotificationRequestDto();
  searchUser : string="";
  selectedUsers : Array<string> = [];


  constructor(private messageService: MessagingServiceProxy,
              private participantsService: ParticipantServiceProxy,
              private eventEmitterService: EventEmitterService,
              private store: Store<AppState>,private confirmService: confirmModalPopupService,
              private notificationService: NotificationServiceProxy) { }

  scrollToBottom(): void {
    try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnInit() {
    this.scrollToBottom();
    this.store.select(state => state.currentUser).subscribe(result => {
      this.currentUserInfo = result;
    });
    this.getParticipants();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshThread();
    if (changes.threadId.currentValue > 0) {
      this.getMessages();
      this.getThreadUsers();
     }
  }

  sendMessage(sendToOfficer:boolean) {
    this.message.threadId = this.threadId || 0;
    this.message.threadName = this.threadName;
    this.message.requirementId = this.requirementId;
    this.message.authorId = this.currentUserInfo.userId;
    this.message.createdBy = this.currentUserInfo.userId;
    this.message.dealId = this.dealId;
    this.message.memoToFile = this.memoToFile;
    this.message.author = this.currentUserInfo.userId;
    this.message.lastModBy = this.currentUserInfo.userId;
    if(this.requirementId >0 && this.threadId ==0){
      var encodedSubject = encodeURIComponent(this.threadName);
      var threadDetails :any= {};
      threadDetails.subject = encodedSubject;
      threadDetails.participants = [this.currentUserInfo.userId];

      this.messageService.beginDealConversation(threadDetails,this.currentUserInfo.userId,this.dealId).subscribe((data: any) => {
        this.message.threadId = data.id;
        this.messageService.saveMessage(this.message).subscribe((res: MessageDto) => {
          this.messages.push(res);
          this.message = new MessageDto();
          this.getMessages();
          this.memoToFile = false;
          this.eventEmitterService.setThread(this.dealId,this.currentUserInfo.userId);
          if(sendToOfficer){
            this.notify(sendToOfficer,res.id)
          }
        });
        //commented for now, need to revisit while req message implementation
        // this.messageService.synchParticipantsInThread(data.threadId, this.tempThreadUSers).subscribe(res => {
          //  this.getThreadUsers();
        // });
      });
    }

    if(this.requirementId ==0){
      this.messageService.saveMessage(this.message).subscribe((res: MessageDto) => {
        this.threadId = res.threadId;
        this.messages.push(res);
        this.message = new MessageDto();
        this.getMessages();
        this.memoToFile = false;
        this.eventEmitterService.setThread(this.dealId,this.currentUserInfo.userId);
        if(sendToOfficer){
          this.notify(sendToOfficer,res.id)
        }
      });
    }

    if(this.requirementId ==0){
      this.messageService.synchParticipantsInThread(this.threadId, this.tempThreadUSers).subscribe(res => {
       this.getThreadUsers();
      });
    }
  }

  getMessages() {
    if (this.threadId) {
      this.isMessagingLoading = true;
      this.message = new MessageDto();
      this.messages = [];
      this.messageService.getThreadMessages(this.threadId).subscribe((res: MessageDto[]) => {
        this.messages = res;
        this.isMessagingLoading = false;
      });
      this.message = new MessageDto();
    }
  }

  getThreadUsers(){
    this.messageService.getThreadUsers(this.threadId).subscribe((res) => {
      this.tempThreadUSers = res;
      this.selectedUsers = this.tempThreadUSers.map(({ id }) => id);
    });
  }


  closeMessage() {
    this.threadUsers = [];
    this.onCloseMessage.emit();
  }

  getParticipants() {
    this.participantsService.getUserForParticipants().subscribe(usrs => {
      this.users = usrs;
    });
  }

  refreshThread(){
    this.currenThread.id = this.threadId;
    this.currenThread.title = this.threadName;
  }

  updateThreadTitle(){
    this.currenThread.id = this.threadId;
    this.currenThread.lastModBy = this.currentUserInfo.userId;
    this.messageService.updateThread(this.currenThread).subscribe(res => {
       this.currenThread = res;
       this.threadName = this.currenThread.title;
       this.eventEmitterService.setThread(this.dealId,this.currentUserInfo.userId);
    });
  }

  addParticipant(participant, selected) {
    if (selected) {
      var user = this.tempThreadUSers.find(u => u.id == participant.id);
      if (!user) {
        this.tempThreadUSers.push(participant);
        this.selectedUsers = this.tempThreadUSers.map(({ id }) => id);
        var item = this.users.filter((u: any) => {
          return u.id == participant.id;
        });
        item[0].relatedUsers.forEach((element: any) => {
          var selectedItem = null;
          selectedItem = {};
          selectedItem.id = element.id;
          selectedItem.text = element.text;
          this.tempThreadUSers.push(selectedItem);
          this.selectedUsers = this.tempThreadUSers.map(({ id }) => id);
        });
      }
    }
    else {
      this.removeParticipant(participant);
    }
  }

  removeParticipant(participant) {
    if(participant && !participant.checked){
    this.tempThreadUSers = this.tempThreadUSers.filter(item => item.id !== participant.id);
    this.selectedUsers = this.tempThreadUSers.map(({ id }) => id);
    }
  }

  refreshValue(event) {
  }
  
  itemsToString(value) {
    return value;
  }

  send() {
        this.modalRef = this.confirmService.openCommonConfirmationModal("Message", "Send message as email to primary officer?");
        this.modalRef.componentInstance.onNoremoveConfirmClick.subscribe(data => {
            this.sendMessage(false);
            this.modalRef.close();
        })
        this.modalRef.componentInstance.onremoveConfirmClick.subscribe(r => {
                this.sendMessage(true);
                this.modalRef.close();
        })
        this.modalRef.componentInstance.closeModalPopup.subscribe(d => {
          this.modalRef.close();
      })
    }

    notify(sendToOfficer:boolean,messageId:number){

      if (sendToOfficer && sendToOfficer === true) {
        this.notificationRequest.notifyDefinitionId = 'NDSendMessageToPrimaryOfficer';
        this.notificationRequest.requestUserId = this.currentUserInfo.userId;;
        this.notificationRequest.assignedUserId = '';
        this.notificationRequest.processStageFunctionType = '';
        this.notificationRequest.processId = '';
        this.notificationRequest.stageId = '';
        this.notificationRequest.functionId = '';
        this.notificationRequest.processStageFunctionId = 0;
        this.notificationRequest.processStageFunctionDetail = '';
        this.notificationRequest.notifyParameters = '@messagethreadid_05=' + this.threadId + '|@messageid_05=' + messageId + '|';
        this.notificationRequest.dealId = this.dealId;
        this.notificationRequest.requirementId = 0;
        if(this.notificationRequest){
          this.notificationService.updateNotification(this.notificationRequest).subscribe(data => {
          });
        }
      }
    }
}
