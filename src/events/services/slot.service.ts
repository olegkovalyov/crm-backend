import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {CONTEXT} from '@nestjs/graphql';
import {Connection, QueryRunner, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {MemberService} from '../../users/services/member.service';
import {Load} from '../entities/load.entity';
import {ClientService} from '../../users/services/client.service';
import {EventService} from './event.service';
import {SlotModel} from '../models/slot.model';
import {UserService} from '../../users/services/user.service';
import {Slot} from '../entities/slot.entity';
import {CreateSlotInput} from '../inputs/slots/create-slot.input';
import {LoadService} from './load.service';

@Injectable()
export class SlotService {

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
    private readonly loadService: LoadService,
    private readonly userService: UserService,
  ) {
  }

  async createSlot(slotData: CreateSlotInput): Promise<Slot> {
    const load = await this.loadService.getLoadById(slotData.loadId);
    if (!load) {
      throw new BadRequestException(`Load with id: ${slotData.loadId} doesnt exists`);
    }

    const users = await this.userService.getUsersByIds(slotData.userIds);
    if (users.length !== slotData.userIds.length) {
      const userIds = users.map((user) => user.id);
      const inactiveUserIds = slotData.userIds.filter(x => !userIds.includes(x));
      throw new BadRequestException(`Users with id's: ${inactiveUserIds.join(',')} doesnt exists`);
    }

    const slot = new Slot();
    slot.type = slotData.type;
    slot.load = load;
    slot.userIds = slotData.userIds;
    slot.notes = slotData.notes;

    try {
      await this.slotRepository.save(slot);
      return slot;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(`Failed to create slot`);
    }
  }

  async getSlots(loadId: number): Promise<Slot[]> {
    const load = await this.loadService.getLoadById(loadId);
    if (!load) {
      throw new BadRequestException(`Load with id: ${loadId} doesnt exists`);
    }
    return this.slotRepository
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.load', 'load')
      .where('slot.loadId = :loadId', {loadId: loadId})
      .getMany();
  }

  async deleteSlotById(id: number): Promise<Slot> {
    const slot = await this.getSlotById(id);
    if (!slot) {
      throw new BadRequestException(`Slot with id: ${id} doesn't exists`);
    }

    try {
      const deleteResult = await this.loadRepository
        .createQueryBuilder('slot')
        .delete()
        .from(Slot)
        .where('id = :id', {id: id})
        .execute();
      if (deleteResult.affected !== 1) {
        throw new BadRequestException(`Failed to delete slot with id: ${id}`);
      }
      return slot;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(`Failed to delete slot`);
    }
  }

  async getSlotById(id: number): Promise<Slot> {
    const slot = await this.slotRepository
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.load', 'load')
      .where('slot.id = :id', {id: id})
      .getOne();
    return slot;
  }

  async transformToGraphQlSlotModel(slotEntity: Slot): Promise<SlotModel> {
    return {
      id: slotEntity.id,
      loadId: slotEntity.load.id,
      type: slotEntity.type,
      userIds: slotEntity.userIds,
      notes: slotEntity.notes,
    };
  }
}
