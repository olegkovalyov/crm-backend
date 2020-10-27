import { Field, ObjectType } from '@nestjs/graphql';
import { MemberModel } from '../../members/models/member.model';

@ObjectType()
export class AuthModel {
  @Field(type => MemberModel, { nullable: true })
  user: MemberModel;

  @Field({ nullable: true })
  accessToken: string;
}


