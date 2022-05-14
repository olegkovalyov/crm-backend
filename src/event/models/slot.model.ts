import {Field, ObjectType} from '@nestjs/graphql';
import {SlotType} from '../interfaces/slot.interface';

@ObjectType()
export class SlotModel {

  @Field()
  id: number;

  @Field(() => SlotType)
  type: SlotType;

  @Field(() => [String])
  personIds: string[];

  @Field()
  info: string;
}
