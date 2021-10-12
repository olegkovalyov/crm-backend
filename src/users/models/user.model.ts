import { Field, Int, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class UserModel {

  @Field(type => Int)
  id: number;
}


