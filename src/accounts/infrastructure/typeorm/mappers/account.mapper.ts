import {AccountEntity} from '../entities/account.entity';
import {Account} from '../../../domain/entities/account.entity';

export class AccountMapper {
  static toDomain(accountEntity: AccountEntity): Account {
    return Account.create(
      accountEntity.id,
      accountEntity.email,
      accountEntity.firstName,
      accountEntity.lastName,
      accountEntity.isActive,
    );
  }

  static toPersistence(account: Account): AccountEntity {
    const accountEntity = new AccountEntity();
    accountEntity.id = account.getId();
    accountEntity.email = account.getEmail();
    accountEntity.firstName = account.getFirstName();
    accountEntity.lastName = account.getLastName();
    accountEntity.isActive = account.isActive();
    return accountEntity;
  }
}
