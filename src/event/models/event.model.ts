import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class EventModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  info: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
