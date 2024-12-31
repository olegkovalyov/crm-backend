import {EventBus, IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {GetAuthQuery} from '../getAuthQuery';
import {AuthRepository} from '../../../../abstract/repository/auth.repository';
import {Auth} from '../../../../domain/entities/auth.entity';

@QueryHandler(GetAuthQuery)
export class GetAuthQueryHandler implements IQueryHandler<GetAuthQuery> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly authRepository: AuthRepository,
  ) {
  }

  async execute(query: GetAuthQuery): Promise<Auth | null> {
    return await this.authRepository.findByAccountId(query.accountId);
  }
}
