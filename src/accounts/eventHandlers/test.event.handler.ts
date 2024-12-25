import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {TestEvent} from '../events/test.event';

@EventsHandler(TestEvent)
export class TestEventHandler implements IEventHandler<TestEvent> {
  constructor() {
  }

  async handle(event: TestEvent) {
    console.log('Event handled: ', event.id);
  }
}
