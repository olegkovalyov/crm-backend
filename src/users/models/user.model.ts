import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../interfaces/user.interface';

@ObjectType()
export class UserModel {

  @Field()
  id: string;

  @Field()
  status: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(type => [String])
  roles: UserRole[];

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field({ nullable: true })
  licenseType?: string;
}


