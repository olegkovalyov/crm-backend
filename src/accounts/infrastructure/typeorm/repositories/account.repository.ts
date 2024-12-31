import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {AccountRepository} from '../../../abstract/repository/account.repository';
import {AccountEntity} from '../entities/account.entity';
import {Account} from '../../../domain/entities/account.entity';
import {AccountMapper} from '../mappers/account.mapper';

@Injectable()
export class AccountRepositoryTypeorm implements AccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {
  }

  async findAll(): Promise<Account[]> {
    const accountEntities = await this.accountRepository.find();
    return accountEntities.map(accountEntity => AccountMapper.toDomain(accountEntity));
  }

  async findById(id: number): Promise<Account | null> {
    const accountEntity = await this.accountRepository.findOneBy({
      id,
    });
    if (accountEntity) {
      return AccountMapper.toDomain(accountEntity);
    }
    return null;
  }

  async save(account: Account): Promise<Account> {
    const accountEntity = AccountMapper.toPersistence(account);
    const persistedAccountEntity = await this.accountRepository.save(accountEntity);
    return AccountMapper.toDomain(persistedAccountEntity);
  }
}
