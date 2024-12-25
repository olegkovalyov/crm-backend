import {Resolver, Mutation, Args, Query} from '@nestjs/graphql';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {JwtService} from '@nestjs/jwt';
import {RegisterInput} from '../inputs/register.input';
import {Auth} from '../models/auth.model';
import {LoginInput} from '../inputs/login.input';
import {AccessTokenInput} from '../inputs/access-token.input';
import {AccessToken} from '../models/access-token.model';
import {CreateAccountCommand} from '../../../../accounts/application/commands/createAccount.command';
import {LoadAccountQuery} from '../../../../accounts/application/queries/loadAccount.query';
import {Account} from '../../../../accounts/domain/entities/account.entity';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {
  }

  @Mutation(() => Auth)
  async register(@Args('registerInput') registerInput: RegisterInput): Promise<Auth> {

    const createAccountCommand = new CreateAccountCommand(
      'okovalyov@test.com',
      'Oleh',
      'Kovalov',
    );

    const id: number = await this.commandBus.execute(createAccountCommand);

    const loadAccountQuery = new LoadAccountQuery(id);

    const account: Account = await this.queryBus.execute(loadAccountQuery);

    return Auth.create(
      id,
      account.getEmail(),
      account.getFirstName(),
      account.getLastName(),
    );
  }

  @Mutation(() => Auth)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<Auth> {
    return Auth.create(
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
