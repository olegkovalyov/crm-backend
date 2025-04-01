import {Resolver, Mutation, Args, Query} from '@nestjs/graphql';
import {CommandBus, EventBus, QueryBus} from '@nestjs/cqrs';
import {RegisterInput} from '../inputs/register.input';
import {AuthModel} from '../models/auth.model';
import {LoginInput} from '../inputs/login.input';
import {AccessTokenInput} from '../inputs/access-token.input';
import {RegisterCommand} from '../../../application/auth/commands/register.command';
import {LoginCommand} from '../../../application/auth/commands/login.command';
import {Result} from 'ts-results';
import {AuthInterface} from '../../../application/auth/commands/handlers/login.command.handler';

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

    const registerCommandResult: Result<number, Error> = await this.commandBus.execute(new RegisterCommand(
      registerInput.email,
      registerInput.password,
      registerInput.firstName,
      registerInput.lastName,
    ));

    if (registerCommandResult.err) {
      throw new Error('Failed to register user. '+ registerCommandResult.val.message);
    }

    const loginCommandResult: Result<AuthInterface, Error> = await this.commandBus.execute(new LoginCommand(
      registerInput.email,
      registerInput.password,
    ));

    if (loginCommandResult.err) {
      throw loginCommandResult.val;
    }

    if (loginCommandResult.ok) {
      const {accessToken, refreshToken} = loginCommandResult.val;
      return AuthModel.create(
        accessToken,
        refreshToken,
      );
    }
  }

  @Mutation(() => AuthModel)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthModel> {
    const loginCommandResult: Result<AuthInterface, Error> = await this.commandBus.execute(new LoginCommand(
      loginInput.email,
      loginInput.password,
    ));

    if (loginCommandResult.err) {
      throw loginCommandResult.val;
    }

    if (loginCommandResult.ok) {
      const {accessToken, refreshToken} = loginCommandResult.val;
      return AuthModel.create(
        accessToken,
        refreshToken,
      );
    }
  }

  @Query(() => AuthModel)
  async accessToken(@Args('accessTokenInput') accessTokenInput: AccessTokenInput): Promise<AuthModel> {
    return AuthModel.create(
      '',
      '',
    );
  }
}
