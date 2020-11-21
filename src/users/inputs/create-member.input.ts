import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, ArrayUnique, IsEmail, IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { LicenseType, MemberRole, MemberStatus } from '../interfaces/member.interface';

@InputType()
export class CreateMemberInput {
  @Field(type => MemberStatus)
  @IsNotEmpty()
  @IsEnum(MemberStatus)
  status: MemberStatus;

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  firstName: string;

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  lastName: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @Field(type => [MemberRole])
  @ArrayNotEmpty()
  @ArrayUnique()
  roles: MemberRole[];

  @Field(type => LicenseType)
  @IsNotEmpty()
  @IsEnum(LicenseType)
  licenseType: LicenseType;
}
