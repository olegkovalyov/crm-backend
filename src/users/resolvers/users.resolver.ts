import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CreateUserInput} from '../inputs/user/create-user.input';
import {UserService} from '../services/user.service';
import {UserModel} from '../models/user.model';
import {GetUsersInput} from '../inputs/user/get-users.input';
import {BadRequestException} from '@nestjs/common';
import {UpdateUserInput} from '../inputs/user/update-user.input';
import {UserRole} from '../interfaces/user.interface';
import {AuthService} from '../services/auth.service';
import {MailerService} from '@nestjs-modules/mailer';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {RandomStringService} from '@akanass/nestjsx-crypto';
import {ClientService} from '../services/client.service';
import {GraphqlService} from '../services/graphql.service';
import {NotifyService} from '../services/notify.service';

@Resolver('User')
export class UsersResolver {

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly notifyService: NotifyService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly randomStringService: RandomStringService,
    private readonly clientService: ClientService,
    private readonly graphQlService: GraphqlService,
  ) {
  }

  @Query(returns => [UserModel])
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getUsers(@Args('getUsersInput') getUsersInput: GetUsersInput): Promise<UserModel[]> {
    const users = await this.userService.getUsers(getUsersInput);
    return users.map(user => this.graphQlService.constructUserModel(user));
  }

  @Query(returns => UserModel, {nullable: true})
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getUser(@Args('id', {type: () => Int}) id: number): Promise<UserModel> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.graphQlService.constructUserModel(user);
  }

  @Mutation(returns => UserModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<UserModel> {
    const user = await this.userService.createUser(createUserInput);
    return this.graphQlService.constructUserModel(user);
  }

  @Mutation(returns => UserModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async updateUser(@Args('updateUserInput') updateUserData: UpdateUserInput): Promise<UserModel> {
    const updatedUser = await this.userService.updateUser(updateUserData);
    return this.graphQlService.constructUserModel(updatedUser);
  }

  @Mutation(returns => UserModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteUser(@Args('id', {type: () => Int}) id: number): Promise<UserModel> {
    const user = await this.userService.deleteUserById(id);
    return this.graphQlService.constructUserModel(user);
  }

  @Query(returns => [UserModel], {nullable: true})
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
