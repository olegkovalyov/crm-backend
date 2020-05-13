import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthModel } from './models/auth.model';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './inputs/login.input';
import { UsersService } from '../users/users.service';
import { CreateUserInput } from '../users/inputs/create-user.input';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Resolver('Auth')
export class AuthResolver {

  constructor(private readonly jwtService: JwtService,
              private readonly  usersService: UsersService) {
  }

  @Mutation(returns => AuthModel)
  async login(@Args('loginData') input: LoginInput) {
    const user = await this.usersService.getUserByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    console.log(user);

    const passwordHash = await bcrypt.hash(input.password, user.passwordSalt);
    if (passwordHash !== user.passwordHash) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const token = await this.jwtService.sign({
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      licenseType: user.licenseType,
    });

    return {
      user,
      token,
    };
  }

  @Mutation(returns => AuthModel)
  async register(@Args('registerData') input: CreateUserInput) {
    const user = await this.usersService.createUser(input);
    const token = await this.jwtService.sign({
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      licenseType: user.licenseType,
    });
    return {
      user,
      token,
    };
  }
}
