import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { MembersService } from '../../users/services/members.service';
import { CreateEventInput } from '../inputs/events/create-event.input';
import { EventModel } from '../models/event.model';
import { GetEventsFilterInput } from '../inputs/events/get-events-filter.input';
import { UpdateEventInput } from '../inputs/events/update-event.input';

@Injectable()
export class EventService {

  private queryRunner: QueryRunner;

  constructor(
    @Inject(CONTEXT)
    private readonly context,
    private connection: Connection,
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    private readonly membersService: MembersService,
  ) {
  }

  async getEvents(filterParams: GetEventsFilterInput): Promise<Event[]> {
    const eventsQueryBuilder = this.eventsRepository.createQueryBuilder('event');

    if (filterParams.dateMin
      || filterParams.dateMax
    ) {
      const queryParts = [];
      const queryParameters = [];

      if (filterParams.dateMin) {
        queryParts.push('client.dateMin >= :date ');
        queryParameters.push({ date: filterParams.dateMin });
      }

      if (filterParams.dateMax) {
        queryParts.push('client.dateMax <= :date ');
        queryParameters.push({ date: filterParams.dateMax });
      }

      for (let i = 0; i < queryParts.length; i++) {
        if (i === 0) {
          eventsQueryBuilder.where(queryParts[i], queryParameters[i]);
        } else {
          eventsQueryBuilder.andWhere(queryParts[i], queryParameters[i]);
        }
      }
    }

    return eventsQueryBuilder.getMany();
  }

  async createEvent(createData: CreateEventInput): Promise<Event> {
    const {
      name,
      date,
      notes,
      staffIds,
    } = createData;
    const event = new Event();
    event.name = name;
    event.date = date;
    event.staffIds = staffIds;
    event.notes = notes;
    return await this.eventsRepository.save(event);
  }


  async updateEvent(updateData: UpdateEventInput): Promise<Event> {
    const {
      id,
      name,
      date,
      notes,
      staffIds,
    } = updateData;

    const currentEvent = await this.getEventById(id);

    if (!currentEvent) {
      throw new BadRequestException(`Event with id: ${id} doesnt exists`);
    }

    if (name) {
      currentEvent.name = name;
    }

    if (date) {
      currentEvent.date = date;
    }

    if (staffIds) {
      currentEvent.staffIds = staffIds;
    }

    if (notes) {
      currentEvent.notes = notes;
    }

    return this.eventsRepository.save(currentEvent);
  }

  async deleteEventById(id: number): Promise<boolean> {
    const event = await this.getEventById(id);
    if (!event) {
      throw new BadRequestException(`Event with id: ${id} doesn't exists`);
    }

    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const eventDeleteResult = await this.queryRunner.connection
        .createQueryBuilder()
        .delete()
        .from(Event)
        .where('id = :id', { id: id })
        .execute();
      await this.queryRunner.commitTransaction();
      return eventDeleteResult.affected === 1;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw new BadRequestException(`Failed to delete event with id: ${id}`);
    } finally {
      await this.queryRunner.release();
    }
  }

  async getEventById(id: number): Promise<Event> {
    const event = await this.eventsRepository
      .createQueryBuilder('event')
      .where('event.id = :id', { id: id })
      .getOne();
    return event;
  }

  async transformToGraphQlEventModel(event: Event): Promise<EventModel> {
    let staff = [];
    if (event.staffIds
      && event.staffIds.length
    ) {
      const members = await this.membersService.getMembersByIds(event.staffIds, []);
      staff = members.map(member => this.membersService.transformToGraphQlMemberModel(member));
    }

    return {
      id: event.id,
      name: event.name,
      staff: staff,
      date: event.date,
      notes: event.notes,
    };
  }
}
