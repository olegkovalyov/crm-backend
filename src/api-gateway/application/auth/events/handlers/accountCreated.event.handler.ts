import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {AccountCreatedEvent} from '../../../../../accounts/application/events/accountCreated.event';
import {AuthRepository} from '../../../../abstract/repository/auth.repository';
import {Auth} from '../../../../domain/entities/auth.entity';
import {randomStringGenerator} from '@nestjs/common/utils/random-string-generator.util';

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedEventHandler implements IEventHandler<AccountCreatedEvent> {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {
  }

  async handle(event: AccountCreatedEvent) {
    const auth = Auth.create(
      null,
      event.userId,
      event.email,
      event.firstName,
      event.lastName,
      event.active,
      'accessToken here: ' + randomStringGenerator(),
      'refreshToken here: ' + randomStringGenerator(),
    );

    const savedAuth = await this.authRepository.save(auth);

    console.log('auth saved: ', savedAuth);
  }
}
