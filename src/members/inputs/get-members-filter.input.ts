import { Field, InputType } from '@nestjs/graphql';
import { MemberRole, MemberStatus } from '../interfaces/member.interface';
import { ArrayUnique, IsOptional } from 'class-validator';

@InputType()
export class GetMembersFilterInput {

  @Field(type => [MemberStatus])
  @IsOptional()
  @ArrayUnique()
  statuses?: MemberStatus[];

  @Field(type => [MemberRole])
  @IsOptional()
  @ArrayUnique()
  roles?: MemberRole[];
}
