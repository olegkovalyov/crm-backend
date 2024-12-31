import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AccountEntity} from './infrastructure/typeorm/entities/account.entity';
import {CreateAccountCommandHandler} from './application/commands/handlers/createAccount.command.handler';
import {CoreModule} from '../core/core.module';
import {GetAccountQueryHandler} from './application/queries/handlers/getAccountQueryHandler';
import {AccountRepository} from './abstract/repository/account.repository';
import {AccountRepositoryTypeorm} from './infrastructure/typeorm/repositories/account.repository';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([AccountEntity]),
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
