import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CreateUserInput} from '../inputs/user/create-user.input';
import {UserService} from '../services/user.service';
import {UserModel} from '../models/user.model';
import {GetUsersInput} from '../inputs/user/get-users.input';
import {BadRequestException, UnauthorizedException} from '@nestjs/common';
import {UpdateUserInput} from '../inputs/user/update-user.input';
import {UserRole} from '../interfaces/user.interface';
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
import {ClientModel} from '../models/client.model';
import {CreateClientInput} from '../inputs/clients/create-client.input';
import {ClientService} from '../services/client.service';
import {GetClientsFilterInput} from '../inputs/clients/get-clients-filter.input';
import {UpdateClientInput} from '../inputs/clients/update-client.input';
import {GraphqlService} from '../services/graphql.service';
import {NotifyService} from '../services/notify.service';

@Resolver('User')
export class UsersResolver {

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

  @Mutation(returns => AuthModel)
  async register(
    @Args('registerInput') input: CreateUserInput,
    @ServerResponse() res: Response,
  ): Promise<AuthModel> {
    // Fill user data
    const user = await this.userService.createUser(input);
    const userInfo = await this.userService.createUserInfo(input, user);

    // Produce auth
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);
    await this.userService.updateRefreshToken(user, refreshToken);
    res.cookie('refreshToken', refreshToken, {httpOnly: true});

    // Notify about success registration
    await this.notifyService.notifyUserRegistration(
      user.email,
      userInfo.firstName,
      userInfo.lastName,
    );

    // Transform response to graphql model
    const payload = this.graphQlService.constructUserModel(user, userInfo);

    return {
      payload,
      accessToken,
    };
  }










  @Query(returns => [UserModel])
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getMembers(@Args('getMembersFilterInput') getMembersFilterInput: GetUsersInput): Promise<UserModel[]> {
    console.log('fetching members...');
    const members = await this.userService.getUsers(getMembersFilterInput);
    return members.map(member => this.userService.transformToGraphQlMemberModel(member));
  }

  @Query(returns => UserModel, {nullable: true})
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getMember(@Args('id', {type: () => Int}) id: number): Promise<UserModel> {
    const member = await this.userService.getMemberById(id);
    if (!member) {
      throw new BadRequestException('Member not found');
    }
    return this.userService.transformToGraphQlMemberModel(member);
  }

  @Mutation(returns => UserModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async createMember(@Args('createMemberInput') createMemberInput: CreateUserInput): Promise<UserModel> {
    const member = await this.userService.createUser(createMemberInput);
    return this.userService.transformToGraphQlMemberModel(member);
  }

  @Mutation(returns => UserModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async updateMember(@Args('updateMemberInput') updateMemberData: UpdateUserInput): Promise<UserModel> {
    const updatedMember = await this.userService.updateMember(updateMemberData);
    return this.userService.transformToGraphQlMemberModel(updatedMember);
  }

  @Mutation(returns => UserModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteMember(@Args('id', {type: () => Int}) id: number): Promise<UserModel> {
    const member = await this.userService.deleteMemberById(id);
    return this.userService.transformToGraphQlMemberModel(member);
  }

  @Query(returns => [UserModel], {nullable: true})
  async getStaff(): Promise<UserModel[]> {
    const members = await this.userService.getMembersByRoles([
      UserRole.TM,
      UserRole.COACH,
      UserRole.CAMERAMAN,
      UserRole.PACKER,
    ]);
    return members.map(member => this.userService.transformToGraphQlMemberModel(member));
  }

  @Mutation(returns => AuthModel)
  async login(
    @Args('loginInput') input: LoginInput,
    @ServerResponse() res: Response,
  ): Promise<AuthModel> {
    const {email, password} = input;
    const member = await this.userService.getUserByEmail(email);

    if (!member) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const passwordHash = await bcrypt.hash(password, member.passwordSalt);
    if (passwordHash !== member.passwordHash) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    const accessToken = await this.authService.generateAccessToken(member);
    const refreshToken = await this.authService.generateRefreshToken(member);

    await this.userService.updateRefreshToken(member, refreshToken);

    res.cookie('refreshToken', refreshToken, {httpOnly: true});
    return {
      payload: this.userService.transformToGraphQlMemberModel(member),
      accessToken,
    };
  }

  @Query(returns => AuthModel)
  async refreshToken(
    @ServerResponse() res: Response,
    @ServerRequest() req: Request,
  ): Promise<AuthModel> {
    const refreshToken = req.headers.refreshtoken as string;
    if (!refreshToken) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Member not found or session is expired');
    }

    const decodedData = await this.jwtService.verifyAsync(refreshToken, this.configService.get('SECRET'));
    if (!decodedData) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Member not found or session is expired');
    }

    const member = await this.userService.getUserByEmail((decodedData as DecodedRefreshTokenInterface).email);
    if (!member) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Member not found or session is expired');
    }

    const accessToken = await this.authService.generateAccessToken(member);
    const newRefreshToken = await this.authService.generateRefreshToken(member);
    await this.userService.updateRefreshToken(member, newRefreshToken);
    res.cookie('refreshToken', newRefreshToken);
    return {
      payload: this.userService.transformToGraphQlMemberModel(member),
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
    const member = await this.userService.getUserByEmail(forgotPasswordData.email);

    if (!member) {
      throw new UnauthorizedException('Email is invalid');
    }

    const token = await this.randomStringService.generate({
      length: 24,
      charset: 'alphabetic',
    }).toPromise();

    // await this.mailerService.sendMail({
    //   to: member.email,
    //   from: this.configService.get<string>('MAIL_DEFAULT_FROM'),
    //   subject: 'Reset password',
    //   template: 'forgot-password',
    //   context: {
    //     link: this.configService.get('FRONTEND_HOST') + '/reset-password/' + token,
    //     username: `${member.firstName} ${member.lastName}`,
    //   },
    // });

    await this.userService.updateResetPasswordInfo(member, token);

    return {
      wasSentEmail: true,
    };
  }

  @Mutation(returns => AuthModel)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordData: ResetPasswordInput,
    @ServerResponse() res: Response,
  ) {

    const member = await this.userService.getMemberByResetToken(resetPasswordData.token);
    if (!member
      || Date.now() > (new Date(member.resetPasswordExpirationDate)).getTime()
    ) {
      throw new UnauthorizedException('Member not found or token is expired');
    }

    await this.userService.updateResetPasswordInfo(member, null, resetPasswordData.password);

    const accessToken = await this.authService.generateAccessToken(member);
    const refreshToken = await this.authService.generateRefreshToken(member);

    res.cookie('refreshToken', refreshToken, {httpOnly: true});

    // await this.mailerService.sendMail({
    //   to: member.email,
    //   from: this.configService.get<string>('MAIL_DEFAULT_FROM'),
    //   subject: 'Your password successfully changes',
    //   template: 'reset-password',
    //   context: {
    //     username: `${member.firstName} ${member.lastName}`,
    //   },
    // });

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

  @Query(returns => ClientModel, {nullable: true})
  async getClient(@Args('id', {type: () => Int}) id: number): Promise<ClientModel> {
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

  @Mutation(returns => ClientModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteClient(@Args('id', {type: () => Int}) id: number): Promise<ClientModel> {
    const client = await this.clientService.deleteClientById(id);
    return this.clientService.transformToGraphQlClientModel(client);
  }
}
