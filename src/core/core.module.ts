import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config';
import {MailerModule} from '@nestjs-modules/mailer';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {CryptoModule} from '@akanass/nestjsx-crypto';
import {TypeOrmModule} from '@nestjs/typeorm';
import {initGraphQlOptions} from './init/graphQl';
import {initMongooseOptions} from './init/mongoose';
import {initMailerOptions} from './init/mailer';
import {initJwtOptions} from './init/jwt';
import {initConfigOptions} from './init/config';
import {initTypeOrmOptions} from './init/typeOrm';

@Module({
  imports: [
    GraphQLModule.forRoot(initGraphQlOptions()),
    MongooseModule.forRootAsync(initMongooseOptions()),
    MailerModule.forRootAsync(initMailerOptions()),
    JwtModule.registerAsync(initJwtOptions()),
    PassportModule,
    CryptoModule,
    ConfigModule.forRoot(initConfigOptions()),
    TypeOrmModule.forRootAsync(initTypeOrmOptions()),
  ],
  exports: [
    JwtModule,
    MongooseModule,
    MailerModule,
    PassportModule,
    CryptoModule,
    ConfigModule,
    TypeOrmModule,
  ],
})
export class CoreModule {
}
