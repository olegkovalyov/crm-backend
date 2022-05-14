import {Field, Int, ObjectType} from '@nestjs/graphql';
import {LicenseType, UserRole, UserStatus} from '../interfaces/user.interface';

@ObjectType()
export class UserModel {

  @Field(() => Int)
  id: number;

  @Field()
  personId: string;

  @Field()
  email: string;

  @Field(() => UserStatus)
  status: UserStatus;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => [UserRole])
  role: UserRole[];

  @Field(() => LicenseType)
  licenseType?: LicenseType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}


