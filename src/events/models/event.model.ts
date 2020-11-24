import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LoadModel } from './load.model';
import { MemberModel } from '../../users/models/member.model';


@ObjectType()
export class EventModel {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  date: Date;

  // @Field(type => [LoadModel])
  // loads: [LoadModel];

  @Field(type => [MemberModel], { nullable: true })
  staff: MemberModel[];

  @Field()
  notes: string;
}
