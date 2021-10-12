import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LicenseType, UserRole, UserStatus } from '../interfaces/user.interface';


@ObjectType()
export class MemberModel {

  @Field(type => Int)
  id: number;

  @Field(type => Int)
  userId: number;

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
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(type => LicenseType)
  licenseType?: LicenseType;
}


