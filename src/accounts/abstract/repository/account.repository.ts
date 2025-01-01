import {Account} from '../../domain/entities/account';

export abstract class AccountRepository {
  abstract findAll(): Promise<Account[]>

  abstract findById(id: number): Promise<Account | null>

  abstract save(account: Account): Promise<Account>
}
