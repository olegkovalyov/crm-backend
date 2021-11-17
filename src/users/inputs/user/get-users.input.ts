import {Field, InputType} from '@nestjs/graphql';
import {ArrayNotEmpty, ArrayUnique, IsNotEmpty, IsOptional} from 'class-validator';
import {LicenseType, UserRole, UserStatus} from '../../interfaces/user.interface';

@InputType()
export class GetUsersInput {

  @Field(type => [UserStatus],
    {
      nullable: true,
    })
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  status: UserStatus[];

  @Field(type => [UserRole],
    {
      nullable: true,
    })
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  role: UserRole[];

  @Field(type => [LicenseType],
    {
      nullable: true,
    })
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  licenseType: LicenseType[];

  @Field({
    nullable: true,
  })
  @IsOptional()
  firstName: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  lastName: string;
}
