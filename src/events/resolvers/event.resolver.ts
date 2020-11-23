import { Resolver } from '@nestjs/graphql';
import { EventModel } from '../models/event.model';
import { EventService } from '../services/event.service';

@Resolver(of => EventModel)
export class EventResolver {
  constructor(
    private readonly eventService: EventService,
  ) {
  }
  //
  // @Query(returns => [EventModel])
  // async getEvents(): Promise<EventInterface[]> {
  //   return this.eventService.getEvents();
  // }
  //
  // @Mutation(returns => EventModel)
  // async createEvent(@Args('createEventData') createData: CreateEventInput): Promise<EventInterface> {
  //   return this.eventService.createEvent(createData);
  // }
  //
  // @Mutation(returns => EventModel)
  // async updateEvent(@Args('updateEventData') updateData: UpdateEventInput): Promise<EventInterface> {
  //   return this.eventService.updateEvent(updateData);
  // }
  //
  // @Mutation(returns => EventModel, { nullable: true })
  // async deleteEvent(@Args('id') id: string) {
  //   return this.eventService.removeEventById(id);
  // }
  //
  // @Query(returns => EventModel, { nullable: true })
  // async getEvent(@Args('id') id: string): Promise<EventInterface> {
  //   return this.eventService.getEventById(id);
  // }

}
