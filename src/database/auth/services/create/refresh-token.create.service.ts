import {Injectable} from '@nestjs/common';
import {DeepPartial, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {RefreshTokenEntity} from '../../entities/refresh-token.entity';

// import {User} from '../entities/auth.entity';

@Injectable()
export class RefreshTokenCreateService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {
  }

  createRefreshToken(): RefreshTokenEntity {
    return this.refreshTokenRepository.create();
  }
}
