import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CreateSlotInput} from '../inputs/slots/create-slot.input';
import {SlotModel} from '../models/slot.model';
import {SlotService} from '../services/slot.service';
import {BadRequestException, forwardRef, Inject} from '@nestjs/common';
import {SlotValidatorService} from '../services/slot-validator.service';
import {LoadService} from '../services/load.service';
import {UserService} from '../../users/services/user.service';
import {SlotType} from '../interfaces/slot.interface';
import {UserValidatorService} from '../../users/services/user-validator.service';

@Resolver(of => SlotModel)
export class SlotResolver {
  constructor(
    private readonly slotService: SlotService,
    private readonly slotValidatorService: SlotValidatorService,
    private readonly loadService: LoadService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => UserValidatorService))
    private readonly memberValidatorService: UserValidatorService
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

    const load = await this.loadService.getLoadById(createData.loadId);
    if (!load) {
      throw new BadRequestException(`Load with id: ${createData.loadId} doesnt exists`);
    }

    const addedUsers = await this.userService.getMembersByIds(createData.userIds,[]);
    if (addedUsers.length !== createData.userIds.length) {
      const addedUserIds = addedUsers.map((addedUser) => addedUser.id);
      const inactiveUserIds = createData.userIds.filter(x => !addedUserIds.includes(x));
      throw new BadRequestException(`Users with id's: ${inactiveUserIds.join(',')} doesnt exists`);
    }

    if (!await this.slotValidatorService.validateTotalLoadCapacity(addedUsers, load)) {
      throw new BadRequestException(`Capacity limit reached for load with id: ${load.id}`);
    }

    // if(!await this.slotValidatorService.checkPerformersCount(users)) {
    //   throw new BadRequestException(`Slot has no performers.`);
    // }
    //
    // switch (createData.type) {
    //   case SlotType.SPORT:
    //   case SlotType.HOP_ON_HOP_OFF:
    //     await this.slotValidatorService.validateSportSlot(users, load);
    //     break;
    //   case SlotType.TM_WITH_CAMERAMAN:
    //     await this.slotValidatorService.validateTandemSlot(users, load, true);
    //     break;
    //   case SlotType.TM_WITHOUT_CAMERAMAN:
    //     await this.slotValidatorService.validateTandemSlot(users, load, false);
    //     break;
    //   case SlotType.STATIC_LINE:
    //     await this.slotValidatorService.validateStaticLineSlot(users, load);
    //     break;
    //   case SlotType.AFF_ONE_INSTRUCTOR:
    //     await this.slotValidatorService.validateAffSlot(users, load, false);
    //     break;
    //   case SlotType.AFF_TWO_INSTRUCTORS:
    //     await this.slotValidatorService.validateAffSlot(users, load, true);
    //     break;
    //   case SlotType.COACHED_JUMP:
    //     await this.slotValidatorService.validateCoachedJumpSlot(users, load);
    //     break;
    //   case SlotType.PASSENGER:
    //     await this.slotValidatorService.validatePassengerSlot(users, load);
    //     break;
    //   default:
    //     break;
    // }




    const result = await this.slotService.createSlot(createData, load);
    return this.slotService.transformToGraphQlSlotModel(result);
  }
}
