import {EventBus, IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {AuthRepository} from '../../../../abstract/repository/auth.repository';
import {GetAuthQuery} from '../get-auth.query';
import {Auth} from '../../../../domain/entities/auth';

@QueryHandler(GetAuthQuery)
export class GetAuthQueryHandler implements IQueryHandler<GetAuthQuery> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly authRepository: AuthRepository,
  ) {
  }

  async execute(query: GetAuthQuery): Promise<Auth | null> {
    return await this.authRepository.findById(query.authId);
  }
}
