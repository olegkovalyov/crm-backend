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
    const event = await this.eventService.getEventById(eventId);
    if (!event) {
      throw new BadRequestException(`Event with id: ${eventId} doesnt exists`);
    }
    return this.loadRepository
      .createQueryBuilder('load')
      .leftJoinAndSelect('load.event', 'event')
      .where('load.eventId = :eventId', { eventId: eventId })
      .orderBy('load.order', 'ASC')
      .getMany();
  }

  async createLoad(createData: CreateLoadInput): Promise<Load> {
    const {
      eventId,
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

    try {
      let load = new Load();
      load.event = event;
      load.status = status;
      load.date = date;
      load.aircraft = aircraft;
      load.notes = notes;
      load.order = (await this.getLoads(eventId)).length;
      load = await this.loadRepository.save(load);
      load.slots = await this.saveSlots(slots, load);
      return await this.loadRepository.save(load);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Failed to create load');
    }
  }

  async getLoadById(id: number): Promise<Load> {
    const load = await this.loadRepository
      .createQueryBuilder('load')
      .leftJoinAndSelect('load.event', 'event')
      .leftJoinAndSelect('load.slots', 'slots')
      .where('load.id = :id', { id: id })
      .getOne();
    //  const load = await this.loadRepository.findOne({ id: id });
    return load;
  }

  async transformToGraphQlLoadModel(loadEntity: Load): Promise<LoadModel> {
    console.log(loadEntity);
    const eventModel = await this.eventService.transformToGraphQlEventModel(loadEntity.event);

    let slotModels: SlotModel[] = [];

    if (loadEntity.slots.length) {
      slotModels = loadEntity.slots.map(slot => {
        return {
          userId: slot.userId,
          firstName: slot.firstName,
          lastName: slot.lastName,
          description: slot.description,
          role: slot.role,
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

    if (order !== undefined
      && order !== null
    ) {
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
      // await this.removeSlotsByIds(currentLoad.slotIds);
      // currentLoad.slotIds = await this.saveSlots(slots, currentLoad);
    }

    return this.loadRepository.save(currentLoad);
  }

  private async saveSlots(slotsInput: SlotInput[], load: Load): Promise<Slot[]> {
    const slots = await Promise.all(slotsInput.map(async slotInputData => {
      const slot = new Slot();
      slot.load = load;
      slot.firstName = slotInputData.firstName;
      slot.lastName = slotInputData.lastName;
      slot.userId = slotInputData.userId;
      slot.description = slotInputData.description;
      slot.role = slotInputData.role;
      await this.slotRepository.save(slot);
      return slot;
    }));
    return slots;
  }

  async removeSlotsByIds(slotIds: number[]): Promise<void> {
    for (const slotId of slotIds) {
      await this.slotRepository.delete({ id: slotId });
    }
  }

  async deleteLoadById(id: number): Promise<boolean> {
    const load = await this.getLoadById(id);
    if (!load) {
      throw new BadRequestException(`Load with id: ${id} doesn't exists`);
    }

    const deleteResult = await this.loadRepository
      .createQueryBuilder('load')
      .delete()
      .from(Load)
      .where('id = :id', { id: id })
      .execute();

    await this.reorderLoads(load.event.id);

    return deleteResult.affected === 1;
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

}
