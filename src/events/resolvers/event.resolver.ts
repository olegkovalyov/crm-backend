import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventModel } from '../models/event.model';
import { EventService } from '../services/event.service';
import { CreateEventInput } from '../inputs/events/create-event.input';
import { GetEventsFilterInput } from '../inputs/events/get-events-filter.input';
import { UpdateEventInput } from '../inputs/events/update-event.input';
import { BadRequestException } from '@nestjs/common';

@Resolver(of => EventModel)
export class EventResolver {
  constructor(
    private readonly eventService: EventService,
  ) {
  }

  @Query(returns => [EventModel])
  async getEvents(@Args('getEventsFilterInput') getEventsFilterData: GetEventsFilterInput): Promise<EventModel[]> {
    // throw new BadRequestException('Failed to load events');
    const events = await this.eventService.getEvents(getEventsFilterData);
    return Promise.all(events.map(event => this.eventService.transformToGraphQlEventModel(event)));
  }

  @Mutation(returns => EventModel)
  async createEvent(@Args('createEventInput') createEventData: CreateEventInput): Promise<EventModel> {
    // throw new BadRequestException('item already exist');
    const event = await this.eventService.createEvent(createEventData);
    return this.eventService.transformToGraphQlEventModel(event);
  }


  @Mutation(returns => EventModel)
  async updateEvent(@Args('updateEventInput') updateData: UpdateEventInput): Promise<EventModel> {
    const updatedEvent = await this.eventService.updateEvent(updateData);
    return this.eventService.transformToGraphQlEventModel(updatedEvent);
  }

  @Mutation(returns => EventModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteEvent(@Args('id', { type: () => Int }) id: number): Promise<EventModel> {
    const deletedEvent =  await this.eventService.deleteEventById(id);
    return this.eventService.transformToGraphQlEventModel(deletedEvent);
  }

  @Query(returns => EventModel, { nullable: true })
  async getEvent(@Args('id', { type: () => Int }) id: number): Promise<EventModel> {
    const event = await this.eventService.getEventById(id);
    if (!event) {
      throw new BadRequestException('Event not found');
    }
    return this.eventService.transformToGraphQlEventModel(event);
  }
}
