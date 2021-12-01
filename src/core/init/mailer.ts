import {MailerAsyncOptions} from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {PugAdapter} from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

export function initMailerOptions(): MailerAsyncOptions {
  return {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      transport: {
        host: configService.get<string>('MAIL_HOST'),
        port: configService.get<string>('MAIL_PORT'),
        ignoreTLS: configService.get<string>('MAIL_IGNORE_TLS') === 'true',
        secure: configService.get<string>('MAIL_SECURE') === 'true',
        auth: {
          user: configService.get<string>('MAIL_USERNAME'),
          pass: configService.get<string>('MAIL_PASSWORD'),
        },
      },
      defaults: {
        from: configService.get<string>('MAIL_DEFAUL_FROM'),
      },
      template: {
        dir: process.cwd() + '/email-templates/',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  };
}