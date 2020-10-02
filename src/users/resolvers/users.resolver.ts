import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { CreateUserInput } from '../inputs/create-user.input';
import { UsersService } from '../services/users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateUserInput } from '../inputs/update-user.input';

@Resolver(of => UserModel)
export class UsersResolver {

  constructor(private readonly usersService: UsersService) {

  }

  @Query(returns => [UserModel], { nullable: 'items' })
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<IUser[]> {
    return this.usersService.getUsers();
  }

  @Query(returns => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async getUser(@Args('id') id: string): Promise<IUser> {
    return this.usersService.getUserById(id);
  }

  @Mutation(returns => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async removeUser(@Args('id') id: string) {
    return this.usersService.removeUserById(id);
  }

  @Mutation(returns => UserModel)
  @UseGuards(JwtAuthGuard)
  async createUser(@Args('createUserData') createUserData: CreateUserInput): Promise<IUser> {
    return this.usersService.createUser(createUserData);
  }

  @Mutation(returns => UserModel)
  @UseGuards(JwtAuthGuard)
  async updateUser(@Args('updateUserData') updateUserData: UpdateUserInput): Promise<IUser> {
    return this.usersService.updateUser(updateUserData);
  }
}
