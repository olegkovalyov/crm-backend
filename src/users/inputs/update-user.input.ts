import { Field, InputType } from '@nestjs/graphql';
import { LicenseType, UserRole, UserStatus } from '../interfaces/user.interface';
import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

@InputType()
export class UpdateUserInput {

  @IsNotEmpty()
  id: string;

  @Field(type => UserStatus)
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserStatus)
  status?: UserStatus;

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

  @Field(type => [UserRole])
  @IsOptional()
  roles?: UserRole[];

  @Field(type => LicenseType)
  @IsOptional()
  @IsEnum(LicenseType)
  licenseType?: LicenseType;
}
