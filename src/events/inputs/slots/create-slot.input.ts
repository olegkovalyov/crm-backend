import {Field, InputType, Int} from '@nestjs/graphql';
import {IsEnum, IsOptional} from 'class-validator';
import {SlotType} from '../../interfaces/slot.interface';

@InputType()
export class CreateSlotInput {

  @Field(type => Int)
  loadId: number;

  @Field(type => SlotType)
  @IsEnum(SlotType)
  type: SlotType;

  @Field(type => [Int])
  userIds: number[];

  @Field({nullable: true})
  @IsOptional()
  notes?: string;
}
