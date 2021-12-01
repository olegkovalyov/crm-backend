import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {EventModel} from '../models/event.model';
import {EventService} from '../services/event.service';
import {CreateEventInput} from '../inputs/events/create-event.input';
import {GraphqlService} from '../services/graphql.service';
import {GetEventsInput} from '../inputs/events/get-events.input';
import {BadRequestException} from '@nestjs/common';
import {sprintf} from 'sprintf-js';
import {ERR_EVENT_NOT_FOUND} from '../constants/event.error';
import {UpdateEventInput} from '../inputs/events/update-event.input';

@Resolver(()=> EventModel)
export class EventResolver {
  constructor(
    private readonly eventService: EventService,
    private readonly graphQlService: GraphqlService,
  ) {
  }

  @Query(() => [EventModel])
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getEvents(@Args('getEventsInput') getEventsInput: GetEventsInput): Promise<EventModel[]> {
    const events = await this.eventService.getEvents(getEventsInput);
    return events.map(event => this.graphQlService.constructEventModel(event));
  }

  @Mutation(()=> EventModel)
  async createEvent(@Args('createEventInput') createEventData: CreateEventInput): Promise<EventModel> {
    const event = await this.eventService.createEvent(createEventData);
    return this.graphQlService.constructEventModel(event);
  }

  @Query(() => EventModel, {nullable: true})
  async getEvent(@Args('id', {type: () => Int}) id: number): Promise<EventModel> {
    const event = await this.eventService.getEventById(id);
    if (!event) {
      throw new BadRequestException(sprintf(ERR_EVENT_NOT_FOUND, id));
    }
    return this.graphQlService.constructEventModel(event);
  }

  @Mutation(() => EventModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async updateEvent(@Args('updateEventInput') updateEventData: UpdateEventInput): Promise<EventModel> {
    const updatedEvent = await this.eventService.updateEvent(updateEventData);
    return this.graphQlService.constructEventModel(updatedEvent);
  }

  @Mutation(() => EventModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteEvent(@Args('id', {type: () => Int}) id: number): Promise<EventModel> {
    const event = await this.eventService.deleteEventById(id);
    return this.graphQlService.constructEventModel(event);
  }
}
