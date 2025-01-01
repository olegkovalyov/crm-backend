import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../core/core.module';
import {AccountRepository} from './abstract/repository/account.repository';
import {AccountRepositoryTypeorm} from './infrastructure/typeorm/repositories/account.repository';
import {GetAccountQueryHandler} from './application/queries/handlers/get-account.query.handler';
import {CreateAccountCommandHandler} from './application/commands/handlers/create-account.command.handler';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature(),
  ],
  providers: [
    CreateAccountCommandHandler,
    GetAccountQueryHandler,
    {
      provide: AccountRepository,
      useClass: AccountRepositoryTypeorm,
    },
  ],
})
export class AccountsModule {
}
