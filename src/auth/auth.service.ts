import { Injectable } from '@nestjs/common';
import { IUser } from '../users/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ITokens } from './interfaces/auth.interface';

@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService,
              private readonly mailerService: MailerService,
              private readonly configService: ConfigService,
  ) {

  }

  async generateAccessToken(user: IUser): Promise<string> {
    const { email, firstName, lastName, role, licenseType } = user;
    return this.jwtService.signAsync({
      email,
      firstName,
      lastName,
      role,
      licenseType,
    }, { expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION_TIME') });
  }

  async generateRefreshToken(user: IUser): Promise<string> {
    const { email } = user;
    return this.jwtService.signAsync({
      email,
    }, { expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION_TIME') });
  }

  async createOrUpdateTokens(user: IUser): Promise<ITokens> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    const refreshTokenExpTimestamp = Date.now() + 60 * 1000 * 60;
    user.refreshToken = refreshToken;
    user.refreshTokenExpirationDate = new Date(refreshTokenExpTimestamp);
    await user.save();
    return {
      accessToken,
      refreshToken,
    };
  }
}
