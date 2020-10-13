import { Field, InputType } from '@nestjs/graphql';
import { UserRole, UserStatus } from '../interfaces/user.interface';
import { ArrayUnique, IsEnum, IsOptional } from 'class-validator';

@InputType()
export class GetUsersFilterInput {

  @Field()
  @IsOptional()
  @IsEnum(UserStatus)
  status?: string;

  @Field(type => [String])
  @IsOptional()
  @ArrayUnique()
  roles?: UserRole[];
}
