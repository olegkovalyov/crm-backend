import { Module } from '@nestjs/common';
import { UsersResolver } from './resolvers/users.resolver';
import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: 3600 * 24 },
      }),
    }),
    MongooseModule.forFeature(
      [
        { name: 'User', schema: UserSchema },
      ],
    ),
  ],
  exports: [UsersService, MongooseModule],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {
}
