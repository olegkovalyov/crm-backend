import {Field, InputType} from '@nestjs/graphql';
import {ArrayUnique, IsOptional} from 'class-validator';
import {LicenseType, UserRole, UserStatus} from '../../interfaces/user.interface';

@InputType()
export class GetUsersInput {

  @Field(type => [UserStatus])
  @IsOptional()
  @ArrayUnique()
  status?: UserStatus[];

  @Field(type => [UserRole])
  @IsOptional()
  @ArrayUnique()
  role?: UserRole[];

  @Field(type => [LicenseType])
  @IsOptional()
  @ArrayUnique()
  licenseType?: LicenseType[];

  @Field(type => String)
  @IsOptional()
  firstName?: string;

  @Field(type => String)
  @IsOptional()
  lastName?: string;
}
