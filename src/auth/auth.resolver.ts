import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthModel } from './models/auth.model';
import { LoginInput } from './inputs/login.input';
import { UsersService } from '../users/users.service';
import { CreateUserInput } from '../users/inputs/create-user.input';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UserRole } from '../users/interfaces/user.interface';
import { ForgotPasswordInput } from './inputs/forgot-password.input';
import { ForgotPasswordModel } from './models/forgot-password.model';
import { RandomStringService } from '@akanass/nestjsx-crypto';
import { ResetPasswordInput } from './inputs/reset-password.input';

@Resolver('Auth')
export class AuthResolver {

  constructor(private readonly authService: AuthService,
              private readonly  usersService: UsersService,
              private readonly randomStringService: RandomStringService,
  ) {
  }

  @Mutation(returns => AuthModel)
  async login(@Args('loginData') input: LoginInput) {
    const user = await this.usersService.getUserByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const passwordHash = await bcrypt.hash(input.password, user.passwordSalt);
    if (passwordHash !== user.passwordHash) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const token = await this.authService.generateToken(user);
    return {
      user,
      token,
    };
  }

  @Mutation(returns => AuthModel)
  async register(@Args('registerData') input: CreateUserInput) {
    if (input.role !== UserRole.SKYDIVER) {
      throw new BadRequestException('Invalid role');
    }
    const user = await this.usersService.createUser(input);
    const token = await this.authService.generateToken(user);
    return {
      user,
      token,
    };
  }

  @Mutation(returns => ForgotPasswordModel)
  async forgotPassword(@Args('forgotPasswordData') input: ForgotPasswordInput) {

    let wasSentEmail = false;
    const user = await this.usersService.getUserByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Email is invalid');
    }
    try {
      const token = await this.randomStringService.generate({
        length: 24,
        charset: 'alphabetic',
      }).toPromise();
      wasSentEmail = await this.authService.sendForgotPasswordEmailWithToken(user, token);
      if (wasSentEmail) {
        await this.usersService.updateResetPasswordInfo(user, token);
      }
    } catch (e) {
    }

    return {
      wasSentEmail,
    };
  }

  @Mutation(returns => AuthModel)
  async resetPassword(@Args('resetPasswordData') input: ResetPasswordInput) {

    const user = await this.usersService.getUserByResetToken(input.token);
    if (!user
      || Date.now() > (new Date(user.resetPasswordExpirationDate)).getTime()
    ) {
      throw new UnauthorizedException('User not found or reset token is expired');
    }

    await this.usersService.updateResetPasswordInfo(user,null, input.password);
    const token = await this.authService.generateToken(user);
    return {
      user,
      token,
    };
  }
}
