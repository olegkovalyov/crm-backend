import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {AccountRepository} from '../../../abstract/repository/account.repository';
import {Account} from '../../../domain/entities/account';
import {GetAccountByEmailQuery} from '../get-account-by-email.query';
import {Err, Ok, Result} from 'ts-results';
import {BadRequestException} from '@nestjs/common';

@QueryHandler(GetAccountByEmailQuery)
export class GetAccountByEmailQueryHandler implements IQueryHandler<GetAccountByEmailQuery> {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) {
  }

  async execute(query: GetAccountByEmailQuery): Promise<Result<Account, Error>> {
    try {
      const account = await this.accountRepository.findByEmail(query.email);
      if (!account) {
        return Err(new BadRequestException('Account not found'));
      }
      return Ok(account);
    } catch (e) {
      return Err(new Error(e.message));
    }
  }
}
