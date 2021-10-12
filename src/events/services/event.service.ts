import {Injectable} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Event} from '../entities/event.entity';
import {CreateEventInput} from '../inputs/events/create-event.input';
import {EventModel} from '../models/event.model';
import {GetEventsFilterInput} from '../inputs/events/get-events-filter.input';
import {UpdateEventInput} from '../inputs/events/update-event.input';
import {Load} from '../entities/load.entity';

@Injectable()
export class EventService {

  constructor(
    private connection: Connection,
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
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
      notes,
    } = createData;
    const event = new Event();
    event.title = title;
    event.startDate = startDate;
    event.endDate = endDate;
    event.notes = notes;
    return await this.eventsRepository.save(event);
  }

  async updateEvent(event: Event, updateData: UpdateEventInput): Promise<Event> {
    const {
      title,
      startDate,
      endDate,
      notes,
    } = updateData;

    if (title) {
      event.title = title;
    }

    if (startDate) {
      event.startDate = startDate;
    }

    if (endDate) {
      event.endDate = endDate;
    }

    if (notes) {
      event.notes = notes;
    }

    return await this.eventsRepository.save(event);
  }

  async deleteEventById(id: number): Promise<boolean> {
    const deleteResult = await this.connection
      .createQueryBuilder()
      .relation(Load, 'load')
      .delete()
      .from(Event)
      .where('id = :id', {id: id})
      .execute();
    return deleteResult.affected === 1;
  }

  async getEventById(id: number): Promise<Event | null> {
    const event = await this.eventsRepository
      .createQueryBuilder('event')
      .where('event.id = :id', {id: id})
      .getOne();
    return (event !== undefined) ? event : null;
  }

  async transformToGraphQlEventModel(event: Event): Promise<EventModel> {

    return {
      id: event.id,
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      notes: event.notes,
    };
  }
}
