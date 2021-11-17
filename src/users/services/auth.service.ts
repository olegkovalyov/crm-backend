import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {MailerService} from '@nestjs-modules/mailer';
import {ConfigService} from '@nestjs/config';
import {User} from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
  }

  async generateAccessToken(user: User): Promise<string> {
    const {id, email} = user;

    const status = user.status;
    const firstName = user.userInfo.firstName;
    const lastName = user.userInfo.lastName;
    const role = user.userInfo.role;
    const licenseType = user.userInfo.licenseType;
    return this.jwtService.signAsync({
        id,
        status,
        email,
        firstName,
        lastName,
        role,
        licenseType,
      },
      {
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION_TIME'),
      });
  }

  async generateRefreshToken(member: User): Promise<string> {
    const {email} = member;
    return this.jwtService.signAsync(
      {
        email,
      },
      {
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION_TIME'),
      });
  }
}
