import { Field, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class UserModel {

  @Field()
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}


