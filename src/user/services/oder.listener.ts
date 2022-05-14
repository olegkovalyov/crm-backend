import {Injectable} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';

@Injectable()
export class OrderCreatedListener {
  @OnEvent('order.created22', {async: true})
  async handleOrderCreatedEvent(event: any) {
    for(let i = 0; i < 5000000000; i++) {
      let b = i;
    }
    // handle and process "OrderCreatedEvent" event
    console.log(event);
  }
}