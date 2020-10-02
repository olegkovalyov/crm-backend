import { Field, InputType } from '@nestjs/graphql';
import { LicenseType, UserRole, UserStatus } from '../interfaces/user.interface';
import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

@InputType()
export class UpdateUserInput {

  @IsNotEmpty()
  id: string;

  @Field()
  @IsOptional()
  @IsEnum(UserStatus)
  status?: string;

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

  @Field(type => [String])
  @IsOptional()
  roles?: UserRole[];

  @Field()
  @IsOptional()
  @IsEnum(LicenseType)
  licenseType?: LicenseType;
}
