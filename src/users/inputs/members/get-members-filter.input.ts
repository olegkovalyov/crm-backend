import { Field, InputType } from '@nestjs/graphql';
import { ArrayUnique, IsOptional } from 'class-validator';
import { MemberRole, MemberStatus } from '../../interfaces/member.interface';

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
