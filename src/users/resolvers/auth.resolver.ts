import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CreateUserInput} from '../inputs/user/create-user.input';
import {UserService} from '../services/user.service';
import {UnauthorizedException} from '@nestjs/common';
import {AuthModel} from '../models/auth.model';
import {LoginInput} from '../inputs/auth/login.input';
import * as bcrypt from 'bcryptjs';
import {Response, Request} from 'express';
import {AuthService} from '../services/auth.service';
import {MailerService} from '@nestjs-modules/mailer';
import {ConfigService} from '@nestjs/config';
import {ServerRequest, ServerResponse} from '../decorators/decorators';
import {JwtService} from '@nestjs/jwt';
import {DecodedRefreshTokenInterface} from '../interfaces/auth.interface';
import {ForgotPasswordInput} from '../inputs/auth/forgot-password.input';
import {ForgotPasswordModel} from '../models/forgot-password.model';
import {RandomStringService} from '@akanass/nestjsx-crypto';
import {ResetPasswordInput} from '../inputs/auth/reset-password.input';
import {ClientService} from '../services/client.service';
import {GraphqlService} from '../services/graphql.service';
import {NotifyService} from '../services/notify.service';
import {User} from '../entities/user.entity';
import {
  ERR_EMAIL_OR_PASSWORD_ARE_INVALID,
  ERR_USER_NOT_FOUND_OR_TOKEN_EXPIRED,
} from '../constants/auth.error';

@Resolver('Auth')
export class AuthResolver {

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

  @Mutation(() => AuthModel)
  async register(
    @Args('registerInput') input: CreateUserInput,
    @ServerResponse() res: Response,
  ): Promise<AuthModel> {
    // Fill user data
    const user = await this.userService.createUser(input);

    // Produce auth
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);
    await this.userService.updateRefreshToken(user.id, refreshToken);
    res.cookie('refreshToken', refreshToken, {httpOnly: true});

    // Notify about success registration
    await this.notifyService.notifyUserRegistration(
      user.email,
      user.userInfo.firstName,
      user.userInfo.lastName,
    );

    // Transform response to graphql model
    const payload = this.graphQlService.constructUserModel(user);

    return {
      payload,
      accessToken,
    };
  }

  @Mutation(() => AuthModel)
  async login(
    @Args('loginInput') input: LoginInput,
    @ServerResponse() res: Response,
  ): Promise<AuthModel> {
    const {email, password} = input;
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException(ERR_EMAIL_OR_PASSWORD_ARE_INVALID);
    }

    const passwordHash = await bcrypt.hash(password, user.passwordSalt);
    if (passwordHash !== user.passwordHash) {
      throw new UnauthorizedException(ERR_EMAIL_OR_PASSWORD_ARE_INVALID);
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    await this.userService.updateRefreshToken(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {httpOnly: true});

    // Transform response to graphql model
    const payload = this.graphQlService.constructUserModel(user);

    return {
      payload,
      accessToken,
    };
  }

  @Query(() => AuthModel)
  async refreshToken(
    @ServerResponse() res: Response,
    @ServerRequest() req: Request,
  ): Promise<AuthModel> {
    const refreshToken = req.headers.refreshtoken as string;

    const user = await this.getUserFromRefreshToken(refreshToken);
    if (!user) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException(ERR_USER_NOT_FOUND_OR_TOKEN_EXPIRED);
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const newRefreshToken = await this.authService.generateRefreshToken(user);
    await this.userService.updateRefreshToken(user.id, newRefreshToken);
    res.cookie('refreshToken', newRefreshToken);

    // Transform response to graphql model
    const payload = this.graphQlService.constructUserModel(user);

    return {
      payload,
      accessToken,
    };
  }

  @Query(() => Boolean)
  async logout(
    @ServerResponse() res: Response,
    @ServerRequest() req: Request,
  ): Promise<boolean> {

    const refreshToken = req.headers.refreshtoken as string;
    const user = await this.getUserFromRefreshToken(refreshToken);
    if (!user) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException(ERR_USER_NOT_FOUND_OR_TOKEN_EXPIRED);
    }

    await this.userService.updateRefreshToken(user.id, null);
    res.clearCookie('refreshToken');
    return true;
  }

  @Mutation(() => ForgotPasswordModel)
  async forgotPassword(@Args('forgotPasswordInput') forgotPasswordData: ForgotPasswordInput) {
    const user = await this.userService.getUserByEmail(forgotPasswordData.email);

    if (!user) {
      throw new UnauthorizedException('Email is invalid');
    }

    const token = await this.randomStringService.generate({
      length: 24,
      charset: 'alphabetic',
    }).toPromise();

    // Notify about first step of password reset procedure
    const wasSentEmail = await this.notifyService.notifyFirstStepOfPasswordReset(
      user.email,
      user.userInfo.firstName,
      user.userInfo.lastName,
      token,
    );

    await this.userService.updateResetPasswordData(user.id, token);

    return {
      wasSentEmail,
    };
  }

  @Mutation(() => AuthModel)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordData: ResetPasswordInput,
    @ServerResponse() res: Response,
  ) {

    const user = await this.userService.getUserByResetToken(resetPasswordData.token);
    if (!user
      || Date.now() > (new Date(user.resetPasswordExpirationDate)).getTime()
    ) {
      throw new UnauthorizedException(ERR_USER_NOT_FOUND_OR_TOKEN_EXPIRED);
    }

    await this.userService.updateResetPasswordData(user.id, null, resetPasswordData.password);

    // Notify about first step of password reset procedure
    await this.notifyService.notifySuccessOfPasswordReset(
      user.email,
      user.userInfo.firstName,
      user.userInfo.lastName,
    );

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {httpOnly: true});

    // Transform response to graphql model
    const payload = this.graphQlService.constructUserModel(user);

    return {
      payload,
      accessToken,
    };
  }

  private async getUserFromRefreshToken(refreshToken: string | null | undefined): Promise<User | null> {
    if (!refreshToken) {
      return null;
    }

    const decodedData = await this.jwtService.verifyAsync(refreshToken, this.configService.get('SECRET'));
    if (!decodedData) {
      return null;
    }

    const user = await this.userService.getUserByEmail((decodedData as DecodedRefreshTokenInterface).email);
    if (!user) {
      return null;
    }

    return user;
  }
}
