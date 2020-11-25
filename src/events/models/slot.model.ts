import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SlotModel {
  @Field(type => Int)
  userId: number;

  @Field()
  description: string;
}
