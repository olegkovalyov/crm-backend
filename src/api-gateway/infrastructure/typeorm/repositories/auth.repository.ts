import {AuthRepository} from '../../../abstract/repository/auth.repository';
import {Injectable} from '@nestjs/common';
import {DataSource} from 'typeorm';
import {AuthEntity} from '../../../../core/infrasctucture/typeorm/entities/auth.entity';
import {AccountEntity} from '../../../../core/infrasctucture/typeorm/entities/account.entity';
import {Auth} from '../../../domain/entities/auth';

@Injectable()
export class AuthRepositoryTypeorm implements AuthRepository {
  constructor(
    private readonly dataSource: DataSource,
  ) {
  }

  async findAll(): Promise<Auth[]> {
    return [];
    // const authEntities = await this.authRepository.find();
    // return authEntities.map(authEntity => AuthMapper.toDomain(authEntity));
  }

  async findById(id: number): Promise<Auth | null> {
    const authRepository = this.dataSource.getRepository(AuthEntity);
    const authEntity = await authRepository.findOneBy({
      id,
    });
    if (!authEntity) {
      return null;
    }

    const accountRepository = this.dataSource.getRepository(AccountEntity);
    const accountEntity = await accountRepository.findOneBy({
      id: authEntity.accountId,
    });

    if (!accountEntity) {
      return null;
    }

    return Auth.create(
      authEntity.id,
      authEntity.accountId,
      accountEntity.email,
      accountEntity.firstName,
      accountEntity.lastName,
      accountEntity.isActive,
      authEntity.accessToken,
      authEntity.refreshToken,
    );
  }

  async save(auth: Auth): Promise<Auth> {
    const accountRepository = this.dataSource.getRepository(AccountEntity);
    const accountEntity = await accountRepository.findOneBy(
      {
        id: auth.getAccountId(),
      },
    );

    if (!accountEntity) {
      return null;
    }

    const authEntity = new AuthEntity();
    authEntity.id = auth.getId();
    authEntity.accountId = auth.getAccountId();
    authEntity.accessToken = auth.getAccessToken();
    authEntity.refreshToken = auth.getRefreshToken();

    const authRepository = this.dataSource.getRepository(AuthEntity);
    const persistedAuthEntity = await authRepository.save(authEntity);
    return Auth.create(
      persistedAuthEntity.id,
      persistedAuthEntity.accountId,
      accountEntity.email,
      accountEntity.firstName,
      accountEntity.lastName,
      accountEntity.isActive,
      persistedAuthEntity.accessToken,
      persistedAuthEntity.refreshToken,
    );
  }
}
