import {BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Load} from '../entities/load.entity';
import {CreateLoadInput} from '../inputs/loads/create-load.input';
import {SlotService} from './slot.service';
import {ERR_EVENT_NOT_FOUND} from '../constants/event.error';
import {EventService} from './event.service';
import {sprintf} from 'sprintf-js';
import {
  ERR_FAILED_TO_CREATE_LOAD,
  ERR_FAILED_TO_DELETE_LOAD,
  ERR_LOAD_NOT_FOUND,
} from '../constants/load.error';
import {UpdateLoadInput} from '../inputs/loads/update-load.input';

@Injectable()
export class LoadService {

  constructor(
    @InjectRepository(Load)
    private readonly loadRepository: Repository<Load>,
    @Inject(forwardRef(() => SlotService))
    private readonly slotService: SlotService,
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService,
  ) {
  }

  async getLoads(eventId: number): Promise<Load[]> {
    return this.loadRepository.find({where: {event: {id: eventId}}});
  }

  async getLoadById(id: number): Promise<Load> {
    return this.loadRepository.findOne({where: {id: id}});
  }

  async createLoad(input: CreateLoadInput): Promise<Load> {
    const {
      eventId,
      status,
      capacity,
      landingTime,
      takeOffTime,
      info,
    } = input;

    const event = await this.eventService.getEventById(eventId);
    if (!event) {
      throw new InternalServerErrorException(sprintf(ERR_EVENT_NOT_FOUND, eventId));
    }

    const load = new Load();
    load.event = event;
    load.status = status;
    load.capacity = capacity;
    load.order = await this.getOrder(eventId);
    if (takeOffTime) {
      load.takeOffTime = takeOffTime;
    }
    if (landingTime) {
      load.landingTime = landingTime;
    }
    load.info = info;
    load.slots = [];

    try {
      return this.loadRepository.save(load);
    } catch (e) {
      throw new InternalServerErrorException(ERR_FAILED_TO_CREATE_LOAD);
    }
  }

  async updateLoad(updateData: UpdateLoadInput): Promise<Load> {
    const {
      id,
      capacity,
      landingTime,
      takeOffTime,
      info,
    } = updateData;

    const load = await this.getLoadById(id);
    if (!load) {
      throw new BadRequestException(sprintf(ERR_LOAD_NOT_FOUND, id));
    }

    if (capacity) {
      load.capacity = capacity;
    }

    if (takeOffTime) {
      load.takeOffTime = takeOffTime;
    }

    if (landingTime) {
      load.landingTime = landingTime;
    }

    if (info) {
      load.info = info;
    }

    load.updatedAt = new Date();

    return this.loadRepository.save(load);
  }

  async deleteLoadById(id: number): Promise<Load> {
    const load = await this.getLoadById(id);
    if (!load) {
      throw new BadRequestException(sprintf(ERR_LOAD_NOT_FOUND, id));
    }
    const deleteResult = await this.loadRepository.delete({id: load.id});
    if (deleteResult.affected !== 1) {
      throw new InternalServerErrorException(sprintf(ERR_FAILED_TO_DELETE_LOAD, load.id));
    }
    return load;
  }

  private async getOrder(eventId: number): Promise<number> {
    const result = await this.loadRepository
      .createQueryBuilder('load')
      .select('MAX(load.order)')
      .where('load.eventId = :eventId', {eventId})
      .execute();

    const maxOrder = result[0].max;
    if (maxOrder === null) {
      return 0;
    }
    return maxOrder + 1;
  }

}
