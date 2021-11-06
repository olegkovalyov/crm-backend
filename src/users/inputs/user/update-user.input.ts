import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { LicenseType, UserRole, UserStatus } from '../../interfaces/user.interface';

@InputType()
export class UpdateUserInput {

  @IsNotEmpty()
  id: number;

  @Field()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

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

  @Field(type => [UserRole])
  @IsOptional()
  role?: UserRole[];

  @Field(type => LicenseType)
  @IsOptional()
  @IsEnum(LicenseType)
  licenseType?: LicenseType;
}
