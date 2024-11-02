import {Module} from '@nestjs/common';
import {AccountsService} from './services/accounts.service';
import {AccountsResolver} from './resolvers/accounts.resolver';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Account} from './entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [
    AccountsResolver,
    AccountsService,
  ],
})
export class AccountsModule {
}
