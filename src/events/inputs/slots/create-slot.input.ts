import {Field, InputType} from '@nestjs/graphql';
import {ArrayUnique, IsEnum, IsOptional} from 'class-validator';
import {SlotType} from '../../interfaces/slot.interface';

@InputType()
export class CreateSlotInput {

  @Field()
  loadId: number;

  @Field(() => SlotType)
  @IsEnum(SlotType)
  type: SlotType;

  @Field(() => [String])
  @ArrayUnique()
  personIds: string[];

  @Field()
  @IsOptional()
  info: string;
}
