import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from './models/user.model';
import { LicenseType, UserInterface, UserRole } from './interfaces/user.interface';
import { CreateUserInput } from './inputs/create-user.input';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(of => UserModel)
export class UsersResolver {

  constructor(private readonly usersService: UsersService) {

  }

  @Query(returns => [UserModel], { nullable: 'items' })
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<UserInterface[]> {
    return this.usersService.getUsers();
  }

  @Query(returns => UserModel, { nullable: true })
  async getUser(@Args('id') id: string): Promise<UserInterface> {
    return this.usersService.getUserById(id);
  }

  @Mutation(returns => UserModel, { nullable: true })
  async removeUser(@Args('id') id: string) {
    return this.usersService.removeUserById(id);
  }

  @Mutation(returns => UserModel)
  async createUser(@Args('createUserData') createUserData: CreateUserInput): Promise<UserInterface> {
    return this.usersService.createUser(createUserData);
  }
}
