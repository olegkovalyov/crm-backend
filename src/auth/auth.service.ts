import { Injectable } from '@nestjs/common';
import { UserInterface } from '../users/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService,
              private readonly mailerService: MailerService) {

  }

  async sendForgotPasswordEmailWithToken(user: UserInterface, token: string): Promise<boolean> {
    try {
      await this
        .mailerService
        .sendMail({
          to: user.email,
          from: 'noreply@nestjs.com',
          subject: 'Reset password',
          template: 'forgot-password', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
          context: {  // Data to be sent to template engine.
            link: 'http://localhost:3000/reset-password/' + token,
            username: `${user.firstName} ${user.lastName}`,
          },
        });
      return true;
    } catch (e) {
      return false;
    }
  }

  async generateToken(user: UserInterface): Promise<string> {
    const { email, firstName, lastName, role, licenseType } = user;
    return this.jwtService.sign({
      email,
      firstName,
      lastName,
      role,
      licenseType,
    });
  }
}
