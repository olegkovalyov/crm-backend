import { Field, InputType } from '@nestjs/graphql';
import { LicenseType, MemberRole, MemberStatus } from '../interfaces/member.interface';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

@InputType()
export class UpdateMemberInput {

  @IsNotEmpty()
  id: string;

  @Field(type => MemberStatus)
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(MemberStatus)
  status?: MemberStatus;

  @Field()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  firstName?: string;

  @Field()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  lastName?: string;

  @Field()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @Field()
  @IsOptional()
  @MinLength(6)
  @MaxLength(20)
  password?: string;

  @Field(type => [MemberRole])
  @IsOptional()
  roles?: MemberRole[];

  @Field(type => LicenseType)
  @IsOptional()
  @IsEnum(LicenseType)
  licenseType?: LicenseType;
}
