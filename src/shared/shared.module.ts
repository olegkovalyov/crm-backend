import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {initJwtOptions} from './infrastructure/auth/config/jwt.config';
import {AuthService} from './infrastructure/auth/services/auth.service';
import {JwtStrategy} from '../user/passport-strategies/jwt.strategy';
import {CryptoModule} from '@akanass/nestjsx-crypto';
import {GraphQLModule} from '@nestjs/graphql';
import {MailerModule} from '@nestjs-modules/mailer';
import {initMailerOptions} from '../common/config/mailer.config';

@Module({
  imports: [
    CryptoModule,
    JwtModule.registerAsync(initJwtOptions()),
    PassportModule,
    MailerModule.forRootAsync(initMailerOptions()),
  ],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [
    GraphQLModule,
    CryptoModule,
    MailerModule,
  ]
})
export class SharedModule {
}
