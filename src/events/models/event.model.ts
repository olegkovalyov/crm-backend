import { Field, ObjectType } from '@nestjs/graphql';
import { LoadModel } from './load.model';

@ObjectType()
export class EventModel {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  date: Date;

  @Field(type => [LoadModel], { nullable: true })
  loads?: [LoadModel];

  @Field({ nullable: true })
  notes?: string;
}
