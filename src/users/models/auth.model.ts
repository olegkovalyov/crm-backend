import { Field, ObjectType } from '@nestjs/graphql';
import { MemberModel } from './member.model';

@ObjectType()
export class AuthModel {
  @Field(type => MemberModel, { nullable: true })
  payload: MemberModel;

  @Field({ nullable: true })
  accessToken: string;
}


