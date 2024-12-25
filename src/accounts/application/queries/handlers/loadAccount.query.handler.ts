import {EventBus, IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {Account} from '../../../domain/entities/account.entity';
import {LoadAccountQuery} from '../loadAccount.query';

@QueryHandler(LoadAccountQuery)
export class LoadAccountQueryHandler implements IQueryHandler<LoadAccountQuery> {
  constructor(
    private readonly eventBus: EventBus,
  ) {
  }

  async execute(query: LoadAccountQuery) {
    // Here will go logic from retrieving account from DB

    // return loaded acc
    return Account.create(
      query.id,
      'okovalyov@test.com',
      'Oleh',
      'Kovalov',
    );
  }
}
