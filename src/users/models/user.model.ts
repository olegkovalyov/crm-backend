import { Field, ObjectType } from '@nestjs/graphql';
import { LicenseType, UserRole, UserStatus } from '../interfaces/user.interface';


@ObjectType()
export class UserModel {

  @Field()
  id: string;

  @Field(type => UserStatus)
  status: UserStatus;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(type => [UserRole])
  roles: UserRole[];

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field(type => LicenseType)
  licenseType?: LicenseType;
}


