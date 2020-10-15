import { Field, InputType } from '@nestjs/graphql';
import { UserRole, UserStatus } from '../interfaces/user.interface';
import { ArrayUnique, IsEnum, IsOptional } from 'class-validator';

@InputType()
export class GetUsersFilterInput {

  @Field(type=> [String])
  @IsOptional()
  @ArrayUnique()
  statuses?: string;

  @Field(type => [String])
  @IsOptional()
  @ArrayUnique()
  roles?: UserRole[];
}
