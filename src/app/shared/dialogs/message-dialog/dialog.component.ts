import { Component, ViewChild } from "@angular/core";
import { ISubscription } from "rxjs/Subscription";
import { MessageDialogService } from "./message-dialog.service";
import { LoaderService } from '../../loader/loader.service';
import { MessagingServiceProxy, MessageDto } from '../../services/service-proxy/service-proxies';
import { ActionNoitifyService } from '../../layout/nav/header/header.service';
import { LocalstorageService } from '../../services/local-storage/localstorage.service';
@Component({ 
  selector: "message-dialog",
  styleUrls: ["styles.scss"],
  templateUrl: "./dialog.component.html"
})
export class MessageDialogComponent {
  str:string;
  textarea:any;
  loader:boolean;
  public  messages:any;
  reply = new MessageDto();
  public notification:any;
  public messagepopup:any;
  dialogVisible: boolean;
  public projectName: string;
  public message: string;
  public currentUser : any;
  private dialogSub: ISubscription;
  public isLoading: boolean = false;
  constructor(private dialogSvc: MessageDialogService,
    private _messagingServiceProxy: MessagingServiceProxy,
    private _loaderservice:LoaderService,
    private localStorageService: LocalstorageService,
    private actionNotifySvc: ActionNoitifyService,
  ) {
    this.dialogSub = this.dialogSvc.showDialog$.subscribe(msg => {

      this.message = msg;
      this.messages = msg;
      this.messagepopup = msg;
      this.showDialog();
    });
  }
  showDialog() {
    this.dialogVisible = true;
  }

  hideDialog() {
    this.dialogVisible = false;
  }
  ngOnInit(){
    this.currentUser =  this.localStorageService.get("currentUser");

    this._messagingServiceProxy.getMessagesForUser().subscribe(p=>{this.messages=p;});
    this._messagingServiceProxy.getAlertsForUser(this.currentUser.userId).subscribe(p=>{this.notification=p.alerts;});
    
  }
  
  saveMessage(){
    //let reply = new MessageDto();
    this.textarea=this.str;
    if(this.str != null) {    
      this.reply.threadId = this.messages.threadId;
      this.reply.author = this.currentUser.userId;
      this.reply.plainContent = this.str;
    }
    this._loaderservice.show();
   
    this.isLoading = true;
    this._messagingServiceProxy.saveMessage(this.reply).subscribe((res)=>{
 
  this.dialogVisible = false;
  this.isLoading = false;
  this._loaderservice.hide();
    })
  }           

  postMarkAlertAsRead(id)
  {
    this._loaderservice.show();
    this.isLoading = true;
  this._messagingServiceProxy.markAlertAsRead(this.currentUser.userId,id,0).subscribe(x=>{
    if(x == "Success")
  {
    this._messagingServiceProxy.getAlertsForUser(this.currentUser.userId).subscribe(p=>{
      this.notification=p;
      this.actionNotifySvc.notifySvc(true);
    });

  }
  this.dialogVisible =   false;
  this.isLoading = false;
  this._loaderservice.hide();
  

  })

  }

}
