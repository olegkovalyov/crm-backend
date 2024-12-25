import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Account} from './infrastructure/typeorm/entities/account.entity';
import {TestEventHandler} from './eventHandlers/test.event.handler';
import {CreateAccountCommandHandler} from './application/commands/handlers/createAccount.command.handler';
import {CoreModule} from '../core/core.module';
import {LoadAccountQuery} from './application/queries/loadAccount.query';
import {LoadAccountQueryHandler} from './application/queries/handlers/loadAccount.query.handler';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([Account]),
  ],
  providers: [
    TestEventHandler,
    CreateAccountCommandHandler,
    LoadAccountQueryHandler,
  ],
})
export class AccountsModule {
}
