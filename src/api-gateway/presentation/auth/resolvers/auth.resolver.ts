import {Resolver, Mutation, Args, Query} from '@nestjs/graphql';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {JwtService} from '@nestjs/jwt';
import {RegisterInput} from '../inputs/register.input';
import {AuthModel} from '../models/auth.model';
import {LoginInput} from '../inputs/login.input';
import {AccessTokenInput} from '../inputs/access-token.input';
import {AccessToken} from '../models/access-token.model';
import {CreateAccountCommand} from '../../../../accounts/application/commands/createAccount.command';
import {GetAuthQuery} from '../../../application/auth/queries/getAuthQuery';
import {Auth} from '../../../domain/entities/auth.entity';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {
  }

  @Mutation(() => AuthModel)
  async register(@Args('registerInput') registerInput: RegisterInput): Promise<AuthModel> {

    const createAccountCommand = new CreateAccountCommand(
      registerInput.email,
      registerInput.firstName,
      registerInput.lastName,
      registerInput.password,
    );

    const accountId: number = await this.commandBus.execute(createAccountCommand);

    const getAuthQuery = new GetAuthQuery(accountId);

    const auth: Auth = await this.queryBus.execute(getAuthQuery);

    return AuthModel.create(
      accountId,
      auth.getEmail(),
      auth.getFirstName(),
      auth.getLastName(),
      auth.getAccessToken(),
      auth.getRefreshToken(),
    );
  }

  @Mutation(() => AuthModel)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthModel> {
    return AuthModel.create(
      1,
      loginInput.email,
      'Oleh',
      'Kovalov',
    );
  }

  @Query(() => AccessToken)
  async accessToken(@Args('accessTokenInput') accessTokenInput: AccessTokenInput): Promise<boolean> {
    return true;
  }
}
