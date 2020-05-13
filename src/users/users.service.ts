import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from './interfaces/user.interface';
import { CreateUserInput } from './inputs/create-user.input';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserInterface>) {
  }

  async getUsers(): Promise<UserInterface[]> {
    return this.userModel.find().exec();
  }

  async getUserById(id: string): Promise<UserInterface> {
    return this.userModel.findOne({ id: id }).exec();
  }

  async getUserByEmail(email: string): Promise<UserInterface> {
    return this.userModel.findOne({ email });
  }

  async removeUserById(id: string) {
    return this.userModel.findOneAndDelete({ id: id }).exec();
  }

  async createUser(createUserData: CreateUserInput): Promise<UserInterface> {
    const { firstName, lastName, email, password, role, licenseType } = createUserData;

    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt();


    return this.userModel.create({
      id: uuid(),
      firstName,
      lastName,
      email,
      passwordHash: await bcrypt.hash(password, salt),
      passwordSalt: salt,
      role,
      licenseType,
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString(),
    });
  }
}
