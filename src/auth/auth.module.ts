import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport-strategies/jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { CryptoModule, RandomStringService } from '@akanass/nestjsx-crypto';

@Module({
  imports: [
    CryptoModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: 3600 * 24 },
    }),
  ],
  providers: [AuthService, JwtStrategy, AuthResolver, RandomStringService],
  exports: [AuthService],
})
export class AuthModule {
}
