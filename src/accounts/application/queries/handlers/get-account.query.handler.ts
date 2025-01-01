import {EventBus, IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {GetAccountQuery} from '../get-account.query';
import {Account} from '../../../domain/entities/account';

@QueryHandler(GetAccountQuery)
export class GetAccountQueryHandler implements IQueryHandler<GetAccountQuery> {
  constructor(
    private readonly eventBus: EventBus,
  ) {
  }

  async execute(query: GetAccountQuery) {
    // Here will go logic from retrieving account from DB

    // return loaded acc
    return Account.create(
      query.id,
      'okovalyov@test.com',
      'Oleh',
      'Kovalov',
      true,
    );
  }
}
