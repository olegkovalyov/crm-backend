import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { LicenseType, MemberRole, MemberStatus } from '../../interfaces/member.interface';

@InputType()
export class UpdateMemberInput {

  @IsNotEmpty()
  id: number;

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

  @Field(type => [MemberRole])
  @IsOptional()
  roles?: MemberRole[];

  @Field(type => LicenseType)
  @IsOptional()
  @IsEnum(LicenseType)
  licenseType?: LicenseType;
}
