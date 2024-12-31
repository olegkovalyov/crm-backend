import {AuthRepository} from '../../../abstract/repository/auth.repository';
import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {AuthEntity} from '../entities/auth.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Auth} from '../../../domain/entities/auth.entity';
import {AuthMapper} from '../mappers/auth.mapper';

@Injectable()
export class AuthRepositoryTypeorm implements AuthRepository {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {
  }

  async findAll(): Promise<Auth[]> {
    const authEntities = await this.authRepository.find();
    return authEntities.map(authEntity => AuthMapper.toDomain(authEntity));
  }

  async findByAccountId(id: number): Promise<Auth | null> {
    const authEntity = await this.authRepository.findOneBy({
      accountId: id,
    });
    if (authEntity) {
      return AuthMapper.toDomain(authEntity);
    }
    return null;
  }

  async save(auth: Auth): Promise<Auth> {
    const authEntity = AuthMapper.toPersistence(auth);
    const persistedAuthEntity = await this.authRepository.save(authEntity);
    return AuthMapper.toDomain(persistedAuthEntity);
  }
}
