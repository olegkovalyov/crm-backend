import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventModel } from '../models/event.model';
import { EventService } from '../services/event.service';
import { IEvent } from '../interfaces/event.interface';
import { CreateEventInput } from '../inputs/create-event.input';
import { UpdateEventInput } from '../inputs/update-event.input';
import { UserModel } from '../../users/models/user.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IsAdminOrManifestGuard } from '../../auth/guards/is-admin-or-manifest-guard.guard';
import { IUser } from '../../users/interfaces/user.interface';

@Resolver(of => EventModel)
export class EventResolver {
  constructor(
    private readonly eventService: EventService,
  ) {
  }

  @Query(returns => [EventModel], { nullable: 'items' })
  async getEvents(): Promise<IEvent[]> {
    return this.eventService.getEvents();
  }

  @Mutation(returns => EventModel)
  async createEvent(@Args('createEventData') createData: CreateEventInput): Promise<IEvent> {
    return this.eventService.createEvent(createData);
  }

  @Mutation(returns => EventModel)
  async updateEvent(@Args('updateEventData') updateData: UpdateEventInput): Promise<IEvent> {
    return this.eventService.updateEvent(updateData);
  }

  @Mutation(returns => EventModel, { nullable: true })
  async removeEvent(@Args('id') id: string) {
    return this.eventService.removeEventById(id);
  }

  @Query(returns => EventModel, { nullable: true })
  async getEvent(@Args('id') id: string): Promise<IEvent> {
    return this.eventService.getEventById(id);
  }
}
