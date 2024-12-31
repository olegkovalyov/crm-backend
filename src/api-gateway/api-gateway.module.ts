import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../core/core.module';
import {AuthResolver} from './presentation/auth/resolvers/auth.resolver';
import {AccountCreatedEventHandler} from './application/auth/events/handlers/accountCreated.event.handler';
import {AuthRepository} from './abstract/repository/auth.repository';
import {AuthRepositoryTypeorm} from './infrastructure/typeorm/repositories/auth.repository';
import {AuthEntity} from './infrastructure/typeorm/entities/auth.entity';
import {GetAuthQueryHandler} from './application/auth/queries/handlers/getAuthQueryHandler';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([AuthEntity]),
  ],
  providers: [
    AccountCreatedEventHandler,
    AuthResolver,
    GetAuthQueryHandler,
    {
      provide: AuthRepository,
      useClass: AuthRepositoryTypeorm,
    },
  ],
})
export class ApiGatewayModule {
}
