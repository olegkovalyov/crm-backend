import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberService } from '../../users/services/member.service';
import { Load } from '../entities/load.entity';
import { ClientService } from '../../users/services/client.service';
import { CreateLoadInput } from '../inputs/loads/create-load.input';
import { EventService } from './event.service';
import { LoadModel } from '../models/load.model';
import { SlotModel } from '../models/slot.model';
import { UserService } from '../../users/services/user.service';
import { Slot } from '../entities/slot.entity';
import { UpdateLoadInput } from '../inputs/loads/update-load.input';
import { SlotInput } from '../inputs/loads/slot.input';

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
    return this.loadRepository
      .createQueryBuilder('load')
      .leftJoinAndSelect('load.event', 'event')
      .where('load.eventId = :eventId', { eventId: eventId })
      .getMany();
  }

  async createLoad(createData: CreateLoadInput): Promise<Load> {
    const {
      eventId,
      order,
      status,
      date,
      slots,
      aircraft,
      notes,
    } = createData;

    const event = await this.eventService.getEventById(eventId);
    if (!event) {
      throw new BadRequestException(`Event with id: ${eventId} doesnt exists`);
    }

    const slotIds = await this.saveSlots(slots);

    const load = new Load();
    load.event = event;
    load.status = status;
    load.date = date;
    load.aircraft = aircraft;
    load.notes = notes;
    load.slotIds = slotIds;
    load.order = order;

    return await this.loadRepository.save(load);
  }

  async getLoadById(id: number): Promise<Load> {
    const load = await this.loadRepository
      .createQueryBuilder('load')
      .leftJoinAndSelect('load.event', 'event')
      .where('load.id = :id', { id: id })
      .getOne();
    return load;
  }

  async transformToGraphQlLoadModel(loadEntity: Load): Promise<LoadModel> {
    const eventModel = await this.eventService.transformToGraphQlEventModel(loadEntity.event);

    let slots: Slot[] = [];
    if (loadEntity.slotIds.length) {
      slots = await this.slotRepository.createQueryBuilder('slot')
        .leftJoinAndSelect('slot.user', 'user')
        .where('slot.id IN(:...ids)', { ids: loadEntity.slotIds })
        .getMany();
    }

    let slotModels: SlotModel[] = [];

    if (slots
      && slots.length
    ) {
      slotModels = slots.map(slot => {
        return {
          userId: slot.user.id,
          description: slot.description,
        };
      });
    }

    return {
      id: loadEntity.id,
      event: eventModel,
      order: loadEntity.order,
      status: loadEntity.status,
      date: loadEntity.date,
      aircraft: loadEntity.aircraft,
      notes: loadEntity.notes,
      slots: slotModels,
    };
  }


  async updateLoad(updateData: UpdateLoadInput): Promise<Load> {
    const {
      id,
      status,
      date,
      slots,
      aircraft,
      order,
      notes,
    } = updateData;

    const currentLoad = await this.getLoadById(id);

    if (!currentLoad) {
      throw new BadRequestException(`Load with id: ${id} doesnt exists`);
    }


    if (status) {
      currentLoad.status = status;
    }

    if (order) {
      currentLoad.order = order;
    }

    if (date) {
      currentLoad.date = date;
    }

    if (aircraft) {
      currentLoad.aircraft = aircraft;
    }

    if (notes) {
      currentLoad.notes = notes;
    }

    if (slots) {
      await this.removeSlotsByIds(currentLoad.slotIds);
      currentLoad.slotIds= await this.saveSlots(slots);
    }

    return this.loadRepository.save(currentLoad);
  }

  private async saveSlots(slots: SlotInput[]): Promise<number[]> {
    const slotIds = await Promise.all(slots.map(async slotInputData => {
      const user = await this.userService.getUserById(slotInputData.userId);
      if (!user) {
        throw new BadRequestException(`User with id: ${slotInputData.userId} doesnt exists`);
      }
      const slot = new Slot();
      slot.user = user;
      slot.description = slotInputData.description;
      await this.slotRepository.save(slot);
      return slot.id;
    }));
    return slotIds;
  }

  private async removeSlotsByIds(slotIds: number[]): Promise<void> {
    for (const slotId of slotIds) {
      await this.slotRepository.delete({ id: slotId });
    }
  }

  async deleteLoadById(id: number): Promise<boolean> {
    const load = await this.getLoadById(id);
    if (!load) {
      throw new BadRequestException(`Load with id: ${id} doesn't exists`);
    }

    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      await this.removeSlotsByIds(load.slotIds);
      const loadDeleteResult = await this.queryRunner.connection
        .createQueryBuilder()
        .delete()
        .from(Load)
        .where('id = :id', { id: id })
        .execute();
      await this.queryRunner.commitTransaction();
      return loadDeleteResult.affected === 1;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw new BadRequestException(`Failed to delete load with id: ${id}`);
    } finally {
      await this.queryRunner.release();
    }
  }

}
