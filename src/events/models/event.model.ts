import { Field, ObjectType } from '@nestjs/graphql';
import { LoadModel } from './load.model';
import { MemberModel } from '../../members/models/member.model';

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

  @Field(type => [MemberModel])
  staff: [MemberModel];

  @Field()
  notes: string;
}
