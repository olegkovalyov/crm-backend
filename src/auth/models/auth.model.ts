import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../users/models/user.model';

@ObjectType()
export class AuthModel {
  @Field(type => UserModel)
  user: UserModel;

  @Field()
  accessToken: string;
}


