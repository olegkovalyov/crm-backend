import { BadRequestException, Injectable, Scope, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, IUserAccessTokenPayload, UserRole } from '../interfaces/user.interface';
import { CreateUserInput } from '../inputs/create-user.input';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { UpdateUserInput } from '../inputs/update-user.input';
import { availableUserRoles } from '../constants/user.constants';
import { GetUsersFilterInput } from '../inputs/get-users-filter.input';
import { CONTEXT } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @Inject(CONTEXT) private context,
    @InjectModel('User') private userModel: Model<IUser>,
    private readonly jwtService: JwtService,
  ) {
  }

  async getUsers(filterParams: GetUsersFilterInput): Promise<IUser[]> {
    const conditions = {};

    // const token = this.context.req.header('authorization').slice(7);
    // const decodedToken = this.jwtService.decode(token) as IUserAccessTokenPayload;
    // if (decodedToken) {
    //   conditions['email'] = { $ne: decodedToken.email };
    // }

    if (filterParams.roles) {
      conditions['roles'] = { $in: filterParams.roles };
    }
    if (filterParams.statuses) {
      conditions['status'] = { $in: filterParams.statuses };
    }

    return this.userModel.find(conditions).sort({ updatedAt: -1 }).exec();
  }

  async getUserById(id: string): Promise<IUser> {
    return this.userModel.findOne({ id: id }).exec();
  }

  async getUserByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne({ email });
  }

  async getUsersByRoles(roles: UserRole[]): Promise<IUser[]> {
    return this.userModel.find({ roles: { $in: roles } }).exec();
  }

  async removeUserById(id: string) {
    return this.userModel.findOneAndDelete({ id: id }).exec();
  }

  async createUser(createUserData: CreateUserInput): Promise<IUser> {
    const { status, firstName, lastName, email, password, roles, licenseType } = createUserData;

    if (roles
      && !this.validateRoles(roles)
    ) {
      throw new BadRequestException(`Invalid roles`);
    }

    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt();

    return this.userModel.create({
      id: uuid(),
      status,
      firstName,
      lastName,
      email,
      passwordHash: await bcrypt.hash(password, salt),
      passwordSalt: salt,
      resetPasswordToken: null,
      resetPasswordExpirationDate: null,
      roles,
      licenseType,
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString(),
    });
  }

  async updateUser(updateData: UpdateUserInput): Promise<IUser> {
    const { id, status, firstName, lastName, email, password, roles, licenseType } = updateData;

    if (roles
      && !this.validateRoles(roles)
    ) {
      throw new BadRequestException(`Invalid roles`);
    }

    const user = await this.userModel.findOne({ id });
    if (!user) {
      throw new BadRequestException(`User with id: ${id} doesnt exists`);
    }

    if (email) {
      const userWithEmail = await this.userModel.findOne({ email });
      if (userWithEmail
        && userWithEmail.id !== id
      ) {
        throw new BadRequestException(`User with email: ${email} already exists`);
      }
      user.email = email;
    }

    if (password) {
      const newSalt = await bcrypt.genSalt();
      const newPasswordHash = await bcrypt.hash(password, newSalt);
      user.passwordSalt = newSalt;
      user.passwordHash = newPasswordHash;
    }

    if (status) {
      user.status = status;
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (roles) {
      user.roles = roles;
    }

    if (licenseType) {
      user.licenseType = licenseType;
    }

    user.updatedAt = new Date();

    return user.save();
  }

  async updateResetPasswordInfo(user: IUser, token: string, password: string = null): Promise<void> {
    if (token) {
      user.resetPasswordToken = token;
      const expTimestamp = Date.now() + 60 * 1000 * 60;
      user.resetPasswordExpirationDate = new Date(expTimestamp);
    } else {
      user.resetPasswordToken = null;
      user.resetPasswordExpirationDate = null;
    }

    if (password) {
      const newSalt = await bcrypt.genSalt();
      const newPasswordHash = await bcrypt.hash(password, newSalt);
      user.passwordSalt = newSalt;
      user.passwordHash = newPasswordHash;
    }

    try {
      await user.save();
    } catch (e) {

    }
  }

  async getUserByResetToken(token: string): Promise<IUser> {
    return this.userModel.findOne({ resetPasswordToken: token }).exec();
  }

  private validateRoles(roles: UserRole[]): boolean {
    let isValid = true;
    roles.every((role) => {
      if (!availableUserRoles.includes(role)) {
        isValid = false;
      }
    });
    return isValid;
  }
}
