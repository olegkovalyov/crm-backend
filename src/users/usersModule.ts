import { Module } from '@nestjs/common';
import { UsersResolver } from './resolvers/users.resolver';
import { CoreModule } from '../core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Member } from './entities/member.entity';
import { MembersService } from './services/members.service';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './passport-strategies/jwt.strategy';
import { RandomStringService } from '@akanass/nestjsx-crypto';
import { Client } from './entities/client.entity';
import { ClientsService } from './services/clients.service';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([
      User,
      Member,
      Client,
    ]),
  ],
  exports: [
    TypeOrmModule
  ],
  providers: [
    UsersResolver,
    MembersService,
    ClientsService,
    AuthService,
    JwtStrategy,
    RandomStringService,
  ],
})
export class UsersModule {
}
