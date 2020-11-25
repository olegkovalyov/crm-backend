import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Connection, Repository } from 'typeorm';
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

@Injectable()
export class LoadService {
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

  async transformToGraphQlLoadModel(loadEntity: Load): Promise<LoadModel> {
    const eventModel = await this.eventService.transformToGraphQlEventModel(loadEntity.event);

    const slots = await this.slotRepository.createQueryBuilder('slot')
      .leftJoinAndSelect('slot.user', 'user')
      .where('slot.id IN(:...ids)', { ids: loadEntity.slotIds })
      .getMany();

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

  // async getLoads(eventId: string): Promise<ILoad[]> {
  //   const event = await this.eventModel.findOne({ id: eventId }).exec();
  //   if (!event) {
  //     throw new BadRequestException('Event not found');
  //   }
  //
  //   return this.loadModel
  //     .find({ event: event._id })
  //     .populate('event')
  //     .populate('members')
  //     .populate('clients');
  // }
  //
  // async createLoad(createData: CreateLoadInput): Promise<ILoad> {
  //   const {
  //     eventId,
  //     status,
  //     date,
  //     loadNumber,
  //     aircraft,
  //     memberIds,
  //     clientIds,
  //     notes,
  //   } = createData;
  //
  //   const event = await this.eventModel.findOne({ id: eventId });
  //   const members = await this.memberModel.find({ id: { $in: memberIds } }).exec();
  //   const clients = await this.clientModel.find({ id: { $in: clientIds } }).exec();
  //
  //   if (!event) {
  //     throw new BadRequestException(`Event with id: ${eventId} doesnt exists`);
  //   }
  //
  //   const load = await this.loadModel.create({
  //     id: uuid(),
  //     event,
  //     status,
  //     date,
  //     loadNumber,
  //     aircraft,
  //     members,
  //     clients,
  //     notes: notes ? notes : null,
  //   });
  //
  //   event.loads.push(load);
  //   event.save();
  //   return load;
  // }
  //
  //
  // async updateLoad(updateData: UpdateLoadInput): Promise<ILoad> {
  //   const {
  //     id,
  //     status,
  //     date,
  //     loadNumber,
  //     aircraft,
  //     notes,
  //   } = updateData;
  //
  //   const currentLoad = await this.loadModel.findOne({ id: updateData.id });
  //
  //   if (!currentLoad) {
  //     throw new BadRequestException(`Load with id: ${id} doesnt exists`);
  //   }
  //
  //
  //   if (status) {
  //     currentLoad.status = status;
  //   }
  //
  //   if (loadNumber) {
  //     currentLoad.loadNumber = loadNumber;
  //   }
  //
  //   if (date) {
  //     currentLoad.date = date;
  //   }
  //
  //   if (aircraft) {
  //     currentLoad.aircraft = aircraft;
  //   }
  //
  //   if (notes) {
  //     currentLoad.notes = notes;
  //   }
  //
  //   return currentLoad.save();
  // }
  //
  // async removeLoadById(id: string) {
  //   return this.loadModel.findOneAndDelete({ id: id }).exec();
  // }

}
