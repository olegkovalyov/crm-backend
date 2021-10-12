import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {EventModel} from '../models/event.model';
import {EventService} from '../services/event.service';
import {CreateEventInput} from '../inputs/events/create-event.input';
import {GetEventsFilterInput} from '../inputs/events/get-events-filter.input';
import {UpdateEventInput} from '../inputs/events/update-event.input';
import {BadRequestException} from '@nestjs/common';
import {EventValidatorService} from '../services/event-validator.service';

@Resolver(of => EventModel)
export class EventResolver {
  constructor(
    private readonly eventService: EventService,
    private readonly eventValidatorService: EventValidatorService,
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
  async updateEvent(@Args('updateEventInput') updateEventData: UpdateEventInput): Promise<EventModel> {
    const event = await this.eventService.getEventById(updateEventData.id);
    if (!event) {
      throw new BadRequestException(`Event with id: ${updateEventData.id} doesnt exists`);
    }

    if (updateEventData.startDate) {
      const endDate = updateEventData.endDate ? updateEventData.endDate : event.endDate;
      if (!await this.eventValidatorService.validateStartDate(updateEventData.startDate, endDate)) {
        throw new BadRequestException(`Start Date should be less than End Date`);
      }
    }

    if (updateEventData.endDate) {
      const startDate = updateEventData.startDate ? updateEventData.startDate : event.startDate;
      if (!await this.eventValidatorService.validateEndDate(updateEventData.endDate, startDate)) {
        throw new BadRequestException(`End Date should be greater than Start Date`);
      }
    }

    const updatedEvent = await this.eventService.updateEvent(event, updateEventData);
    return this.eventService.transformToGraphQlEventModel(updatedEvent);
  }

  @Mutation(returns => EventModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteEvent(@Args('id', {type: () => Int}) id: number): Promise<EventModel> {
    const event = await this.eventService.getEventById(id);
    if (!event) {
      throw new BadRequestException(`Event with id: ${id} doesnt exists`);
    }
    const success = await this.eventService.deleteEventById(id);
    if (!success) {
      throw new BadRequestException(`Failed to delete event with id: ${id}`);
    }
    return this.eventService.transformToGraphQlEventModel(event);
  }

  @Query(returns => EventModel, {nullable: true})
  async getEvent(@Args('id', {type: () => Int}) id: number): Promise<EventModel> {
    const event = await this.eventService.getEventById(id);
    if (!event) {
      throw new BadRequestException('Event not found');
    }
    return this.eventService.transformToGraphQlEventModel(event);
  }
}
