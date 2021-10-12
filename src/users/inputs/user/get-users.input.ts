import { Field, InputType } from '@nestjs/graphql';
import { ArrayUnique, IsOptional } from 'class-validator';
import { UserRole, UserStatus } from '../../interfaces/user.interface';

@InputType()
export class GetUsersInput {

  @Field(type => [UserStatus])
  @IsOptional()
  @ArrayUnique()
  statuses?: UserStatus[];

  @Field(type => [UserRole])
  @IsOptional()
  @ArrayUnique()
  roles?: UserRole[];
}
