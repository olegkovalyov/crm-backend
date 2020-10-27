import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport-strategies/jwt.strategy';
import { AuthResolver } from './resolvers/auth.resolver';
import { MembersModule } from '../members/membersModule';
import { CryptoModule, RandomStringService } from '@akanass/nestjsx-crypto';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MembersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: 3600 * 24 },
      }),
    }),
    CryptoModule,
  ],
  providers: [AuthService, JwtStrategy, AuthResolver, RandomStringService],
  exports: [AuthService],
})
export class AuthModule {
}
