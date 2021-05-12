import {Field, Int, ObjectType} from '@nestjs/graphql';
import {SlotType} from '../interfaces/slot.interface';

@ObjectType()
export class SlotModel {

  @Field(type => Int)
  id: number;

  @Field(type => Int)
  loadId: number;

  @Field(type => SlotType)
  type: SlotType;

  @Field(type => [Int])
  userIds: number[];

  @Field({nullable: true})
  notes?: string;
}
