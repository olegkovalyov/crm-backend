import {BadRequestException, Inject, Injectable, InternalServerErrorException, Scope} from '@nestjs/common';
import {CONTEXT} from '@nestjs/graphql';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, QueryRunner, Repository} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {User} from '../entities/user.entity';
import {CreateUserInput} from '../inputs/user/create-user.input';
import {GetUsersInput} from '../inputs/user/get-users.input';
import {UpdateUserInput} from '../inputs/user/update-user.input';
import {LicenseType, UserRole, UserStatus} from '../interfaces/user.interface';
import {MemberModel} from '../models/member.model';

@Injectable({scope: Scope.REQUEST})
export class UserService {
  private queryRunner: QueryRunner;

  constructor(
    @Inject(CONTEXT)
    private readonly context,
    private connection: Connection,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(User)
    private readonly membersRepository: Repository<User>,
  ) {
  }

  async getUsers(filterParams: GetUsersInput): Promise<User[]> {

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
        queryParameters.push({roles: filterParams.roles});
      }

      if (filterParams.statuses
        && filterParams.statuses.length
      ) {
        queryParts.push('member.status IN(:...statuses)');
        queryParameters.push({statuses: filterParams.statuses});
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

  async createUser(createMemberInput: CreateUserInput): Promise<User> {
    const {email, password} = createMemberInput;

    const member = await this.getMemberByEmail(email);
    if (member) {
      throw new BadRequestException('Member with this email already exists');
    }

    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const user = new User();
      await this.queryRunner.manager.save(user);
      const salt = await bcrypt.genSalt();

      const newMember = new User();
      newMember.email = email;
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

  async getMemberByEmail(email: string): Promise<User> {
    return this.membersRepository.createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.email = :email', {email: email})
      .getOne();
  }

  async getMemberById(id: number): Promise<User> {
    const member = this.membersRepository.createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.id = :id', {id: id})
      .getOne();
    return member;
  }

  async getMembersByIds(ids: number[], roles: UserRole[]): Promise<User[]> {
    const queryBuilder = this.membersRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user');

    queryBuilder.where('member.id IN(:...ids)', {ids: ids});

    if (roles.length) {
      queryBuilder.andWhere('member.roles && ARRAY[:...roles]::member_roles_enum[]',
        {
          roles: roles,
        });
    }
    return await queryBuilder.getMany();
  }

  async updateMember(updateData: UpdateUserInput): Promise<User> {
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

    return this.membersRepository.save(member);
  }

  async deleteMemberById(id: number): Promise<User> {
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
        .from(User)
        .where('id = :id', {id: id})
        .execute();

      const userDeleteResult = await this.queryRunner.connection
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('id = :id', {id: member.id})
        .execute();
      await this.queryRunner.commitTransaction();
      if (memberDeleteResult.affected !== 1
        && userDeleteResult.affected !== 1
      ) {
        throw new BadRequestException(`Failed to delete member with id: ${id}`);
      }
      return member;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw new BadRequestException(`Failed to delete member with id: ${id}`);
    } finally {
      await this.queryRunner.release();
    }
  }

  async getMembersByRoles(roles: UserRole[]): Promise<User[]> {
    return this.membersRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.roles && ARRAY[:...roles]::member_roles_enum[]', {roles: roles})
      .getMany();
  }

  async updateRefreshToken(member: User, refreshToken: string | null): Promise<void> {
    member.refreshToken = refreshToken;
    await this.membersRepository.save(member);
  }

  async updateResetPasswordInfo(member: User, token: string, password: string = null): Promise<void> {

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

  async getMemberByResetToken(token: string): Promise<User> {
    return await this.membersRepository
      .createQueryBuilder('member')
      .where('member.resetPasswordToken = :token', {token: token})
      .getOne();
  }

  async getMemberByUserId(userId: number): Promise<User> {
    const member = await this.membersRepository.createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.userId = :userId', {userId: userId})
      .getOne();
    return member;
  }

  transformToGraphQlMemberModel(member: User): MemberModel {
    return {
      id: member.id,
      userId: 1,
      status: UserStatus.ACTIVE,
      firstName: '',
      lastName: '',
      email: member.email,
      roles: [UserRole.SKYDIVER],
      licenseType: LicenseType.D,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}
