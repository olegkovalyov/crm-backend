import { Field, InputType } from '@nestjs/graphql';
import { LicenseType, UserRole } from '../interfaces/user.interface';
import { IsEmail, IsEnum, IsIn, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
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

  @Field()
  @IsEnum(UserRole)
  role: UserRole;

  @Field()
  @IsEnum(LicenseType)
  licenseType?: LicenseType;
}
