import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CreateSlotInput} from '../inputs/slots/create-slot.input';
import {SlotModel} from '../models/slot.model';
import {SlotService} from '../services/slot.service';

@Resolver(of => SlotModel)
export class SlotResolver {
  constructor(
    private readonly slotService: SlotService,
  ) {
  }

  @Query(returns => [SlotModel])
  async getSlots(@Args('loadId', {type: () => Int}) loadId: number): Promise<SlotModel[]> {
    const slotEntities = await this.slotService.getSlots(loadId);
    const slotModels = await Promise.all(
      slotEntities.map(slotEntity => this.slotService.transformToGraphQlSlotModel(slotEntity)),
    );
    return slotModels;
  }

  @Mutation(returns => SlotModel)
  async createSlot(@Args('createSlotInput') createData: CreateSlotInput): Promise<SlotModel> {
    const slot = await this.slotService.createSlot(createData);
    return this.slotService.transformToGraphQlSlotModel(slot);
  }
}
