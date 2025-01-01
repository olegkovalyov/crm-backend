import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {AuthRepository} from '../../../../abstract/repository/auth.repository';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {AccountCreatedEvent} from '../../../../../accounts/application/events/account-created.event';

@EventsHandler(AccountCreatedEvent)
export class UserRegisteredEventHandler implements IEventHandler<AccountCreatedEvent> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
  }

  async handle(event: AccountCreatedEvent) {
    console.log('Account created: ', event);
    // const accessToken = await this.jwtService.signAsync({
    //   accountId: event.accountId,
    //   email: event.email,
    //   firstName: event.firstName,
    //   lastName: event.lastName,
    //   isActive: event.isActive,
    // });
    //
    // const refreshToken = await this.jwtService.signAsync({
    //     accountId: event.accountId,
    //   },
    //   {
    //     expiresIn: this.configService.get('JWT_REFRESH_TOKEN_TTL'),
    //   });
    // const auth = Auth.create(
    //   null,
    //   event.accountId,
    //   event.email,
    //   event.firstName,
    //   event.lastName,
    //   event.isActive,
    //   accessToken,
    //   refreshToken,
    // );
    //
    // const savedAuth = await this.authRepository.save(auth);
    //
    // console.log('auth saved: ', savedAuth);
  }
}
