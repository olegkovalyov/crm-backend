import {BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, Scope} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Load} from '../entities/load.entity';
import {Slot} from '../entities/slot.entity';
import {CreateSlotInput} from '../inputs/slots/create-slot.input';
import {LoadService} from './load.service';
import {sprintf} from 'sprintf-js';
import {ERR_FAILED_TO_CREATE_SLOT, ERR_FAILED_TO_DELETE_SLOT, ERR_SLOT_NOT_FOUND} from '../constants/slot.error';

@Injectable({scope: Scope.REQUEST})
export class SlotService {

  constructor(
    @InjectRepository(Load)
    private readonly loadRepository: Repository<Load>,
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
    @Inject(forwardRef(() => LoadService))
    private readonly loadService: LoadService,
  ) {
  }

  async createSlot(input: CreateSlotInput): Promise<Slot> {
    const {
      loadId,
      type,
      personIds,
      info,
    } = input;

    const slot = new Slot();
    const load = await this.loadService.getLoadById(loadId);
    slot.type = type;
    slot.load = load;
    slot.personIds = personIds;
    slot.info = info;
    try {
      return await this.slotRepository.save(slot);
    } catch (e) {
      throw new InternalServerErrorException(ERR_FAILED_TO_CREATE_SLOT);
    }
  }

  async getSlots(loadId: number): Promise<Slot[]> {
    return this.slotRepository.find({where: {load: loadId}});
  }

  async getSlotById(id: number): Promise<Slot> {
    return this.slotRepository.findOne({id: id});
  }

  async deleteSlotById(id: number): Promise<Slot> {
    const slot = await this.getSlotById(id);
    if (!slot) {
      throw new BadRequestException(sprintf(ERR_SLOT_NOT_FOUND, id));
    }
    const deleteResult = await this.slotRepository.delete({id: slot.id});
    if (deleteResult.affected !== 1) {
      throw new InternalServerErrorException(sprintf(ERR_FAILED_TO_DELETE_SLOT, slot.id));
    }
    return slot;
  }
}
