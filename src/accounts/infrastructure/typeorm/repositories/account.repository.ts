import {Injectable} from '@nestjs/common';
import {DataSource} from 'typeorm';
import {AccountRepository} from '../../../abstract/repository/account.repository';
import {AccountMapper} from '../mappers/account.mapper';
import {AccountEntity} from '../../../../core/infrasctucture/typeorm/entities/account.entity';
import {Account} from '../../../domain/entities/account';

@Injectable()
export class AccountRepositoryTypeorm implements AccountRepository {
  constructor(
    private readonly dataSource: DataSource,
  ) {
  }

  async findAll(): Promise<Account[]> {
    const accountRepository = this.dataSource.getRepository(AccountEntity);
    const accountEntities = await accountRepository.find();
    return accountEntities.map(accountEntity => AccountMapper.toDomain(accountEntity));
  }

  async findById(id: number): Promise<Account | null> {
    const accountRepository = this.dataSource.getRepository(AccountEntity);
    const accountEntity = await accountRepository.findOneBy({
      id,
    });
    if (accountEntity) {
      return AccountMapper.toDomain(accountEntity);
    }
    return null;
  }

  async save(account: Account): Promise<Account> {
    const accountEntity = AccountMapper.toPersistence(account);
    const accountRepository = this.dataSource.getRepository(AccountEntity);
    const persistedAccountEntity = await accountRepository.save(accountEntity);
    return AccountMapper.toDomain(persistedAccountEntity);
  }
}
