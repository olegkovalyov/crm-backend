import { Field, ObjectType } from '@nestjs/graphql';
import { LoadModel } from './load.model';

@ObjectType()
export class EventModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  date: Date;

  @Field(type => [LoadModel], { nullable: true })
  loads?: [LoadModel];

  @Field()
  notes: string;
}
