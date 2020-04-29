import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AmqpService } from '../shared/services/amqp/amqp.service';
import { AppConsts } from '../shared/app-constants';
import { Message } from '@stomp/stompjs';
import { Store } from '@ngrx/store';
import { AppState } from '../shared/models/app.state';

@Component({
  selector: 'app-messages',
  templateUrl: './rabbitmqmessages.component.html',
  styleUrls: ['./rabbitmqmessages.component.css']
})
export class RabbitMQMessagesComponent implements OnInit {

  public receivedMessages: string[] = [];
  currentDealData: any = {};
  inboxId: number = 0;
  constructor(private amqpServie: AmqpService,
    private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select(state => state.deal).subscribe(result => {
      this.currentDealData = result.filter(x => x.active == true)[0];
      this.subscribeInbox(this.currentDealData.dealId);
    });
    //
    ///queue/sbq
    // this.rxStompService.watch('/exchange/amq.fanout/sbq').subscribe((message: Message) => {
    //   this.receivedMessages.push(message.body);
    // });
  }

  onSendMessage() {
    ///exchange/<name>[/<routing-key>]
    ///exchange/test1[/svbq]
    const message = `Message generated at ${new Date}`;
    this.amqpServie.publishToRabbitMQ(AppConsts.inboxExchangeKey + "/" + this.currentDealData.dealId, message);
  }


  subscribeInbox(inboxId: string): void {
    // requirement.matt.employeeloan
    // deal.employyeloan
    // detsitnaionURl/openDealInbox.matt.employeeloan.false
    // detsitnaionURl/openDealInbox.tim.employeeloan.true
    // store- user data including emploan
    // if(currentUser.emploan==true)

    // this.amqpServie.subscribeToRabbitMQ("PBDEALOPEN" + "/emplloan.true");  -- tim, matt
    // this.amqpServie.subscribeToRabbitMQ("PBDEALOPEN"); -- tim, matt + cts, and others
    this.amqpServie.subscribeToRabbitMQ("/exchange/" + AppConsts.inboxExchangeKey + "/" + inboxId)
      .subscribe((message: Message) => {
        // var data = JSON.parse(message.body);
        // this.receivedMessages.push(data);

        this.receivedMessages.push(message.body);
        // if (data.isNew == true) {
        //   this.inboxDef.Data.splice(0, 0, data);
        // }
        // else {
        //   if (this.inboxDef) {
        //     var inboxData = this.inboxDef.data;
        //     inboxData.forEach(x => {
        //       if (x.dealid_05 == data.dealId) {
        //         x.amount_06 = data.amount;
        //       }
        //     });
        //   }
        // }
      })

  }

  subscribeInboxEmployeeLoan(routeKey: string): void {
    this.amqpServie.subscribeToRabbitMQ(routeKey)
      .subscribe((message: Message) => {
        var data = JSON.parse(message.body);
        this.receivedMessages.push(data);
        // if (data.isNew == true) {
        //   //this.inboxDef.data.splice(0, 0, data);
        // }
        // else {
        //   if (this.inboxDef) {
        //     var inboxData = this.inboxDef.data;
        //     inboxData.forEach(x => {
        //       if (x.dealid_05 == data.dealId) {
        //         x.amount_06 = data.amount;
        //       }
        //     });
        //   }
        // }
      })
  }

}
