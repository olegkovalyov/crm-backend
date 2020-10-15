import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { CreateUserInput } from '../inputs/create-user.input';
import { UsersService } from '../services/users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateUserInput } from '../inputs/update-user.input';
import { GetUsersFilterInput } from '../inputs/get-users-filter.input';
import { IsAdminOrManifestGuard } from '../../auth/guards/is-admin-or-manifest-guard.service';

@Resolver(of => UserModel)
export class UsersResolver {

  constructor(private readonly usersService: UsersService) {

  }

  @Query(returns => [UserModel], { nullable: 'items' })
  @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getUsers(@Args('getUsersFilterInput') getUsersFilterInput: GetUsersFilterInput): Promise<IUser[]> {
    return this.usersService.getUsers(getUsersFilterInput);
  }

  @Query(returns => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getUser(@Args('id') id: string): Promise<IUser> {
    return this.usersService.getUserById(id);
  }

  @Mutation(returns => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async removeUser(@Args('id') id: string) {
    return this.usersService.removeUserById(id);
  }

  @Mutation(returns => UserModel)
  @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async createUser(@Args('createUserData') createUserData: CreateUserInput): Promise<IUser> {
    return this.usersService.createUser(createUserData);
  }

  @Mutation(returns => UserModel)
  @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async updateUser(@Args('updateUserData') updateUserData: UpdateUserInput): Promise<IUser> {
    return this.usersService.updateUser(updateUserData);
  }
}
