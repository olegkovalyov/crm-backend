import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LicenseType, MemberRole, MemberStatus } from '../interfaces/member.interface';


@ObjectType()
export class MemberModel {

  @Field(type => Int)
  id: number;

  @Field(type => Int)
  userId: number;

  @Field(type => MemberStatus)
  status: MemberStatus;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(type => [MemberRole])
  roles: MemberRole[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(type => LicenseType)
  licenseType?: LicenseType;
}


