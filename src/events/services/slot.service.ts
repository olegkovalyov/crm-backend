import {BadRequestException, forwardRef, Inject, Injectable, Scope} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Load} from '../entities/load.entity';
import {SlotModel} from '../models/slot.model';
import {UserService} from '../../users/services/user.service';
import {Slot} from '../entities/slot.entity';
import {CreateSlotInput} from '../inputs/slots/create-slot.input';
import {LoadService} from './load.service';
import {SlotType} from '../interfaces/slot.interface';
import {SlotValidatorService} from './slot-validator.service';

@Injectable({scope: Scope.REQUEST})
export class SlotService {

  constructor(
    @InjectRepository(Load)
    private readonly loadRepository: Repository<Load>,
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
    @Inject(forwardRef(() => LoadService))
    private readonly loadService: LoadService,
    private readonly userService: UserService,
    private readonly slotValidatorService: SlotValidatorService,
  ) {
  }

  // async createSlot(slotData: CreateSlotInput, load: Load): Promise<Slot> {
  //   //
  //   // switch (slotData.type) {
  //   //   case SlotType.SPORT:
  //   //   case SlotType.HOP_ON_HOP_OFF:
  //   //     await this.slotValidatorService.validateSportSlot(users, load);
  //   //     break;
  //   //   case SlotType.TM_WITH_CAMERAMAN:
  //   //     await this.slotValidatorService.validateTandemSlot(users, load, true);
  //   //     break;
  //   //   case SlotType.TM_WITHOUT_CAMERAMAN:
  //   //     await this.slotValidatorService.validateTandemSlot(users, load, false);
  //   //     break;
  //   //   case SlotType.STATIC_LINE:
  //   //     await this.slotValidatorService.validateStaticLineSlot(users, load);
  //   //     break;
  //   //   case SlotType.AFF_ONE_INSTRUCTOR:
  //   //     await this.slotValidatorService.validateAffSlot(users, load, false);
  //   //     break;
  //   //   case SlotType.AFF_TWO_INSTRUCTORS:
  //   //     await this.slotValidatorService.validateAffSlot(users, load, true);
  //   //     break;
  //   //   case SlotType.COACHED_JUMP:
  //   //     await this.slotValidatorService.validateCoachedJumpSlot(users, load);
  //   //     break;
  //   //   case SlotType.PASSENGER:
  //   //     await this.slotValidatorService.validatePassengerSlot(users, load);
  //   //     break;
  //   //   default:
  //   //     break;
  //   // }
  //
  //   const slot = new Slot();
  //
  //   slot.type = slotData.type;
  //   slot.load = load;
  //   slot.userIds = slotData.userIds;
  //   slot.notes = slotData.notes;
  //   await this.slotRepository.save(slot);
  //   return slot;
  //
  //   // try {
  //   //   await this.slotRepository.save(slot);
  //   //   return slot;
  //   // } catch (e) {
  //   //   throw new BadRequestException(`Failed to create slot`);
  //   // }
  // }
  //
  // async getSlots(loadId: number): Promise<Slot[]> {
  //   const load = await this.loadService.getLoadById(loadId);
  //   if (!load) {
  //     throw new BadRequestException(`Load with id: ${loadId} doesnt exists`);
  //   }
  //   return this.slotRepository
  //     .createQueryBuilder('slot')
  //     .leftJoinAndSelect('slot.load', 'load')
  //     .where('slot.loadId = :loadId', {loadId: loadId})
  //     .getMany();
  // }
  //
  // async deleteSlotById(id: number): Promise<Slot> {
  //   const slot = await this.getSlotById(id);
  //   if (!slot) {
  //     throw new BadRequestException(`Slot with id: ${id} doesn't exists`);
  //   }
  //
  //   try {
  //     const deleteResult = await this.loadRepository
  //       .createQueryBuilder('slot')
  //       .delete()
  //       .from(Slot)
  //       .where('id = :id', {id: id})
  //       .execute();
  //     if (deleteResult.affected !== 1) {
  //       throw new BadRequestException(`Failed to delete slot with id: ${id}`);
  //     }
  //     return slot;
  //   } catch (e) {
  //     console.log(e);
  //     throw new BadRequestException(`Failed to delete slot with id: ${id}`);
  //   }
  // }
  //
  // async getSlotById(id: number): Promise<Slot> {
  //   const slot = await this.slotRepository
  //     .createQueryBuilder('slot')
  //     .leftJoinAndSelect('slot.load', 'load')
  //     .where('slot.id = :id', {id: id})
  //     .getOne();
  //   return slot;
  // }
  //
  // async transformToGraphQlSlotModel(slotEntity: Slot): Promise<SlotModel> {
  //   console.log(slotEntity);
  //   return {
  //     id: slotEntity.id,
  //     type: slotEntity.type,
  //     userIds: slotEntity.userIds,
  //     notes: slotEntity.notes,
  //   };
  // }
}
