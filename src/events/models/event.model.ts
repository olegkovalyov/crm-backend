import { Field, Int, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class EventModel {
  @Field(type => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  notes: string;
}
