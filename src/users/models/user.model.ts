import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserType } from '../interfaces/user.interface';


@ObjectType()
export class UserModel {

  @Field(type => Int)
  id: number;

  @Field(type => UserType)
  userType: UserType;
}


