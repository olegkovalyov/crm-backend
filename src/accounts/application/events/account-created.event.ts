import {Account} from '../../domain/entities/account';

export class AccountCreatedEvent {
  constructor(
    public readonly account: Account
  ) {
  }
}
