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
import { CreateSlotInput } from '../inputs/loads/create-slot.input';
import { UserType } from '../../users/interfaces/user.interface';
import { MemberRole } from '../../users/interfaces/member.interface';
import { ClientRole } from '../../users/interfaces/client.interface';
import { UpdateClientInput } from '../../users/inputs/clients/update-client.input';

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
      .leftJoinAndSelect('load.slots', 'slots')
      .where('load.eventId = :eventId', { eventId: eventId })
      .orderBy('load.order', 'ASC')
      .getMany();
  }

  async createLoad(createData: CreateLoadInput): Promise<Load> {
    const {
      eventId,
      status,
      date,
      aircraft,
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
      load.date = date;
      load.aircraft = aircraft;
      load.notes = notes;
      load.order = (await this.getLoads(eventId)).length;
      load.slots = [];
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

  async getSlotById(id: number): Promise<Slot> {
    const slot = await this.slotRepository
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.load', 'load')
      .where('slot.id = :id', { id: id })
      .getOne();
    //  const load = await this.loadRepository.findOne({ id: id });
    return slot;
  }

  async transformToGraphQlLoadModel(loadEntity: Load): Promise<LoadModel> {
    const eventModel = await this.eventService.transformToGraphQlEventModel(loadEntity.event);

    let slotModels: SlotModel[] = [];

    if (loadEntity.slots.length) {
      slotModels = loadEntity.slots.map(slot => {
        return {
          id: slot.id,
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

  async transformToGraphQlSlotModel(slotEntity: Slot): Promise<SlotModel> {
    return {
      id: slotEntity.id,
      userId: slotEntity.userId,
      firstName: slotEntity.firstName,
      lastName: slotEntity.lastName,
      role: slotEntity.role,
      description: slotEntity.description,
    };
  }


  async updateLoad(updateData: UpdateLoadInput): Promise<Load> {
    const {
      id,
      status,
      date,
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

    return this.loadRepository.save(currentLoad);
  }

  async createSlot(slotData: CreateSlotInput): Promise<Slot> {
    const load = await this.getLoadById(slotData.loadId);
    if (!load) {
      throw new BadRequestException(`Load with id: ${slotData.loadId} doesnt exists`);
    }

    const user = await this.userService.getUserById(slotData.userId);
    if (!user) {
      throw new BadRequestException(`User with id: ${slotData.userId} doesnt exists`);
    }

    if (user.userType === UserType.MEMBER) {
      const member = await this.memberService.getMemberByUserId(user.id);
      if (!member.roles.includes(slotData.role as unknown as MemberRole)) {
        throw new BadRequestException(`Invalid role`);
      }
    }

    if (user.userType === UserType.CLIENT) {
      const client = await this.clientService.getClientByUserId(user.id);
      if (client.role !== slotData.role as unknown as ClientRole) {
        throw new BadRequestException(`Invalid role`);
      }
      await this.clientService.setAssignedStatus(client);
    }

    const slot = new Slot();
    slot.userId = slotData.userId;
    slot.firstName = slotData.firstName;
    slot.lastName = slotData.lastName;
    slot.role = slotData.role;
    slot.description = slotData.description;
    slot.load = load;

    try {
      await this.slotRepository.save(slot);
      load.slots.push(slot);
      await this.loadRepository.save(load);
      return slot;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(`Failed to add slot`);
    }
  }

  async deleteSlotById(id: number): Promise<boolean> {
    const slot = await this.getSlotById(id);
    if (!slot) {
      throw new BadRequestException(`Slot with id: ${id} doesn't exists`);
    }

    try {
      await this.loadRepository
        .createQueryBuilder('slot')
        .delete()
        .from(Slot)
        .where('id = :id', { id: id })
        .execute();

      const client = await this.clientService.getClientByUserId(slot.userId);
      if (client) {
        await this.clientService.deleteAssignedStatus(client);
      }

      const load = await this.getLoadById(slot.load.id);
      load.slots = load.slots.filter(slot => slot.id !== id);
      await this.loadRepository.save(load);
      return true;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(`Failed to delete slot`);
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
