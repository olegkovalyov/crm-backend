import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {GetAccountByIdQuery} from '../get-account-by-id.query';
import {AccountRepository} from '../../../abstract/repository/account.repository';
import {Account} from '../../../domain/entities/account';
import {Err, Ok, Result} from 'ts-results';
import {BadRequestException} from '@nestjs/common';

@QueryHandler(GetAccountByIdQuery)
export class GetAccountByIdQueryHandler implements IQueryHandler<GetAccountByIdQuery> {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) {
  }

  async execute(query: GetAccountByIdQuery): Promise<Result<Account, Error>> {
    try {
      const account = await this.accountRepository.findById(query.accountId);
      if (!account) {
        return Err(new BadRequestException('Account not found'));
      }
      return Ok(account);
    } catch (e) {
      return Err(new Error(e.message));
    }
  }
}
