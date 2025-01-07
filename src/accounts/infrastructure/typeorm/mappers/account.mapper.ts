import {AccountEntity} from '../../../../core/infrasctucture/typeorm/entities/account.entity';
import {Account} from '../../../domain/entities/account';
import {CreateAccountDto} from '../../../domain/dto/create-account.dto';

export class AccountMapper {
  static toDomain(accountEntity: AccountEntity): Account {
    const createAccountDto = new CreateAccountDto();
    createAccountDto.id = accountEntity.id;
    createAccountDto.email = accountEntity.email;
    createAccountDto.password = accountEntity.password;
    createAccountDto.firstName = accountEntity.firstName;
    createAccountDto.lastName = accountEntity.lastName;
    createAccountDto.isActive = accountEntity.isActive;
    return Account.create(createAccountDto);
  }

  static toPersistence(account: Account): AccountEntity {
    console.log('Saving domain: ', account);
    const accountEntity = new AccountEntity();
    accountEntity.id = account.getId().value;
    accountEntity.email = account.getEmail().value;
    accountEntity.firstName = account.getName().firstName;
    accountEntity.lastName = account.getName().lastName;
    accountEntity.password = account.getPassword().value;
    accountEntity.isActive = account.isActive();
    return accountEntity;
  }
}
