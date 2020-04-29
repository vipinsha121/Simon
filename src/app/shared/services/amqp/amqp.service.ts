import { Injectable } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Observable } from 'rxjs';


export const AMQP_EXCHANGE_URL = "/exchange/";

@Injectable({
  providedIn: 'root'
})
export class AmqpService {

  constructor(private rxStompService: RxStompService) { }

  publishToRabbitMQ(routeValue: string, message: any) {
    this.rxStompService.publish({ destination: AMQP_EXCHANGE_URL + routeValue, body: message });
  }

  subscribeToRabbitMQ(routeValue: string): Observable<any> {
    return this.rxStompService.watch(routeValue);
  }
}
