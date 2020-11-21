import { BadRequestException, Inject, Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Connection, getConnection, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Member } from '../entities/member.entity';
import { CreateMemberInput } from '../inputs/create-member.input';
import { UserType } from '../interfaces/user.interface';
import { GetMembersFilterInput } from '../inputs/get-members-filter.input';
import { UpdateMemberInput } from '../inputs/update-member.input';
import { MemberRole } from '../interfaces/member.interface';

@Injectable({ scope: Scope.REQUEST })
export class MembersService {

  private membersQueryBuilder: SelectQueryBuilder<Member>;
  private usersQueryBuilder: SelectQueryBuilder<User>;
  private queryRunner: QueryRunner;

  constructor(
    @Inject(CONTEXT)
    private readonly context,
    private connection: Connection,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {
    this.membersQueryBuilder = this.membersRepository.createQueryBuilder('member');
    this.usersQueryBuilder = this.usersRepository.createQueryBuilder('user');
    this.queryRunner = this.connection.createQueryRunner();
  }

  async getMembers(filterParams: GetMembersFilterInput): Promise<Member[]> {

    this.membersQueryBuilder.leftJoinAndSelect('member.user', 'user');
    if (filterParams.roles
      || filterParams.statuses
    ) {
      if (filterParams.roles
        && filterParams.roles.length
      ) {
        this.membersQueryBuilder.where(
          'member.roles && ARRAY[:...roles]::member_roles_enum[]',
          { roles: filterParams.roles },
        );
      }

      if (filterParams.statuses
        && filterParams.statuses.length
      ) {
        this.membersQueryBuilder.where(
          'member.status IN(:...statuses)',
          { statuses: filterParams.statuses },
        );
      }
    }

    return this.membersQueryBuilder.getMany();
  }


  async createMember(createMemberInput: CreateMemberInput): Promise<Member> {
    const { status, firstName, lastName, email, password, roles, licenseType } = createMemberInput;

    const member = await this.getMemberByEmail(email);
    if (member) {
      throw new BadRequestException('Member with this email already exists');
    }

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
    return this.membersQueryBuilder.leftJoinAndSelect('member.user', 'user')
      .where('member.email = :email', { email: email })
      .getOne();
  }

  async getMemberById(id: number): Promise<Member> {
    const member = this.membersQueryBuilder.leftJoinAndSelect('member.user', 'user')
      .where('member.id = :id', { id: id })
      .getOne();
    return member;
  }

  async updateMember(updateData: UpdateMemberInput): Promise<Member> {
    const {
      id,
      status,
      firstName,
      lastName,
      email,
      password,
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

    if (password) {
      const newSalt = await bcrypt.genSalt();
      const newPasswordHash = await bcrypt.hash(password, newSalt);
      member.passwordSalt = newSalt;
      member.passwordHash = newPasswordHash;
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
    const memberDeleteResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Member)
      .where('id = :id', { id: id })
      .execute();

    const userDeleteResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id: member.user.id })
      .execute();
    if (memberDeleteResult.affected !== 1
      || userDeleteResult.affected !== 1
    ) {
      throw new BadRequestException(`Failed to delete member with id: ${id}`);
    }
    return true;
  }

  async getMembersByRoles(roles: MemberRole[]): Promise<Member[]> {
    return this.membersQueryBuilder
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
    return await this.membersQueryBuilder
      .where('member.resetPasswordToken = :token', { token: token })
      .getOne();
  }
}
