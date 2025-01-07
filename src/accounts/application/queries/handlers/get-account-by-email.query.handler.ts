import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {AccountRepository} from '../../../abstract/repository/account.repository';
import {Account} from '../../../domain/entities/account';
import {GetAccountByEmailQuery} from '../get-account-by-email.query';

@QueryHandler(GetAccountByEmailQuery)
export class GetAccountByEmailQueryHandler implements IQueryHandler<GetAccountByEmailQuery> {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) {
  }

  async execute(query: GetAccountByEmailQuery): Promise<Account | null> {
    return await this.accountRepository.findByEmail(query.email);
  }
}
