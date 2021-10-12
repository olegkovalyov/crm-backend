import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import {LicenseType, UserRole, UserStatus} from '../interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
  }

  async generateAccessToken(member: User): Promise<string> {
    const { id, email} = member;

    const status = UserStatus.ACTIVE;
    const firstName = 'Oleh';
    const lastName = 'Kovalov';
    const roles = [UserRole.SKYDIVER];
    const licenseType = [LicenseType.D];
    return this.jwtService.signAsync({
        id,
        status,
        email,
        firstName,
        lastName,
        roles,
        licenseType,
      },
      {
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION_TIME'),
      });
  }

  async generateRefreshToken(member: User): Promise<string> {
    const { email } = member;
    return this.jwtService.signAsync(
      {
        email,
      },
      {
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION_TIME'),
      });
  }
}
