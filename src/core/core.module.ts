import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {UuidModule} from 'nestjs-uuid';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {CqrsModule} from '@nestjs/cqrs';
import {AuthEntity} from './infrasctucture/typeorm/entities/auth.entity';
import {UserInfoEntity} from './infrasctucture/typeorm/entities/user-info.entity';
import {AccountEntity} from './infrasctucture/typeorm/entities/account.entity';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      formatError: (error, originalError) => {
        console.warn(error);
        return {
          message: error.message,
          extensions: {
            code: error.extensions.code,
          },
        };
      },
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: String(configService.get('DB_DATABASE_AUTH')),
        autoLoadEntities: true,
        synchronize: true,
        entities: [
          AuthEntity,
          UserInfoEntity,
          AccountEntity,
        ],
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET').toString(),
        verifyOptions: {
          issuer: configService.get('JWT_TOKEN_ISSUER').toString(),
          audience: configService.get('JWT_TOKEN_AUDIENCE').toString(),
          maxAge: parseInt(configService.get('JWT_ACCESS_TOKEN_TTL')),
        },
      }),
      inject: [ConfigService],
    }),
    CqrsModule.forRoot(),
    UuidModule,
  ],
  exports: [
    GraphQLModule,
    UuidModule,
    JwtModule,
    ConfigModule,
    CqrsModule,
    TypeOrmModule,
  ],
  controllers: [],
  providers: [],
})
export class CoreModule {
}
