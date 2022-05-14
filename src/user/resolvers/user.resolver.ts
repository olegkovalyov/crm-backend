import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CreateUserInput} from '../inputs/create-user.input';
import {UserService} from '../services/user.service';
import {UserModel} from '../models/user.model';
import {GetUsersInput} from '../inputs/get-users.input';
import {BadRequestException, InternalServerErrorException} from '@nestjs/common';
import {UpdateUserInput} from '../inputs/update-user.input';
import {UserRole} from '../interfaces/user.interface';
import {GraphqlService} from '../../common/services/graphql.service';
import {sprintf} from 'sprintf-js';
import {
  ERR_FAILED_TO_DELETE_USER,
  ERR_USER_ALREADY_EXIST,
  ERR_USER_NOT_FOUND,
} from '../../common/constants/user.constant';
import {EventEmitter2, OnEvent} from '@nestjs/event-emitter';
import {Member} from '../../user-management/domain/entities/member.entity';
import {Guid} from 'guid-typescript';
import {IdentityInfo} from '../../user-management/domain/value-objects/identity-info.value-object';
import {Skill} from '../../user-management/domain/value-objects/skill.value-object';

@Resolver('User')
export class UserResolver {

  constructor(
    private readonly userService: UserService,
    private readonly graphQlService: GraphqlService,
    private readonly eventEmitter: EventEmitter2,
  ) {
  }

  @Query(() => [UserModel])
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getUsers(@Args('getUsersInput') getUsersInput: GetUsersInput): Promise<UserModel[]> {
    const users = await this.userService.getUsers(getUsersInput);
    return users.map(user => this.graphQlService.constructUserModel(user));
  }

  @Query(() => UserModel, {nullable: true})
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getUser(@Args('id', {type: () => Int}) id: number): Promise<UserModel> {
    const user = await this.userService.getUser(id);
    if (!user) {
      throw new BadRequestException(sprintf(ERR_USER_NOT_FOUND, id));
    }
    return this.graphQlService.constructUserModel(user);
  }

  @Mutation(() => UserModel, {nullable: true})
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async createUser(@Args('createUserInput') input: CreateUserInput): Promise<void> {
    const {email} = input;

    const member = Member.create(
      null,
      'Oleh',
      'Kovalov',
      'kovalov@test.com',
      ['+380973604500'],
      ['CAMERAMAN'],
      [],
    );
    console.log('Member: ', member.getValue());
  }

  @Mutation(() => UserModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async updateUser(@Args('updateUserInput') input: UpdateUserInput): Promise<UserModel> {
    const user = await this.userService.getUser(input.id);
    if (!user) {
      throw new BadRequestException(sprintf(ERR_USER_NOT_FOUND, input.id));
    }

    if (input.email) {
      const existingUser = await this.userService.getUserByEmail(input.email);
      if (
        existingUser
        && existingUser.id !== input.id
      ) {
        throw new BadRequestException(sprintf(ERR_USER_ALREADY_EXIST, input.email));
      }
    }

    const updatedUser = await this.userService.updateUser(input);
    return this.graphQlService.constructUserModel(updatedUser);
  }

  @Mutation(() => UserModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteUser(@Args('id', {type: () => Int}) id: number): Promise<UserModel> {
    const user = await this.userService.getUser(id);
    if (!user) {
      throw new BadRequestException(sprintf(ERR_USER_NOT_FOUND, id));
    }
    if (!await this.userService.deleteUser(id)) {
      throw new InternalServerErrorException(sprintf(ERR_FAILED_TO_DELETE_USER, user.id));
    }
    return this.graphQlService.constructUserModel(user);
  }

  @Query(() => [UserModel])
  async getStaff(): Promise<UserModel[]> {
    const staff = await this.userService.getUsers({
      role: [
        UserRole.TM,
        UserRole.COACH,
        UserRole.CAMERAMAN,
        UserRole.PACKER,
      ],
    });
    return staff.map(staff => this.graphQlService.constructUserModel(staff));
  }
}
