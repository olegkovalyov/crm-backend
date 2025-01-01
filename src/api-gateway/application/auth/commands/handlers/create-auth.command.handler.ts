import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {AuthRepository} from '../../../../abstract/repository/auth.repository';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {CreateAuthCommand} from '../create-auth.command';
import {Auth} from '../../../../domain/entities/auth';

@CommandHandler(CreateAuthCommand)
export class CreateAuthCommandHandler implements ICommandHandler<CreateAuthCommand> {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
  }

  async execute(command: CreateAuthCommand) {
    const accessToken = await this.jwtService.signAsync({
      accountId: command.accountId,
      email: command.email,
      firstName: command.firstName,
      lastName: command.lastName,
    });

    const refreshToken = await this.jwtService.signAsync({
        accountId: command.accountId,
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_TTL'),
      });
    const auth = Auth.create(
      null,
      command.accountId,
      command.email,
      command.firstName,
      command.lastName,
      command.isActive,
      accessToken,
      refreshToken,
    );

    const savedAuth = await this.authRepository.save(auth);

    console.log('auth saved: ', savedAuth);
  }
}
