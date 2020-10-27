import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberModel } from '../models/member.model';
import { MemberInterface, MemberRole } from '../interfaces/member.interface';
import { CreateMemberInput } from '../inputs/create-member.input';
import { MembersService } from '../services/members.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateMemberInput } from '../inputs/update-member.input';
import { GetMembersFilterInput } from '../inputs/get-members-filter.input';
import { IsAdminOrManifestGuard } from '../../auth/guards/is-admin-or-manifest-guard.guard';

@Resolver(of => MemberModel)
export class MembersResolver {

  constructor(private readonly membersService: MembersService) {

  }

  @Query(returns => [MemberModel], { nullable: 'items' })
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getMembers(@Args('getMembersFilterInput') getMembersFilterInput: GetMembersFilterInput): Promise<MemberInterface[]> {
    return this.membersService.getMembers(getMembersFilterInput);
  }

  @Query(returns => MemberModel, { nullable: true })
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getMember(@Args('id') id: string): Promise<MemberInterface> {
    return this.membersService.getMemberById(id);
  }

  @Mutation(returns => MemberModel, { nullable: true })
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteMember(@Args('id') id: string) {
    return this.membersService.removeMemberById(id);
  }

  @Mutation(returns => MemberModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async createMember(@Args('createMemberData') createMemberData: CreateMemberInput): Promise<MemberInterface> {
    return this.membersService.createMember(createMemberData);
  }

  @Mutation(returns => MemberModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async updateMember(@Args('updateMemberData') updateMemberData: UpdateMemberInput): Promise<MemberInterface> {
    return this.membersService.updateMember(updateMemberData);
  }

  @Query(returns => [MemberModel], { nullable: true })
  async getStaff(): Promise<MemberInterface[]> {
    return this.membersService.getMembersByRoles([
      MemberRole.TM,
      MemberRole.COACH,
      MemberRole.CAMERAMAN,
      MemberRole.PACKER,
    ]);
  }
}
