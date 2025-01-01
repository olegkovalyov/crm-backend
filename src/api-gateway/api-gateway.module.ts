import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../core/core.module';
import {AuthResolver} from './presentation/auth/resolvers/auth.resolver';
import {UserRegisteredEventHandler} from './application/auth/events/handlers/user-registered.event.handler';
import {AuthRepository} from './abstract/repository/auth.repository';
import {AuthRepositoryTypeorm} from './infrastructure/typeorm/repositories/auth.repository';
import {CreateAuthCommandHandler} from './application/auth/commands/handlers/create-auth.command.handler';
import {GetAuthQueryHandler} from './application/auth/queries/handlers/get-auth.query.handler';

@Module({
  imports: [
    CoreModule,
  ],
  providers: [
    UserRegisteredEventHandler,
    AuthResolver,
    CreateAuthCommandHandler,
    GetAuthQueryHandler,
    {
      provide: AuthRepository,
      useClass: AuthRepositoryTypeorm,
    },
  ],
})
export class ApiGatewayModule {
}
