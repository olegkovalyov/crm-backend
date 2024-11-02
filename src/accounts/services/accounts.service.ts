import {Injectable} from '@nestjs/common';
import {CreateAccountInput} from '../dto/create-account.input';
import {Account} from '../entities/account.entity';

@Injectable()
export class AccountsService {

  private accounts: Account[] = [];

  constructor() {
  }

  create(createAccountInput: CreateAccountInput): Account {
    const account = Account.create(createAccountInput);
    this.accounts.push(account);
    return account;
  }

  findAll() {
    return this.accounts;
  }
}
