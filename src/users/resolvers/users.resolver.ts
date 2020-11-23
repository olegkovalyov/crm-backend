import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMemberInput } from '../inputs/create-member.input';
import { MembersService } from '../services/members.service';
import { Member } from '../entities/member.entity';
import { MemberModel } from '../models/member.model';
import { GetMembersFilterInput } from '../inputs/get-members-filter.input';
import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UpdateMemberInput } from '../inputs/update-member.input';
import { MemberRole } from '../interfaces/member.interface';
import { AuthModel } from '../models/auth.model';
import { LoginInput } from '../inputs/login.input';
import * as bcrypt from 'bcryptjs';
import { Response, Request } from 'express';
import { AuthService } from '../services/auth.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ServerRequest, ServerResponse } from '../decorators/decorators';
import { JwtService } from '@nestjs/jwt';
import { DecodedRefreshTokenInterface } from '../interfaces/auth.interface';
import { ForgotPasswordInput } from '../inputs/forgot-password.input';
import { ForgotPasswordModel } from '../models/forgot-password.model';
import { RandomStringService } from '@akanass/nestjsx-crypto';
import { ResetPasswordInput } from '../inputs/reset-password.input';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IsAdminOrManifestGuard } from '../guards/is-admin-or-manifest-guard.guard';
import { ClientModel } from '../models/client.model';
import { CreateClientInput } from '../inputs/create-client.input';
import { ClientsService } from '../services/clients.service';
import { Client } from '../entities/client.entity';
import { ClientStatus, ClientType, Gender, PaymentStatus } from '../interfaces/client.interface';
import { GetClientsFilterInput } from '../inputs/get-clients-filter.input';
import { UpdateClientInput } from '../inputs/update-client.input';

@Resolver('User')
export class UsersResolver {

  constructor(
    private readonly membersService: MembersService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly randomStringService: RandomStringService,
    private readonly clientsService: ClientsService,
  ) {
  }

  @Query(returns => [MemberModel])
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getMembers(@Args('getMembersFilterInput') getMembersFilterInput: GetMembersFilterInput): Promise<MemberModel[]> {
    const members = await this.membersService.getMembers(getMembersFilterInput);
    return members.map(member => this.prepareMember(member));
  }

  @Query(returns => MemberModel, { nullable: true })
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getMember(@Args('id', { type: () => Int }) id: number): Promise<MemberModel> {
    const member = await this.membersService.getMemberById(id);
    if (!member) {
      throw new BadRequestException('Member not found');
    }
    return this.prepareMember(member);
  }

  @Mutation(returns => MemberModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async createMember(@Args('createMemberInput') createMemberInput: CreateMemberInput): Promise<MemberModel> {
    const member = await this.membersService.createMember(createMemberInput);
    return this.prepareMember(member);
  }

  @Mutation(returns => MemberModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async updateMember(@Args('updateMemberData') updateMemberData: UpdateMemberInput): Promise<MemberModel> {
    const updatedMember = await this.membersService.updateMember(updateMemberData);
    return this.prepareMember(updatedMember);
  }

  @Mutation(returns => Boolean)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteMember(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.membersService.deleteMemberById(id);
  }

  @Query(returns => [MemberModel], { nullable: true })
  async getStaff(): Promise<MemberModel[]> {
    const members = await this.membersService.getMembersByRoles([
      MemberRole.TM,
      MemberRole.COACH,
      MemberRole.CAMERAMAN,
      MemberRole.PACKER,
    ]);
    return members.map(member => this.prepareMember(member));
  }

  @Mutation(returns => AuthModel)
  async login(
    @Args('loginInput') input: LoginInput,
    @ServerResponse() res: Response,
  ): Promise<AuthModel> {
    const { email, password } = input;
    const member = await this.membersService.getMemberByEmail(email);

    if (!member) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const passwordHash = await bcrypt.hash(password, member.passwordSalt);
    if (passwordHash !== member.passwordHash) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const accessToken = await this.authService.generateAccessToken(member);
    const refreshToken = await this.authService.generateRefreshToken(member);

    await this.membersService.updateRefreshToken(member, refreshToken);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return {
      payload: this.prepareMember(member),
      accessToken,
    };
  }


  @Mutation(returns => AuthModel)
  async register(
    @Args('registerInput') input: CreateMemberInput,
    @ServerResponse() res: Response,
  ): Promise<AuthModel> {
    const member = await this.membersService.createMember(input);

    const accessToken = await this.authService.generateAccessToken(member);
    const refreshToken = await this.authService.generateRefreshToken(member);

    await this.membersService.updateRefreshToken(member, refreshToken);

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
      payload: this.prepareMember(member),
      accessToken,
    };
  }

  @Query(returns => AuthModel)
  async refreshToken(
    @ServerResponse() res: Response,
    @ServerRequest() req: Request,
  ): Promise<AuthModel> {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Member not found or session is expired');
    }

    const decodedData = await this.jwtService.verifyAsync(refreshToken, this.configService.get('SECRET'));
    if (!decodedData) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Member not found or session is expired');
    }

    const member = await this.membersService.getMemberByEmail((decodedData as DecodedRefreshTokenInterface).email);
    if (!member) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Member not found or session is expired');
    }

    const accessToken = await this.authService.generateAccessToken(member);
    const newRefreshToken = await this.authService.generateRefreshToken(member);
    await this.membersService.updateRefreshToken(member, newRefreshToken);
    res.cookie('refreshToken', newRefreshToken);
    return {
      payload: this.prepareMember(member),
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
  async forgotPassword(@Args('forgotPasswordData') forgotPasswordInput: ForgotPasswordInput) {
    const member = await this.membersService.getMemberByEmail(forgotPasswordInput.email);

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

    await this.membersService.updateResetPasswordInfo(member, token);

    return {
      wasSentEmail: true,
    };
  }

  @Mutation(returns => AuthModel)
  async resetPassword(
    @Args('resetPasswordData') input: ResetPasswordInput,
    @ServerResponse() res: Response,
  ) {

    const member = await this.membersService.getMemberByResetToken(input.token);
    if (!member
      || Date.now() > (new Date(member.resetPasswordExpirationDate)).getTime()
    ) {
      throw new UnauthorizedException('Member not found or token is expired');
    }

    await this.membersService.updateResetPasswordInfo(member, null, input.password);

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
  async createClient(@Args('createClientData') createData: CreateClientInput): Promise<ClientModel> {
    const newClient = await this.clientsService.createClient(createData);
    return this.prepareClient(newClient);
  }


  @Query(returns => ClientModel, { nullable: true })
  async getClient(@Args('id', { type: () => Int }) id: number): Promise<ClientModel> {
    const client = await this.clientsService.getClientById(id);
    if (!client) {
      throw new BadRequestException('Client not found');
    }
    return this.prepareClient(client);
  }

  @Query(returns => [ClientModel])
  async getClients(@Args('getClientsFilterInput') getClientsFilterInput: GetClientsFilterInput): Promise<ClientModel[]> {
    const clients = await this.clientsService.getClients(getClientsFilterInput);
    return clients.map(client => this.prepareClient(client));
  }

  @Mutation(returns => ClientModel)
  async updateClient(@Args('updateClientData') updateData: UpdateClientInput): Promise<ClientModel> {
    const client = await this.clientsService.updateClient(updateData);
    return this.prepareClient(client);
  }

  @Mutation(returns => Boolean)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteClient(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.clientsService.deleteClientById(id);
  }

  prepareMember(member: Member):
    MemberModel {
    return {
      id: member.id,
      userId: member.user.id,
      status: member.status,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      roles: member.roles,
      licenseType: member.licenseType,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }

  prepareClient(client: Client): ClientModel {
    return {
      id: client.id,
      userId: client.user.id,
      status: client.status,
      paymentStatus: client.paymentStatus,
      type: client.type,
      gender: client.gender,
      age: client.age,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      weight: client.weight,
      phone: client.phone,
      address: client.address,
      withHandCameraVideo: client.withHandCameraVideo,
      withCameraman: client.withCameraman,
      notes: client.notes,
      certificate: client.certificate,
      tm: client.tm,
      cameraman: client.cameraman,
      createdAt: client.createdAt,
      processedAt: client.processedAt,
    };
  }
}
