import { BadRequestException, Inject, Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Connection, QueryRunner, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Member } from '../entities/member.entity';
import { CreateMemberInput } from '../inputs/members/create-member.input';
import { UserType } from '../interfaces/user.interface';
import { GetMembersFilterInput } from '../inputs/members/get-members-filter.input';
import { UpdateMemberInput } from '../inputs/members/update-member.input';
import { MemberRole } from '../interfaces/member.interface';
import { Client } from '../entities/client.entity';
import { MemberModel } from '../models/member.model';

@Injectable({ scope: Scope.REQUEST })
export class MemberService {
  private queryRunner: QueryRunner;

  constructor(
    @Inject(CONTEXT)
    private readonly context,
    private connection: Connection,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {
  }

  async getMembers(filterParams: GetMembersFilterInput): Promise<Member[]> {

    const membersQueryBuilder = this.membersRepository.createQueryBuilder('member');

    membersQueryBuilder.leftJoinAndSelect('member.user', 'user');
    if (filterParams.roles
      || filterParams.statuses
    ) {

      const queryParts = [];
      const queryParameters = [];

      if (filterParams.roles
        && filterParams.roles.length
      ) {
        queryParts.push('member.roles && ARRAY[:...roles]::member_roles_enum[]');
        queryParameters.push({ roles: filterParams.roles });
      }

      if (filterParams.statuses
        && filterParams.statuses.length
      ) {
        queryParts.push('member.status IN(:...statuses)');
        queryParameters.push({ statuses: filterParams.statuses });
      }

      for (let i = 0; i < queryParts.length; i++) {
        if (i === 0) {
          membersQueryBuilder.where(queryParts[i], queryParameters[i]);
        } else {
          membersQueryBuilder.andWhere(queryParts[i], queryParameters[i]);
        }
      }
    }

    return membersQueryBuilder.getMany();
  }


  async createMember(createMemberInput: CreateMemberInput): Promise<Member> {
    const { status, firstName, lastName, email, password, roles, licenseType } = createMemberInput;

    const member = await this.getMemberByEmail(email);
    if (member) {
      throw new BadRequestException('Member with this email already exists');
    }

    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const user = new User();
      user.userType = UserType.MEMBER;
      await this.queryRunner.manager.save(user);
      const salt = await bcrypt.genSalt();

      const newMember = new Member();
      newMember.user = user;
      newMember.status = status;
      newMember.firstName = firstName;
      newMember.lastName = lastName;
      newMember.email = email;
      newMember.roles = roles;
      newMember.licenseType = licenseType;
      newMember.passwordHash = await bcrypt.hash(password, salt);
      newMember.passwordSalt = salt;
      const result = await this.queryRunner.manager.save(newMember);
      await this.queryRunner.commitTransaction();
      return result;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create member');
    } finally {
      await this.queryRunner.release();
    }
  }

  async getMemberByEmail(email: string): Promise<Member> {
    return this.membersRepository.createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.email = :email', { email: email })
      .getOne();
  }

  async getMemberById(id: number): Promise<Member> {
    const member = this.membersRepository.createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.id = :id', { id: id })
      .getOne();
    return member;
  }

  async getMembersByIds(ids: number[], roles: MemberRole[]): Promise<Member[]> {
    const queryBuilder = this.membersRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user');

    queryBuilder.where('member.id IN(:...ids)', { ids: ids });

    if (roles.length) {
      queryBuilder.andWhere('member.roles && ARRAY[:...roles]::member_roles_enum[]',
        {
          roles: roles,
        });
    }
    return await queryBuilder.getMany();
  }

  async updateMember(updateData: UpdateMemberInput): Promise<Member> {
    const {
      id,
      status,
      firstName,
      lastName,
      email,
      roles,
      licenseType,
    } = updateData;

    const member = await this.getMemberById(id);
    if (!member) {
      throw new BadRequestException(`Member with id: ${id} doesnt exists`);
    }

    if (email) {
      const memberWithEmail = await this.getMemberByEmail(email);
      if (memberWithEmail
        && memberWithEmail.id !== id
      ) {
        throw new BadRequestException(`Member with email: ${email} already exists`);
      }
      member.email = email;
    }

    if (status) {
      member.status = status;
    }

    if (firstName) {
      member.firstName = firstName;
    }

    if (lastName) {
      member.lastName = lastName;
    }

    if (roles) {
      member.roles = roles;
    }

    if (licenseType) {
      member.licenseType = licenseType;
    }

    return this.membersRepository.save(member);
  }

  async deleteMemberById(id: number): Promise<boolean> {
    const member = await this.getMemberById(id);
    if (!member) {
      throw new BadRequestException(`Member with id: ${id} doesn't exists`);
    }

    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const memberDeleteResult = await this.queryRunner.connection
        .createQueryBuilder()
        .delete()
        .from(Member)
        .where('id = :id', { id: id })
        .execute();

      const userDeleteResult = await this.queryRunner.connection
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('id = :id', { id: member.user.id })
        .execute();
      await this.queryRunner.commitTransaction();
      return memberDeleteResult.affected == 1
        && userDeleteResult.affected == 1;

    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw new BadRequestException(`Failed to delete member with id: ${id}`);
    } finally {
      await this.queryRunner.release();
    }
  }

  async getMembersByRoles(roles: MemberRole[]): Promise<Member[]> {
    return this.membersRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.roles && ARRAY[:...roles]::member_roles_enum[]', { roles: roles })
      .getMany();
  }

  async updateRefreshToken(member: Member, refreshToken: string | null): Promise<void> {
    member.refreshToken = refreshToken;
    await this.membersRepository.save(member);
  }


  async updateResetPasswordInfo(member: Member, token: string, password: string = null): Promise<void> {

    member.resetPasswordToken = token;
    if (token) {
      const expTimestamp = Date.now() + 60 * 1000 * 60;
      member.resetPasswordExpirationDate = new Date(expTimestamp);
    } else {
      member.resetPasswordExpirationDate = null;
    }

    if (password) {
      const newSalt = await bcrypt.genSalt();
      const newPasswordHash = await bcrypt.hash(password, newSalt);
      member.passwordSalt = newSalt;
      member.passwordHash = newPasswordHash;
    }
    await this.membersRepository.save(member);
  }

  async getMemberByResetToken(token: string): Promise<Member> {
    return await this.membersRepository
      .createQueryBuilder('member')
      .where('member.resetPasswordToken = :token', { token: token })
      .getOne();
  }

  async getMemberByUserId(userId: number): Promise<Member> {
    const member = await this.membersRepository.createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.userId = :userId', { userId: userId })
      .getOne();
    return member;
  }

  transformToGraphQlMemberModel(member: Member): MemberModel {
    return {
      id: member.id,
      userId: member.user.id,
      status: member.status,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      roles: member.roles,
      licenseType: member.licenseType,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}
