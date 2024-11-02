import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {UuidModule} from 'nestjs-uuid';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import {CqrsModule} from '@nestjs/cqrs';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    CqrsModule.forRoot(),
    UuidModule,
  ],
  exports: [
    GraphQLModule,
    UuidModule,
    JwtModule,
    ConfigModule,
    CqrsModule,
  ],
  controllers: [],
  providers: [],
})
export class CoreModule {
}
