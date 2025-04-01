import {Injectable} from '@nestjs/common';
import {DataSource} from 'typeorm';
import {AccountRepository} from '../../../abstract/repository/account.repository';
import {AccountMapper} from '../mappers/account.mapper';
import {AccountEntity} from '../../../../core/infrasctucture/typeorm/entities/account.entity';
import {Account} from '../../../domain/entities/account';
import {LoginEntity} from '../../../../core/infrasctucture/typeorm/entities/login.entity';

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

  async findByEmail(email: string): Promise<Account | null> {
    const accountRepository = this.dataSource.getRepository(AccountEntity);
    const accountEntity = await accountRepository.findOneBy({
      email,
    });
    if (accountEntity) {
      return AccountMapper.toDomain(accountEntity);
    }
    return null;
  }

  async save(account: Account): Promise<Account> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const accountEntity = AccountMapper.toPersistence(account);
      const persistedAccountEntity = await queryRunner.manager.save(accountEntity);
      const loginEntity = new LoginEntity();
      loginEntity.accountId = persistedAccountEntity.id;
      loginEntity.refreshToken = '';
      loginEntity.accessToken = '';
      await queryRunner.manager.save(loginEntity);

      await queryRunner.commitTransaction();
      return AccountMapper.toDomain(persistedAccountEntity);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new Error(e.message);
    } finally {
      await queryRunner.release();
    }
  }
}
