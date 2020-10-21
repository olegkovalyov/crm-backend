import { Field, ObjectType } from '@nestjs/graphql';
import { LoadModel } from './load.model';
import { UserModel } from '../../users/models/user.model';

@ObjectType()
export class EventModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  date: Date;

  @Field(type => [LoadModel])
  loads: [LoadModel];

  @Field(type => [UserModel])
  staff: [UserModel];

  @Field()
  notes: string;
}
