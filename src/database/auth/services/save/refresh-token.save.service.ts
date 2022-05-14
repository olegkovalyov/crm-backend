import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {RefreshTokenEntity} from '../../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenSaveService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {
  }

  async save(refreshToken: RefreshTokenEntity): Promise<string | null> {
    try {
      refreshToken.updatedAt = new Date();
      const updatedRefreshToken = await this.refreshTokenRepository.save(refreshToken);
      return updatedRefreshToken.token ?? null;
    } catch (e) {
      return null;
    }
  }
}
