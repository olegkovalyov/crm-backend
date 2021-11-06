import {BadRequestException, Injectable, InternalServerErrorException, Scope} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Like, Raw, Repository} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {User} from '../entities/user.entity';
import {CreateUserInput} from '../inputs/user/create-user.input';
import {GetUsersInput} from '../inputs/user/get-users.input';
import {UpdateUserInput} from '../inputs/user/update-user.input';
import {GetUsersFilterConditionInterface} from '../interfaces/user.interface';
import {UserInfo} from '../entities/user-info.entity';

@Injectable({scope: Scope.REQUEST})
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
  }

  async getUsers(filterParams: GetUsersInput): Promise<User[]> {
    const conditions: GetUsersFilterConditionInterface = {};

    if (filterParams.role
      || filterParams.status
      || filterParams.licenseType
      || filterParams.firstName
      || filterParams.lastName
    ) {
      if (filterParams.role
        && filterParams.role.length
      ) {
        conditions.userInfo = {};
        conditions.userInfo.role = Raw((alias) => `${alias} && ARRAY[:...role]::user_info_role_enum[]`,
          {
            role: filterParams.role,
          },
        );
      }

      if (filterParams.licenseType
        && filterParams.licenseType.length
      ) {
        if (conditions.userInfo === undefined) {
          conditions.userInfo = {};
        }
        conditions.userInfo.licenseType = Raw((alias) => `${alias} IN(:...licenseType)`,
          {
            licenseType: filterParams.licenseType,
          },
        );
      }

      if (filterParams.firstName
        && filterParams.firstName.length > 2
      ) {
        if (conditions.userInfo === undefined) {
          conditions.userInfo = {};
        }
        conditions.userInfo.firstName = Like(`%${filterParams.firstName}%`);
      }

      if (filterParams.lastName
        && filterParams.lastName.length > 2
      ) {
        if (conditions.userInfo === undefined) {
          conditions.userInfo = {};
        }
        conditions.userInfo.lastName = Like(`%${filterParams.lastName}%`);
      }

      if (filterParams.status
        && filterParams.status.length
      ) {
        conditions.status = Raw((alias) => `${alias} IN(:...status)`,
          {
            status: filterParams.status,
          });
      }
    }
    return this.usersRepository.find({
      relations: ['userInfo'],
      where: conditions,
    });

  }

  async createUser(input: CreateUserInput): Promise<User> {
    const {email, password, status, firstName, lastName, licenseType, role} = input;

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

    const userInfo = new UserInfo();
    userInfo.firstName = firstName;
    userInfo.lastName = lastName;
    userInfo.role = role;
    userInfo.licenseType = licenseType;

    user.userInfo = userInfo;

    try {
      return this.usersRepository.save(user);
    } catch (e) {
      throw new InternalServerErrorException('Failed to create user');
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
      throw new BadRequestException(`User with id: ${id} doesnt exists`);
    }


    if (email) {
      const userWithEmail = await this.getUserByEmail(email);
      if (userWithEmail
        && userWithEmail.id !== id
      ) {
        throw new BadRequestException(`User with email: ${email} already exists`);
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
      throw new BadRequestException(`User with id: ${id} doesn't exists`);
    }
    const deleteResult = await this.usersRepository.delete({id: user.id});
    if (deleteResult.affected !== 1) {
      throw new InternalServerErrorException(`Failed to delete user with id: ${id}`);
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
}
