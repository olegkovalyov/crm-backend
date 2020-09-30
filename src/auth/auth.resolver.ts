import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { ServerRequest, ServerResponse } from './decorators/decorators';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IDecodedRefreshToken, ITokens } from './interfaces/auth.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Resolver('Auth')
export class AuthResolver {

  constructor(private readonly authService: AuthService,
              private readonly usersService: UsersService,
              private readonly randomStringService: RandomStringService,
              private readonly jwtService: JwtService,
              private readonly configService: ConfigService,
              private readonly mailerService: MailerService,
  ) {
  }

  @Mutation(returns => AuthModel)
  async login(
    @Args('loginData') input: LoginInput,
    @ServerResponse() res: Response,
  ) {
    const user = await this.usersService.getUserByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const passwordHash = await bcrypt.hash(input.password, user.passwordSalt);
    if (passwordHash !== user.passwordHash) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const { accessToken, refreshToken } = await this.authService.createOrUpdateTokens(user);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return {
      user,
      accessToken,
    };
  }

  @Mutation(returns => AuthModel)
  async register(
    @Args('registerData') input: CreateUserInput,
    @ServerResponse() res: Response,
  ) {
    if (input.role !== UserRole.SKYDIVER) {
      throw new BadRequestException('Invalid role');
    }
    const user = await this.usersService.createUser(input);

    const { accessToken, refreshToken } = await this.authService.createOrUpdateTokens(user);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    await this.mailerService.sendMail({
      to: user.email,
      from: this.configService.get<string>('MAIL_DEFAULT_FROM'),
      subject: 'Welcome to Skydive CRM',
      template: 'welcome',
      context: {
        username: `${user.firstName} ${user.lastName}`,
        login: `${user.email}`,
      },
    });

    return {
      user,
      accessToken,
    };
  }

  @Mutation(returns => ForgotPasswordModel)
  async forgotPassword(@Args('forgotPasswordData') input: ForgotPasswordInput) {
    const user = await this.usersService.getUserByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Email is invalid');
    }

    const token = await this.randomStringService.generate({
      length: 24,
      charset: 'alphabetic',
    }).toPromise();

    await this.mailerService.sendMail({
      to: user.email,
      from: this.configService.get<string>('MAIL_DEFAULT_FROM'),
      subject: 'Reset password',
      template: 'forgot-password',
      context: {
        link: this.configService.get('FRONTEND_HOST') + '/reset-password/' + token,
        username: `${user.firstName} ${user.lastName}`,
      },
    });

    await this.usersService.updateResetPasswordInfo(user, token);

    return {
      wasSentEmail: true,
    };
  }

  @Mutation(returns => AuthModel)
  async resetPassword(
    @Args('resetPasswordData') input: ResetPasswordInput,
    @ServerResponse() res: Response,
  ) {

    const user = await this.usersService.getUserByResetToken(input.token);
    if (!user
      || Date.now() > (new Date(user.resetPasswordExpirationDate)).getTime()
    ) {
      throw new UnauthorizedException('User not found or token is expired');
    }

    await this.usersService.updateResetPasswordInfo(user, null, input.password);

    const { accessToken, refreshToken } = await this.authService.createOrUpdateTokens(user);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    await this.mailerService.sendMail({
      to: user.email,
      from: this.configService.get<string>('MAIL_DEFAULT_FROM'),
      subject: 'Your password successfully changes',
      template: 'reset-password',
      context: {
        username: `${user.firstName} ${user.lastName}`,
      },
    });

    return {
      user,
      accessToken,
    };
  }

  @Query(returns => AuthModel)
  async refreshToken(
    @ServerResponse() res: Response,
    @ServerRequest() req: Request,
  ) {
    // throw new UnauthorizedException('User not found or token is expired');
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('User not found or session is expired');
    }
    let user = null;
    let accessToken = '';

    try {
      const decodedData = await this.jwtService.verifyAsync(refreshToken, this.configService.get('SECRET'));
      if (decodedData) {
        user = await this.usersService.getUserByEmail((decodedData as IDecodedRefreshToken).email);
        const tokens: ITokens = await this.authService.createOrUpdateTokens(user);
        accessToken = tokens.accessToken;
        res.cookie('refreshToken', tokens.refreshToken);
      }
    } catch (e) {
      await this.authService.clearRefreshToken(refreshToken);
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('User not found or session is expired');
    }
    return {
      user,
      accessToken,
    };
  }

  @Query(returns => AuthModel)
  async logout(
    @ServerResponse() res: Response,
    @ServerRequest() req: Request,
  ) {
    const refreshToken = req.cookies['refreshToken'];

    if (refreshToken) {
      await this.authService.clearRefreshToken(refreshToken);
    }
    res.clearCookie('refreshToken');
    return {
      user: null,
      accessToken: null,
    };
  }
}
