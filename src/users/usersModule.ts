import {Module} from '@nestjs/common';
import {UsersResolver} from './resolvers/users.resolver';
import {CoreModule} from '../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {UserInfo} from './entities/user-info.entity';
import {AuthService} from './services/auth.service';
import {JwtStrategy} from './passport-strategies/jwt.strategy';
import {RandomStringService} from '@akanass/nestjsx-crypto';
import {Client} from './entities/client.entity';
import {ClientService} from './services/client.service';
import {UserService} from './services/user.service';
import {UserValidatorService} from './services/user-validator.service';
import {GraphqlService} from './services/graphql.service';
import {NotifyService} from './services/notify.service';
import {AuthResolver} from './resolvers/auth.resolver';
import {ClientsResolver} from './resolvers/clients.resolver';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([
      User,
      UserInfo,
      Client,
    ]),
  ],
  exports: [
    TypeOrmModule,
  ],
  providers: [
    AuthService,
    GraphqlService,
    JwtStrategy,
    NotifyService,
    RandomStringService,
    ClientService,
    UserService,
    UserService,
    UserValidatorService,
    UsersResolver,
    AuthResolver,
    ClientsResolver,
  ],
})
export class UsersModule {
}
