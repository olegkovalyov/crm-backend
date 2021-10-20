import {Injectable, Scope} from '@nestjs/common';
import {UserModel} from '../models/user.model';
import {User} from '../entities/user.entity';
import {UserInfo} from '../entities/user-info.entity';
import {MailerService} from '@nestjs-modules/mailer';
import {ConfigService} from '@nestjs/config';

@Injectable({scope: Scope.REQUEST})
export class NotifyService {

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async notifyUserRegistration(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>('MAIL_DEFAULT_FROM'),
        subject: 'Welcome to Skydive CRM',
        template: process.cwd() + '/email-templates/welcome',
        context: {
          username: `${firstName} ${lastName}`,
          login: `${email}`,
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
