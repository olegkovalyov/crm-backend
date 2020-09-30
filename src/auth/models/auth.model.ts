import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../users/models/user.model';

@ObjectType()
export class AuthModel {
  @Field(type => UserModel, { nullable: true })
  user: UserModel;

  @Field({ nullable: true })
  accessToken: string;
}


