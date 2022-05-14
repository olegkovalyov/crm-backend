import {Field, InputType, OmitType, PartialType} from '@nestjs/graphql';
import {ArrayNotEmpty, ArrayUnique, IsOptional} from 'class-validator';
import {LicenseType, UserStatus} from '../interfaces/user.interface';
import {UserInput} from '../../common/inputs/user.input';

@InputType()
export class GetUsersInput extends OmitType(
  PartialType(UserInput),
  ['password', 'licenseType', 'status'] as const,
) {
  @Field(() => [UserStatus])
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  status?: UserStatus[];

  @Field(() => [LicenseType])
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  licenseType?: LicenseType[];
}
