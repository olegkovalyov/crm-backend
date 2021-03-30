import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMemberInput } from '../inputs/members/create-member.input';
import { MemberService } from '../services/member.service';
import { MemberModel } from '../models/member.model';
import { GetMembersFilterInput } from '../inputs/members/get-members-filter.input';
import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UpdateMemberInput } from '../inputs/members/update-member.input';
import { MemberRole } from '../interfaces/member.interface';
import { AuthModel } from '../models/auth.model';
import { LoginInput } from '../inputs/auth/login.input';
import * as bcrypt from 'bcryptjs';
import { Response, Request } from 'express';
import { AuthService } from '../services/auth.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ServerRequest, ServerResponse } from '../decorators/decorators';
import { JwtService } from '@nestjs/jwt';
import { DecodedRefreshTokenInterface } from '../interfaces/auth.interface';
import { ForgotPasswordInput } from '../inputs/auth/forgot-password.input';
import { ForgotPasswordModel } from '../models/forgot-password.model';
import { RandomStringService } from '@akanass/nestjsx-crypto';
import { ResetPasswordInput } from '../inputs/auth/reset-password.input';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IsAdminOrManifestGuard } from '../guards/is-admin-or-manifest-guard.guard';
import { ClientModel } from '../models/client.model';
import { CreateClientInput } from '../inputs/clients/create-client.input';
import { ClientService } from '../services/client.service';
import { Client } from '../entities/client.entity';
import { GetClientsFilterInput } from '../inputs/clients/get-clients-filter.input';
import { UpdateClientInput } from '../inputs/clients/update-client.input';

@Resolver('User')
export class UsersResolver {

  constructor(
    private readonly memberService: MemberService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly randomStringService: RandomStringService,
    private readonly clientService: ClientService,
  ) {
  }

  @Query(returns => [MemberModel])
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getMembers(@Args('getMembersFilterInput') getMembersFilterInput: GetMembersFilterInput): Promise<MemberModel[]> {
    console.log('fetching members...');
    const members = await this.memberService.getMembers(getMembersFilterInput);
    return members.map(member => this.memberService.transformToGraphQlMemberModel(member));
  }

  @Query(returns => MemberModel, { nullable: true })
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getMember(@Args('id', { type: () => Int }) id: number): Promise<MemberModel> {
    const member = await this.memberService.getMemberById(id);
    if (!member) {
      throw new BadRequestException('Member not found');
    }
    return this.memberService.transformToGraphQlMemberModel(member);
  }

  @Mutation(returns => MemberModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async createMember(@Args('createMemberInput') createMemberInput: CreateMemberInput): Promise<MemberModel> {
    const member = await this.memberService.createMember(createMemberInput);
    return this.memberService.transformToGraphQlMemberModel(member);
  }

  @Mutation(returns => MemberModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async updateMember(@Args('updateMemberInput') updateMemberData: UpdateMemberInput): Promise<MemberModel> {
    const updatedMember = await this.memberService.updateMember(updateMemberData);
    return this.memberService.transformToGraphQlMemberModel(updatedMember);
  }

  @Mutation(returns => Boolean)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteMember(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.memberService.deleteMemberById(id);
  }

  @Query(returns => [MemberModel], { nullable: true })
  async getStaff(): Promise<MemberModel[]> {
    const members = await this.memberService.getMembersByRoles([
      MemberRole.TM,
      MemberRole.COACH,
      MemberRole.CAMERAMAN,
      MemberRole.PACKER,
    ]);
    return members.map(member => this.memberService.transformToGraphQlMemberModel(member));
  }

  @Mutation(returns => AuthModel)
  async login(
    @Args('loginInput') input: LoginInput,
    @ServerResponse() res: Response,
  ): Promise<AuthModel> {
    const { email, password } = input;
    const member = await this.memberService.getMemberByEmail(email);

    if (!member) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const passwordHash = await bcrypt.hash(password, member.passwordSalt);
    if (passwordHash !== member.passwordHash) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const accessToken = await this.authService.generateAccessToken(member);
    const refreshToken = await this.authService.generateRefreshToken(member);

    await this.memberService.updateRefreshToken(member, refreshToken);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return {
      payload: this.memberService.transformToGraphQlMemberModel(member),
      accessToken,
    };
  }


  @Mutation(returns => AuthModel)
  async register(
    @Args('registerInput') input: CreateMemberInput,
    @ServerResponse() res: Response,
  ): Promise<AuthModel> {
    const member = await this.memberService.createMember(input);

    const accessToken = await this.authService.generateAccessToken(member);
    const refreshToken = await this.authService.generateRefreshToken(member);

    await this.memberService.updateRefreshToken(member, refreshToken);

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
      payload: this.memberService.transformToGraphQlMemberModel(member),
      accessToken,
    };
  }

  @Query(returns => AuthModel)
  async refreshToken(
    @ServerResponse() res: Response,
    @ServerRequest() req: Request,
  ): Promise<AuthModel> {
    const refreshToken = req.headers.refreshtoken as string;
    // console.log(refreshToken);
    if (!refreshToken) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Member not found or session is expired');
    }

    const decodedData = await this.jwtService.verifyAsync(refreshToken, this.configService.get('SECRET'));
    if (!decodedData) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Member not found or session is expired');
    }

    const member = await this.memberService.getMemberByEmail((decodedData as DecodedRefreshTokenInterface).email);
    if (!member) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Member not found or session is expired');
    }

    const accessToken = await this.authService.generateAccessToken(member);
    const newRefreshToken = await this.authService.generateRefreshToken(member);
    await this.memberService.updateRefreshToken(member, newRefreshToken);
    res.cookie('refreshToken', newRefreshToken);
    return {
      payload: this.memberService.transformToGraphQlMemberModel(member),
      accessToken,
    };
  }

  @Query(returns => Boolean)
  async logout(
    @ServerResponse() res: Response,
    @ServerRequest() req: Request,
  ): Promise<boolean> {
    res.clearCookie('refreshToken');
    return true;
  }

  @Mutation(returns => ForgotPasswordModel)
  async forgotPassword(@Args('forgotPasswordInput') forgotPasswordData: ForgotPasswordInput) {
    const member = await this.memberService.getMemberByEmail(forgotPasswordData.email);

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
    @Args('resetPasswordInput') resetPasswordData: ResetPasswordInput,
    @ServerResponse() res: Response,
  ) {

    const member = await this.memberService.getMemberByResetToken(resetPasswordData.token);
    if (!member
      || Date.now() > (new Date(member.resetPasswordExpirationDate)).getTime()
    ) {
      throw new UnauthorizedException('Member not found or token is expired');
    }

    await this.memberService.updateResetPasswordInfo(member, null, resetPasswordData.password);

    const accessToken = await this.authService.generateAccessToken(member);
    const refreshToken = await this.authService.generateRefreshToken(member);

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


  @Mutation(returns => ClientModel)
  async createClient(@Args('createClientInput') createClientData: CreateClientInput): Promise<ClientModel> {
    const newClient = await this.clientService.createClient(createClientData);
    return this.clientService.transformToGraphQlClientModel(newClient);
  }


  @Query(returns => ClientModel, { nullable: true })
  async getClient(@Args('id', { type: () => Int }) id: number): Promise<ClientModel> {
    const client = await this.clientService.getClientById(id);
    if (!client) {
      throw new BadRequestException('Client not found');
    }
    return this.clientService.transformToGraphQlClientModel(client);
  }

  @Query(returns => [ClientModel])
  async getClients(@Args('getClientsFilterInput') getClientsFilterInput: GetClientsFilterInput): Promise<ClientModel[]> {
    const clients = await this.clientService.getClients(getClientsFilterInput);
    return clients.map(client => this.clientService.transformToGraphQlClientModel(client));
  }

  @Mutation(returns => ClientModel)
  async updateClient(@Args('updateClientInput') updateData: UpdateClientInput): Promise<ClientModel> {
    const client = await this.clientService.updateClient(updateData);
    return this.clientService.transformToGraphQlClientModel(client);
  }

  @Mutation(returns => Boolean)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteClient(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.clientService.deleteClientById(id);
  }
}
