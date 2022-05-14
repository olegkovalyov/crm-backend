import {Module} from '@nestjs/common';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {MailerModule} from '@nestjs-modules/mailer';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {PugAdapter} from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import {UserModule} from './user/user.module';
import {CqrsModule} from '@nestjs/cqrs';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Event Emitter
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),

    // GraphQl
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      context: ({req, res}) => ({req, res}),
      autoSchemaFile: true,
    }),

    // Mailer
    MailerModule.forRootAsync(
      {
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
      },
    ),

    // CQRS
    CqrsModule,

    // DOMAIN'S
    UserModule,
  ],
  providers: [
    ConfigService,
  ],
})
export class AppModule {
}
