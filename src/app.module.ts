import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
  ],
})
export class AppModule {
}
