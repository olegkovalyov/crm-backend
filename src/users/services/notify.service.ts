import {Injectable, Scope} from '@nestjs/common';
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

  async notifyFirstStepOfPasswordReset(
    email: string,
    firstName: string,
    lastName: string,
    token: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>('MAIL_DEFAULT_FROM'),
        subject: 'Reset password',
        template: process.cwd() + '/email-templates/forgot-password',
        context: {
          link: this.configService.get('FRONTEND_HOST') + '/reset-password/' + token,
          username: `${firstName} ${lastName}`,
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async notifySuccessOfPasswordReset(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
          to: email,
          from: this.configService.get<string>('MAIL_DEFAULT_FROM'),
          subject: 'Your password successfully changes',
          template: process.cwd() + '/email-templates/reset-password',
          context: {
            username: `${firstName} ${lastName}`,
          },
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
