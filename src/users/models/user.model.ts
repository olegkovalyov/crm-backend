import {Field, Int, ObjectType} from '@nestjs/graphql';
import {LicenseType, UserRole, UserStatus} from '../interfaces/user.interface';

@ObjectType()
export class UserModel {

  @Field(type => Int)
  id: number;

  @Field({
    nullable: true
  })
  personId: string;

  @Field()
  email: string;

  @Field(type => UserStatus)
  status: UserStatus;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(type => [UserRole])
  role: UserRole[];

  @Field(type => LicenseType)
  licenseType?: LicenseType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}


