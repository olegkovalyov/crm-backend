import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {UserEntity} from '../../../../database/user/entities/user.entity';
import {RefreshTokenCreateService} from '../../../../database/auth/services/create/refresh-token.create.service';
import {RefreshTokenSaveService} from '../../../../database/auth/services/save/refresh-token.save.service';
import {AccessTokenPayloadInterface} from '../../../../core/interfaces/access-token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _refreshTokenCreateService: RefreshTokenCreateService,
    private readonly _refreshTokenSaveService: RefreshTokenSaveService,
  ) {
  }

  async generateAccessToken(payload: AccessTokenPayloadInterface): Promise<string> {
    return await this._jwtService.signAsync(
      payload,
      {
        expiresIn: this._configService.get<string>('ACCESS_TOKEN_EXPIRATION_TIME'),
      },
    );
  }

  async generateRefreshTokenForUser(user: UserEntity): Promise<string | null> {
    const payload = {id: user.id};
    const token = await this._jwtService.signAsync(
      payload,
      {
        // expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION_TIME'),
        expiresIn: 30,
      });
    const refreshToken = this._refreshTokenCreateService.createRefreshToken();
    refreshToken.user = user;
    refreshToken.token = token;
    return await this._refreshTokenSaveService.save(refreshToken);
  }
}
