import {BadRequestException, Injectable, InternalServerErrorException, Scope} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, QueryRunner, Repository} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {User} from '../entities/user.entity';
import {CreateUserInput} from '../inputs/user/create-user.input';
import {GetUsersInput} from '../inputs/user/get-users.input';
import {UpdateUserInput} from '../inputs/user/update-user.input';
import {LicenseType, UserRole, UserStatus} from '../interfaces/user.interface';
import {UserModel} from '../models/user.model';
import {UserInfo} from '../entities/user-info.entity';

@Injectable({scope: Scope.REQUEST})
export class UserService {
  private queryRunner: QueryRunner;

  constructor(
    private connection: Connection,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {
  }

  async getUsers(filterParams: GetUsersInput): Promise<User[]> {

    const usersQueryBuilder = this.usersRepository.createQueryBuilder('member');

    usersQueryBuilder.leftJoinAndSelect('member.user', 'user');
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
          usersQueryBuilder.where(queryParts[i], queryParameters[i]);
        } else {
          usersQueryBuilder.andWhere(queryParts[i], queryParameters[i]);
        }
      }
    }

    return usersQueryBuilder.getMany();
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const {email, password, status} = input;

    const alreadyExist = await this.usersRepository.findOne({email: email});
    if (alreadyExist) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = new User();
    const salt = await bcrypt.genSalt();
    user.email = email;
    user.status = status;
    user.passwordHash = await bcrypt.hash(password, salt);
    user.passwordSalt = salt;

    try {
      return this.usersRepository.save(user);
    } catch (e) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async createUserInfo(input: CreateUserInput, user: User): Promise<UserInfo> {
    const {firstName, lastName, roles, licenseType} = input;
    const userInfo = new UserInfo();
    userInfo.user = user;
    userInfo.firstName = firstName;
    userInfo.lastName = lastName;
    userInfo.roles = roles;
    userInfo.licenseType = licenseType;
    try {
      return this.userInfoRepository.save(userInfo);
    } catch (e) {
      throw new InternalServerErrorException('Failed to create user info');
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({email: email});
  }

  async getMemberById(id: number): Promise<User> {
    const member = this.usersRepository.createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.id = :id', {id: id})
      .getOne();
    return member;
  }

  async getMembersByIds(ids: number[], roles: UserRole[]): Promise<User[]> {
    const queryBuilder = this.usersRepository
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
      const memberWithEmail = await this.getUserByEmail(email);
      if (memberWithEmail
        && memberWithEmail.id !== id
      ) {
        throw new BadRequestException(`Member with email: ${email} already exists`);
      }
      member.email = email;
    }

    return this.usersRepository.save(member);
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
    return this.usersRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.roles && ARRAY[:...roles]::member_roles_enum[]', {roles: roles})
      .getMany();
  }

  async updateRefreshToken(user: User, refreshToken: string | null): Promise<void> {
    user.refreshToken = refreshToken;
    await this.usersRepository.save(user);
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
    await this.usersRepository.save(member);
  }

  async getMemberByResetToken(token: string): Promise<User> {
    return await this.usersRepository
      .createQueryBuilder('member')
      .where('member.resetPasswordToken = :token', {token: token})
      .getOne();
  }

  async getMemberByUserId(userId: number): Promise<User> {
    const member = await this.usersRepository.createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.userId = :userId', {userId: userId})
      .getOne();
    return member;
  }

  transformToGraphQlMemberModel(member: User): UserModel {
    return {
      id: member.id,
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
