import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, ArrayUnique, IsEmail, IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import {LicenseType, UserRole, UserStatus} from '../../interfaces/user.interface';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @Field(type => UserStatus)
  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;

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

  @Field(type => [UserRole])
  @ArrayNotEmpty()
  @ArrayUnique()
  role: UserRole[];

  @Field(type => LicenseType)
  @IsNotEmpty()
  @IsEnum(LicenseType)
  licenseType: LicenseType;
}
