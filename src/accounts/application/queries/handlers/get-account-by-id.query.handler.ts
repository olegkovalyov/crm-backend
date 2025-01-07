import { IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {GetAccountByIdQuery} from '../get-account-by-id.query';
import {AccountRepository} from '../../../abstract/repository/account.repository';
import {Account} from '../../../domain/entities/account';

@QueryHandler(GetAccountByIdQuery)
export class GetAccountByIdQueryHandler implements IQueryHandler<GetAccountByIdQuery> {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) {
  }

  async execute(query: GetAccountByIdQuery): Promise<Account | null> {
    return await this.accountRepository.findById(query.accountId);
  }
}
