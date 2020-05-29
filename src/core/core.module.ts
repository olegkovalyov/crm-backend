import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    GraphQLModule.forRoot({
      context: ({ req }) => ({ req }),
      autoSchemaFile: true,
    }),
    MongooseModule.forRootAsync({
      imports: [
        ConfigModule,
      ],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_LINK'),
        autoIndex: true,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
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
          dir: __dirname + '/../../email-templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    AuthModule,
  ],
  exports: [AuthModule],
})
export class CoreModule {
}
