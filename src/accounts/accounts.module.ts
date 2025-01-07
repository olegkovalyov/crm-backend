import {Module} from '@nestjs/common';
import {CoreModule} from '../core/core.module';
import {AccountRepository} from './abstract/repository/account.repository';
import {AccountRepositoryTypeorm} from './infrastructure/typeorm/repositories/account.repository';
import {CreateAccountCommandHandler} from './application/commands/handlers/create-account.command.handler';
import {GetAccountByIdQueryHandler} from './application/queries/handlers/get-account-by-id.query.handler';
import {GetAccountByEmailQueryHandler} from './application/queries/handlers/get-account-by-email.query.handler';

@Module({
  imports: [
    CoreModule,
  ],
  providers: [
    CreateAccountCommandHandler,
    GetAccountByIdQueryHandler,
    GetAccountByEmailQueryHandler,
    {
      provide: AccountRepository,
      useClass: AccountRepositoryTypeorm,
    },
  ],
})
export class AccountsModule {
}
