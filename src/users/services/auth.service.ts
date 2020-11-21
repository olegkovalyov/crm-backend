import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Member } from '../entities/member.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
  }

  async generateAccessToken(member: Member): Promise<string> {
    const { id, status, email, firstName, lastName, roles, licenseType } = member;
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

  async generateRefreshToken(member: Member): Promise<string> {
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
