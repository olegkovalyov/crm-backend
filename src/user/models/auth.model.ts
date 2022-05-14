import { Field, ObjectType } from '@nestjs/graphql';
import {UserModel} from './user.model';

@ObjectType()
export class AuthModel {
  @Field(type => UserModel, { nullable: true })
  currentUser: UserModel;

  @Field({ nullable: true })
  accessToken: string;
}


