import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../interfaces/user.interface';

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
  role: UserRole;

  @Field()
  createdAt: string;


  @Field()
  updatedAt: string;

  @Field({ nullable: true })
  licenseType?: string;
}


