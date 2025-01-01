import {Resolver, Mutation, Args, Query} from '@nestjs/graphql';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {RegisterInput} from '../inputs/register.input';
import {AuthModel} from '../models/auth.model';
import {LoginInput} from '../inputs/login.input';
import {AccessTokenInput} from '../inputs/access-token.input';
import {AuthTokenModel} from '../models/auth-token.model';
import {CreateAccountCommand} from '../../../../accounts/application/commands/create-account.command';
import {CreateAuthCommand} from '../../../application/auth/commands/create-auth.command';
import {GetAuthQuery} from '../../../application/auth/queries/get-auth.query';
import {Auth} from '../../../domain/entities/auth';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
  }

  @Mutation(() => AuthTokenModel)
  async register(@Args('registerInput') registerInput: RegisterInput): Promise<AuthTokenModel> {

    const accountId: number = await this.commandBus.execute(new CreateAccountCommand(
      registerInput.email,
      registerInput.firstName,
      registerInput.lastName,
      registerInput.password,
    ));

    const authId: number = await this.commandBus.execute(new CreateAuthCommand(
      accountId,
      registerInput.email,
      registerInput.firstName,
      registerInput.lastName,
      true,
    ));

    const auth: Auth = await this.queryBus.execute(new GetAuthQuery(authId));

    console.log('auth:', auth);

    return AuthTokenModel.create(
      auth.getAccessToken(),
      auth.getRefreshToken(),
    );
  }

  @Mutation(() => AuthModel)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthTokenModel> {
    return AuthTokenModel.create(
      '',
      '',
    );
  }

  @Query(() => AuthTokenModel)
  async accessToken(@Args('accessTokenInput') accessTokenInput: AccessTokenInput): Promise<AuthTokenModel> {
    return AuthTokenModel.create(
      '',
      '',
    );
  }
}
