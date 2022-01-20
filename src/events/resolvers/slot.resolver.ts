import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CreateSlotInput} from '../inputs/slots/create-slot.input';
import {SlotModel} from '../models/slot.model';
import {SlotService} from '../services/slot.service';
import {BadRequestException} from '@nestjs/common';
import {SlotValidatorService} from '../services/slot-validator.service';
import {LoadService} from '../services/load.service';
import {GraphqlService} from '../services/graphql.service';
import {sprintf} from 'sprintf-js';
import {ERR_LOAD_NOT_FOUND, ERR_MAX_LOAD_CAPACITY} from '../constants/load.error';
import {ERR_PERSON_ALREADY_EXISTS_IN_LOAD, ERR_PERSON_DOESNT_EXIST} from '../constants/slot.error';

@Resolver(() => SlotModel)
export class SlotResolver {
  constructor(
    private readonly graphQlService: GraphqlService,
    private readonly slotService: SlotService,
    private readonly slotValidatorService: SlotValidatorService,
    private readonly loadService: LoadService,
  ) {
  }

  @Mutation(() => SlotModel)
  async createSlot(@Args('createSlotInput') createData: CreateSlotInput): Promise<SlotModel> {
    // Check if load exists
    const load = await this.loadService.getLoadById(createData.loadId);
    if (!load) {
      throw new BadRequestException(sprintf(ERR_LOAD_NOT_FOUND, createData.loadId));
    }

    // Check does load has enough free slots
    if (!await this.slotValidatorService.validateTotalLoadCapacity(
      createData.personIds.length,
      createData.loadId)
    ) {
      throw new BadRequestException(sprintf(ERR_MAX_LOAD_CAPACITY, createData.loadId));
    }

    // Check does person exists and does he already registered in this load
    for (const personId of createData.personIds) {
      if (!await this.slotValidatorService.personExist(personId)) {
        throw new BadRequestException(sprintf(ERR_PERSON_DOESNT_EXIST, personId));
      }
      if (await this.slotValidatorService.personExistInLoad(personId, createData.loadId)) {
        throw new BadRequestException(sprintf(ERR_PERSON_ALREADY_EXISTS_IN_LOAD, personId, createData.loadId));
      }
    }
    const slot = await this.slotService.createSlot(createData);
    return this.graphQlService.constructSlotModel(slot);
  }

  @Query(() => [SlotModel])
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getSlots(@Args('loadId', {type: () => Int}) loadId: number): Promise<SlotModel[]> {
    const slots = await this.slotService.getSlots(loadId);
    return slots.map(slot => this.graphQlService.constructSlotModel(slot));
  }

  @Mutation(() => SlotModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteSlot(@Args('id', {type: () => Int}) id: number): Promise<SlotModel> {
    const slot = await this.slotService.deleteSlotById(id);
    return this.graphQlService.constructSlotModel(slot);
  }
}
