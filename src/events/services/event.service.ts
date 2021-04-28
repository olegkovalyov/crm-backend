import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {CONTEXT} from '@nestjs/graphql';
import {Connection, QueryRunner, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Event} from '../entities/event.entity';
import {MemberService} from '../../users/services/member.service';
import {CreateEventInput} from '../inputs/events/create-event.input';
import {EventModel} from '../models/event.model';
import {GetEventsFilterInput} from '../inputs/events/get-events-filter.input';
import {UpdateEventInput} from '../inputs/events/update-event.input';
import {Load} from '../entities/load.entity';

@Injectable()
export class EventService {

  private queryRunner: QueryRunner;

  constructor(
    @Inject(CONTEXT)
    private readonly context,
    private connection: Connection,
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(Load)
    private readonly loadRepository: Repository<Load>,
    private readonly membersService: MemberService,
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
        queryParts.push('event.startDate >= :date ');
        queryParameters.push({date: filterParams.dateMin});
      }

      if (filterParams.dateMax) {
        queryParts.push('event.endDate <= :date ');
        queryParameters.push({date: filterParams.dateMax});
      }

      for (let i = 0; i < queryParts.length; i++) {
        if (i === 0) {
          eventsQueryBuilder.where(queryParts[i], queryParameters[i]);
        } else {
          eventsQueryBuilder.andWhere(queryParts[i], queryParameters[i]);
        }
      }
    }
    eventsQueryBuilder.orderBy('event.startDate', 'DESC');

    return eventsQueryBuilder.getMany();
  }

  async createEvent(createData: CreateEventInput): Promise<Event> {
    const {
      title,
      startDate,
      endDate,
    } = createData;
    const event = new Event();
    event.title = title;
    event.startDate = startDate;
    event.endDate = endDate;
    return await this.eventsRepository.save(event);
  }

  async updateEvent(updateData: UpdateEventInput): Promise<Event> {
    const {
      id,
      title,
      startDate,
      endDate,
    } = updateData;

    const currentEvent = await this.getEventById(id);

    if (!currentEvent) {
      throw new BadRequestException(`Event with id: ${id} doesnt exists`);
    }

    if (title) {
      currentEvent.title = title;
    }

    if (startDate) {
      currentEvent.startDate = startDate;
    }

    if (endDate) {
      currentEvent.endDate = endDate;
    }

    return this.eventsRepository.save(currentEvent);
  }

  async deleteEventById(id: number): Promise<EventModel> {
    const event = await this.getEventById(id);
    if (!event) {
      throw new BadRequestException(`Event with id: ${id} doesn't exists`);
    }

    const deleteResult = await this.eventsRepository
      .createQueryBuilder('event')
      .delete()
      .from(Event)
      .where('id = :id', {id: id})
      .execute();

    if (deleteResult.affected !== 1) {
      throw new BadRequestException(`Failed to delete event with id: ${id}`);
    }
    return event;
  }

  async getEventById(id: number): Promise<Event> {
    const event = await this.eventsRepository
      .createQueryBuilder('event')
      .where('event.id = :id', {id: id})
      .getOne();
    return event;
  }

  async transformToGraphQlEventModel(event: Event): Promise<EventModel> {

    return {
      id: event.id,
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
    };
  }
}
