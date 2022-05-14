import {Field, InputType} from '@nestjs/graphql';
import {ArrayNotEmpty, ArrayUnique, IsEmail, IsEnum, IsNotEmpty, IsNumber, MaxLength, MinLength} from 'class-validator';
import {LicenseType, UserRole, UserStatus} from '../../user/interfaces/user.interface';

@InputType()
export class UserInput {

  @Field()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @Field(() => UserStatus)
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

  @Field(() => [UserRole])
  @ArrayNotEmpty()
  @ArrayUnique()
  role: UserRole[];

  @Field(() => LicenseType)
  @IsNotEmpty()
  @IsEnum(LicenseType)
  licenseType: LicenseType;
}