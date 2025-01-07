import {CommandHandler, ICommandHandler, QueryBus} from '@nestjs/cqrs';
import {LoginCommand} from '../login.command';
import {JwtService} from '@nestjs/jwt';
import {GetAccountByEmailQuery} from '../../../../../accounts/application/queries/get-account-by-email.query';
import * as bcrypt from 'bcrypt';
import {Account} from '../../../../../accounts/domain/entities/account';
import {ConfigService} from '@nestjs/config';

interface AuthInterface {
  accessToken: string,
  refreshToken: string,
}

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly queryBus: QueryBus,
  ) {
  }

  async execute(command: LoginCommand): Promise<AuthInterface> {
    const account: Account = await this.queryBus.execute(new GetAccountByEmailQuery(command.email));
    if (!account) {
      throw new Error('Account not found');
    }

    const isValidPassword = await bcrypt.compare(command.password, account.getPassword().value);
    if (!isValidPassword) {
      throw new Error('Email or password are invalid');
    }

    const accessToken = await this.jwtService.signAsync({
      accountId: account.getId().value,
      email: command.email,
      firstName: account.getName().firstName,
      lastName: account.getName().lastName,
    });

    const refreshToken = await this.jwtService.signAsync({
        email: command.email,
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_TTL'),
      });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
