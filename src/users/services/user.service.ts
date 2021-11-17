import {BadRequestException, Injectable, InternalServerErrorException, Scope} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOperator, Like, Raw, Repository} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {User} from '../entities/user.entity';
import {CreateUserInput} from '../inputs/user/create-user.input';
import {GetUsersInput} from '../inputs/user/get-users.input';
import {UpdateUserInput} from '../inputs/user/update-user.input';
import {GetUsersFilterConditionInterface, LicenseType, UserRole, UserStatus} from '../interfaces/user.interface';
import {UserInfo} from '../entities/user-info.entity';
import {v4 as uuidv4} from 'uuid';
import {sprintf} from 'sprintf-js';
import {
  ERR_FAILED_TO_CREATE_USER,
  ERR_FAILED_TO_DELETE_USER,
  ERR_USER_ALREADY_EXIST,
  ERR_USER_NOT_FOUND,
} from '../constants/user.error';

@Injectable({scope: Scope.DEFAULT})
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
  }

  async getUsers(filterParams: Partial<GetUsersInput>): Promise<User[]> {
    if (Object.keys(filterParams).length === 0) {
      return this.usersRepository.find({
        relations: ['userInfo'],
      });
    }

    const conditions = UserService.composeSearchConditions(filterParams);

    return this.usersRepository.find({
      relations: ['userInfo'],
      where: conditions,
    });
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const {email, password, status, firstName, lastName, licenseType, role} = input;

    const alreadyExist = await this.usersRepository.findOne({email: email});
    if (alreadyExist) {
      throw new BadRequestException(sprintf(ERR_USER_ALREADY_EXIST, email));
    }

    const user = new User();
    const salt = await bcrypt.genSalt();
    user.personId = uuidv4();
    user.email = email;
    user.status = status;
    user.passwordHash = await bcrypt.hash(password, salt);
    user.passwordSalt = salt;

    const userInfo = new UserInfo();
    userInfo.firstName = firstName;
    userInfo.lastName = lastName;
    userInfo.role = role;
    userInfo.licenseType = licenseType;

    user.userInfo = userInfo;

    try {
      return this.usersRepository.save(user);
    } catch (e) {
      throw new InternalServerErrorException(ERR_FAILED_TO_CREATE_USER);
    }
  }

  async getUserById(id: number): Promise<User> {
    return this.usersRepository.findOne({id: id});
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({email: email});
  }

  async updateUser(updateData: UpdateUserInput): Promise<User> {
    const {
      id,
      status,
      firstName,
      lastName,
      email,
      role,
      licenseType,
    } = updateData;

    const user = await this.getUserById(id);
    if (!user) {
      throw new BadRequestException(sprintf(ERR_USER_NOT_FOUND, id));
    }

    if (email) {
      const userWithEmail = await this.getUserByEmail(email);
      if (userWithEmail
        && userWithEmail.id !== id
      ) {
        throw new BadRequestException(sprintf(ERR_USER_ALREADY_EXIST, email));
      }
      user.email = email;
    }

    if (firstName) {
      user.userInfo.firstName = firstName;
    }

    if (lastName) {
      user.userInfo.lastName = lastName;
    }

    if (role) {
      user.userInfo.role = role;
    }

    if (licenseType) {
      user.userInfo.licenseType = licenseType;
    }

    if (status) {
      user.status = status;
    }

    user.updatedAt = new Date();

    return this.usersRepository.save(user);
  }

  async deleteUserById(id: number): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new BadRequestException(sprintf(ERR_USER_NOT_FOUND, id));
    }
    const deleteResult = await this.usersRepository.delete({id: user.id});
    if (deleteResult.affected !== 1) {
      throw new InternalServerErrorException(sprintf(ERR_FAILED_TO_DELETE_USER, user.id));
    }
    return user;
  }

  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await this.usersRepository.update({
      id: userId,
    }, {
      refreshToken,
    });
  }

  async updateResetPasswordData(userId: number, token: string, password: string = null): Promise<void> {
    const updateData: Partial<User> = {};

    updateData.resetPasswordToken = token;
    if (token) {
      const expTimestamp = Date.now() + 60 * 1000 * 60;
      updateData.resetPasswordExpirationDate = new Date(expTimestamp);
    } else {
      updateData.resetPasswordExpirationDate = null;
    }

    if (password) {
      const newSalt = await bcrypt.genSalt();
      const newPasswordHash = await bcrypt.hash(password, newSalt);
      updateData.passwordSalt = newSalt;
      updateData.passwordHash = newPasswordHash;
    }
    await this.usersRepository.update({id: userId}, updateData);
  }

  async getUserByResetToken(token: string): Promise<User> {
    return this.usersRepository.findOne({resetPasswordToken: token});
  }

  private static composeSearchConditions(filterParams: Partial<GetUsersInput>): GetUsersFilterConditionInterface {
    const {role, licenseType, firstName, lastName, status} = filterParams;
    const conditions: GetUsersFilterConditionInterface = {};
    conditions.userInfo = {};

    if (role) {
      conditions.userInfo.role = UserService.applyRoleFilter(role);
    }

    if (licenseType) {
      conditions.userInfo.licenseType = UserService.applyLicenseTypeFilter(licenseType);
    }

    if (firstName
      && firstName.length > 2
    ) {
      conditions.userInfo.firstName = Like(`%${firstName}%`);
    }

    if (lastName
      && lastName.length > 2
    ) {
      conditions.userInfo.lastName = Like(`%${lastName}%`);
    }

    if (status) {
      conditions.status = UserService.applyStatusFilter(status);
    }

    return conditions;
  }

  private static applyRoleFilter(role: UserRole[]): FindOperator<any> {
    return Raw((alias) => `${alias} && ARRAY[:...role]::user_info_role_enum[]`,
      {
        role,
      },
    );
  }

  private static applyLicenseTypeFilter(licenseType: LicenseType[]): FindOperator<any> {
    return Raw((alias) => `${alias} IN(:...licenseType)`,
      {
        licenseType,
      },
    );
  }

  private static applyStatusFilter(status: UserStatus[]): FindOperator<any> {
    return Raw((alias) => `${alias} IN(:...status)`,
      {
        status,
      });
  }

}
