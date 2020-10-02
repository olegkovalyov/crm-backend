import { Field, InputType } from '@nestjs/graphql';
import { LicenseType, UserRole, UserStatus } from '../interfaces/user.interface';
import { ArrayNotEmpty, ArrayUnique, IsEmail, IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {

  @Field()
  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: string;

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

  @Field(type => [String])
  @ArrayNotEmpty()
  @ArrayUnique()
  roles: UserRole[];

  @Field()
  @IsEnum(LicenseType)
  licenseType: LicenseType;
}
