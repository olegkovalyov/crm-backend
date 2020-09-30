import { Injectable } from '@nestjs/common';
import { IUser } from '../users/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { IDecodedRefreshToken, ITokens } from './interfaces/auth.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService,
              private readonly userService: UsersService,
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

  async clearRefreshToken(refreshToken: string): Promise<void> {
    try {
      const decodedData = await this.jwtService.decode(refreshToken, this.configService.get('SECRET'));
      if (decodedData) {
        const user = await this.userService.getUserByEmail((decodedData as IDecodedRefreshToken).email);
        if (user) {
          user.refreshToken = null;
          user.refreshTokenExpirationDate = null;
          await user.save();
        }
      }
    } catch (e) {
      console.log('Error removing refresh token');
    }
  }
}
