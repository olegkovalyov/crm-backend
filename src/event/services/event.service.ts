import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {FindOperator, Like, Raw, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Event} from '../entities/event.entity';
import {CreateEventInput} from '../inputs/events/create-event.input';
import {
  ERR_DATE_FILTERS_NOT_SET,
  ERR_EVENT_NOT_FOUND,
  ERR_FAILED_TO_CREATE_EVENT,
  ERR_FAILED_TO_DELETE_EVENT,
} from '../constants/event.error';
import {GetEventsInput} from '../inputs/events/get-events.input';
import {GetEventsConditionInterface} from '../interfaces/event.interface';
import {sprintf} from 'sprintf-js';
import {UpdateEventInput} from '../inputs/events/update-event.input';

@Injectable()
export class EventService {

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {
  }

  async getEvents(filterParams: Partial<GetEventsInput>): Promise<Event[]> {
    const conditions = EventService.composeSearchConditions(filterParams);
    return this.eventRepository.find({
      where: conditions,
      order: {
        id: 'DESC',
      },
    });
  }

  async createEvent(input: CreateEventInput): Promise<Event> {
    const {
      name,
      startDate,
      endDate,
      info,
    } = input;

    const event = new Event();
    event.name = name;
    event.startDate = startDate;
    event.endDate = endDate;
    event.info = info;

    try {
      return this.eventRepository.save(event);
    } catch (e) {
      throw new InternalServerErrorException(ERR_FAILED_TO_CREATE_EVENT);
    }
  }

  async getEventById(id: number): Promise<Event> {
    return this.eventRepository.findOne({where: {id: id}});
  }

  async updateEvent(updateData: UpdateEventInput): Promise<Event> {
    const {
      id,
      name,
      startDate,
      endDate,
      info,
    } = updateData;

    const event = await this.getEventById(id);
    if (!event) {
      throw new BadRequestException(sprintf(ERR_EVENT_NOT_FOUND, id));
    }

    if (name) {
      event.name = name;
    }

    if (startDate) {
      event.startDate = startDate;
    }

    if (endDate) {
      event.endDate = endDate;
    }

    if (info) {
      event.info = info;
    }

    event.updatedAt = new Date();

    return this.eventRepository.save(event);
  }

  async deleteEventById(id: number): Promise<Event> {
    const event = await this.getEventById(id);
    if (!event) {
      throw new BadRequestException(sprintf(ERR_EVENT_NOT_FOUND, id));
    }
    const deleteResult = await this.eventRepository.delete({id: event.id});
    if (deleteResult.affected !== 1) {
      throw new InternalServerErrorException(sprintf(ERR_FAILED_TO_DELETE_EVENT, event.id));
    }
    return event;
  }

  private static composeSearchConditions(filterParams: Partial<GetEventsInput>): GetEventsConditionInterface {
    const {
      name,
      startDateMax,
      startDateMin,
      endDateMax,
      endDateMin,
    } = filterParams;
    const conditions: GetEventsConditionInterface = {};

    if (name
      && name.length > 2
    ) {
      conditions.name = Like(`%${name}%`);
    }

    if (startDateMin
      || startDateMax
    ) {
      conditions.startDate = EventService.composeMaxMinDateCondition(startDateMin, startDateMax);
    }

    if (endDateMin
      || endDateMax
    ) {
      conditions.endDate = EventService.composeMaxMinDateCondition(endDateMin, endDateMax);
    }

    return conditions;
  }

  private static composeMaxMinDateCondition(
    dateMin: Date | undefined,
    dateMax: Date | undefined,
  ): FindOperator<any> {

    if (!dateMin
      && !dateMax
    ) {
      throw new InternalServerErrorException(ERR_DATE_FILTERS_NOT_SET);
    }

    let findOperator: FindOperator<any>;

    if (dateMin) {
      findOperator = Raw((alias) => `${alias} >= :date`,
        {date: dateMin},
      );
    }

    if (dateMax) {
      findOperator = Raw((alias) => `${alias} <= :date`,
        {date: dateMax},
      );
    }

    if (dateMin
      && dateMax
    ) {
      findOperator = Raw((alias) => `${alias} >= :dateMin AND ${alias} <= :dateMax`,
        {
          dateMin,
          dateMax,
        },
      );
    }

    return findOperator;
  }
}
