import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthModel } from '../models/auth.model';
import { LoginInput } from '../inputs/login.input';
import { MembersService } from '../../members/services/members.service';
import { CreateMemberInput } from '../../members/inputs/create-member.input';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../services/auth.service';
import { MemberRole } from '../../members/interfaces/member.interface';
import { ForgotPasswordInput } from '../inputs/forgot-password.input';
import { ForgotPasswordModel } from '../models/forgot-password.model';
import { RandomStringService } from '@akanass/nestjsx-crypto';
import { ResetPasswordInput } from '../inputs/reset-password.input';
import { ServerRequest, ServerResponse } from '../decorators/decorators';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IDecodedRefreshToken, ITokens } from '../interfaces/auth.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Resolver('Auth')
export class AuthResolver {

  constructor(private readonly authService: AuthService,
              private readonly memberService: MembersService,
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
    const member = await this.memberService.getMemberByEmail(input.email);

    if (!member) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const passwordHash = await bcrypt.hash(input.password, member.passwordSalt);
    if (passwordHash !== member.passwordHash) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const { accessToken, refreshToken } = await this.authService.createOrUpdateTokens(member);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return {
      user: member,
      accessToken,
    };
  }

  @Mutation(returns => AuthModel)
  async register(
    @Args('registerData') input: CreateMemberInput,
    @ServerResponse() res: Response,
  ) {
    if (!input.roles.includes(MemberRole.SKYDIVER)) {
      throw new BadRequestException('Invalid role');
    }
    const member = await this.memberService.createMember(input);

    const { accessToken, refreshToken } = await this.authService.createOrUpdateTokens(member);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    await this.mailerService.sendMail({
      to: member.email,
      from: this.configService.get<string>('MAIL_DEFAULT_FROM'),
      subject: 'Welcome to Skydive CRM',
      template: 'welcome',
      context: {
        username: `${member.firstName} ${member.lastName}`,
        login: `${member.email}`,
      },
    });

    return {
      user: member,
      accessToken,
    };
  }

  @Mutation(returns => ForgotPasswordModel)
  async forgotPassword(@Args('forgotPasswordData') forgotPasswordInput: ForgotPasswordInput) {
    const member = await this.memberService.getMemberByEmail(forgotPasswordInput.email);

    if (!member) {
      throw new UnauthorizedException('Email is invalid');
    }

    const token = await this.randomStringService.generate({
      length: 24,
      charset: 'alphabetic',
    }).toPromise();

    await this.mailerService.sendMail({
      to: member.email,
      from: this.configService.get<string>('MAIL_DEFAULT_FROM'),
      subject: 'Reset password',
      template: 'forgot-password',
      context: {
        link: this.configService.get('FRONTEND_HOST') + '/reset-password/' + token,
        username: `${member.firstName} ${member.lastName}`,
      },
    });

    await this.memberService.updateResetPasswordInfo(member, token);

    return {
      wasSentEmail: true,
    };
  }

  @Mutation(returns => AuthModel)
  async resetPassword(
    @Args('resetPasswordData') input: ResetPasswordInput,
    @ServerResponse() res: Response,
  ) {

    const member = await this.memberService.getMemberByResetToken(input.token);
    if (!member
      || Date.now() > (new Date(member.resetPasswordExpirationDate)).getTime()
    ) {
      throw new UnauthorizedException('Member not found or token is expired');
    }

    await this.memberService.updateResetPasswordInfo(member, null, input.password);

    const { accessToken, refreshToken } = await this.authService.createOrUpdateTokens(member);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    await this.mailerService.sendMail({
      to: member.email,
      from: this.configService.get<string>('MAIL_DEFAULT_FROM'),
      subject: 'Your password successfully changes',
      template: 'reset-password',
      context: {
        username: `${member.firstName} ${member.lastName}`,
      },
    });

    return {
      user: member,
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
      throw new UnauthorizedException('Member not found or session is expired');
    }
    let member = null;
    let accessToken = '';

    try {
      const decodedData = await this.jwtService.verifyAsync(refreshToken, this.configService.get('SECRET'));
      if (decodedData) {
        member = await this.memberService.getMemberByEmail((decodedData as IDecodedRefreshToken).email);
        const tokens: ITokens = await this.authService.createOrUpdateTokens(member);
        accessToken = tokens.accessToken;
        res.cookie('refreshToken', tokens.refreshToken);
      }
    } catch (e) {
      await this.authService.clearRefreshToken(refreshToken);
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Member not found or session is expired');
    }
    return {
      user: member,
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
