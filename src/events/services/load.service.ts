import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {CONTEXT} from '@nestjs/graphql';
import {Connection, QueryRunner, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {MemberService} from '../../users/services/member.service';
import {Load} from '../entities/load.entity';
import {ClientService} from '../../users/services/client.service';
import {CreateLoadInput} from '../inputs/loads/create-load.input';
import {EventService} from './event.service';
import {LoadModel} from '../models/load.model';
import {UserService} from '../../users/services/user.service';
import {Slot} from '../entities/slot.entity';
import {UpdateLoadInput} from '../inputs/loads/update-load.input';

@Injectable()
export class LoadService {

  private queryRunner: QueryRunner;

  constructor(
    // @InjectModel('Event') private eventModel: Model<EventInterface>,
    @Inject(CONTEXT)
    private readonly context,
    private connection: Connection,
    @InjectRepository(Load)
    private readonly loadRepository: Repository<Load>,
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
    private readonly memberService: MemberService,
    private readonly clientService: ClientService,
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {
  }

  async getLoads(eventId: number): Promise<Load[]> {
    const event = await this.eventService.getEventById(eventId);
    if (!event) {
      throw new BadRequestException(`Event with id: ${eventId} doesnt exists`);
    }
    return this.loadRepository
      .createQueryBuilder('load')
      .leftJoinAndSelect('load.event', 'event')
      .where('load.eventId = :eventId', {eventId: eventId})
      .orderBy('load.order', 'ASC')
      .getMany();
  }

  async getLoadById(id: number): Promise<Load> {
    const load = await this.loadRepository
      .createQueryBuilder('load')
      .leftJoinAndSelect('load.event', 'event')
      .where('load.id = :id', {id: id})
      .getOne();
    return load;
  }

  async createLoad(createData: CreateLoadInput): Promise<Load> {
    const {
      eventId,
      capacity,
      status,
      order,
      time,
      notes,
    } = createData;

    const event = await this.eventService.getEventById(eventId);
    if (!event) {
      throw new BadRequestException(`Event with id: ${eventId} doesnt exists`);
    }

    try {
      const load = new Load();
      load.event = event;
      load.status = status;
      load.time = time;
      load.capacity = capacity;
      load.notes = notes;
      if (order) {
        load.order = order;
      } else {
        load.order = (await this.getLoads(eventId)).length;
      }
      return await this.loadRepository.save(load);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Failed to create load');
    }
  }

  async updateLoad(updateData: UpdateLoadInput): Promise<Load> {
    const {
      id,
      capacity,
      status,
      order,
      time,
      notes,
    } = updateData;

    const currentLoad = await this.getLoadById(id);

    if (!currentLoad) {
      throw new BadRequestException(`Load with id: ${id} doesnt exists`);
    }

    if (status) {
      currentLoad.status = status;
    }

    if (order !== undefined
      && order !== null
    ) {
      currentLoad.order = order;
    }

    if (time) {
      currentLoad.time = time;
    }

    if (capacity) {
      currentLoad.capacity = capacity;
    }

    if (notes) {
      currentLoad.notes = notes;
    }

    return this.loadRepository.save(currentLoad);
  }

  async deleteLoadById(id: number): Promise<LoadModel> {
    const load = await this.getLoadById(id);
    if (!load) {
      throw new BadRequestException(`Load with id: ${id} doesn't exists`);
    }

    const deleteResult = await this.loadRepository
      .createQueryBuilder('load')
      .delete()
      .from(Load)
      .where('id = :id', {id: id})
      .execute();

    await this.reorderLoads(load.event.id);

    if (deleteResult.affected !== 1) {
      throw new BadRequestException(`Failed to delete event with id: ${id}`);
    }
    return load;
  }

  async reorderLoads(eventId: number) {
    const loads = await this.getLoads(eventId);
    let i = 0;
    for (const currentLoad of loads) {
      currentLoad.order = i;
      i++;
      await this.loadRepository.save(currentLoad);
    }
  }

  async transformToGraphQlLoadModel(loadEntity: Load): Promise<LoadModel> {
    const eventModel = await this.eventService.transformToGraphQlEventModel(loadEntity.event);

    return {
      id: loadEntity.id,
      event: eventModel,
      order: loadEntity.order,
      status: loadEntity.status,
      time: loadEntity.time,
      capacity: loadEntity.capacity,
      notes: loadEntity.notes,
    };
  }

}
