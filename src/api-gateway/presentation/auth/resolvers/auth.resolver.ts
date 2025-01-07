import {Resolver, Mutation, Args, Query} from '@nestjs/graphql';
import {CommandBus, EventBus, QueryBus} from '@nestjs/cqrs';
import {RegisterInput} from '../inputs/register.input';
import {AuthModel} from '../models/auth.model';
import {LoginInput} from '../inputs/login.input';
import {AccessTokenInput} from '../inputs/access-token.input';
import {RegisterCommand} from '../../../application/auth/commands/register.command';
import {LoginCommand} from '../../../application/auth/commands/login.command';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {
  }

  @Mutation(() => AuthModel)
  async register(@Args('registerInput') registerInput: RegisterInput): Promise<AuthModel> {

    await this.commandBus.execute(new RegisterCommand(
      registerInput.email,
      registerInput.password,
      registerInput.firstName,
      registerInput.lastName,
    ));

    const auth = await this.commandBus.execute(new LoginCommand(
      registerInput.email,
      registerInput.password,
    ));

    return AuthModel.create(
      auth.accessToken,
      auth.refreshToken,
    );
  }

  @Mutation(() => AuthModel)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthModel> {
    const auth = await this.commandBus.execute(new LoginCommand(
      loginInput.email,
      loginInput.password,
    ));

    return AuthModel.create(
      auth.accessToken,
      auth.refreshToken,
    );
  }

  @Query(() => AuthModel)
  async accessToken(@Args('accessTokenInput') accessTokenInput: AccessTokenInput): Promise<AuthModel> {
    return AuthModel.create(
      '',
      '',
    );
  }
}
