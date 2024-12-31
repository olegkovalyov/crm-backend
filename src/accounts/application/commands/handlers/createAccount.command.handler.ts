import {CommandHandler, EventBus, ICommandHandler} from '@nestjs/cqrs';
import {CreateAccountCommand} from '../createAccount.command';
import {Account} from '../../../domain/entities/account.entity';
import {AccountCreatedEvent} from '../../events/accountCreated.event';
import {AccountRepository} from '../../../abstract/repository/account.repository';

@CommandHandler(CreateAccountCommand)
export class CreateAccountCommandHandler implements ICommandHandler<CreateAccountCommand> {

  constructor(
    private readonly eventBus: EventBus,
    private readonly accountRepository: AccountRepository,
  ) {
  }

  async execute(command: CreateAccountCommand) {
    const account = Account.create(
      null,
      command.email,
      command.firstName,
      command.lastName,
      true,
    );

    // Here goes logic for saving to Db
    const persistedAccount = await this.accountRepository.save(account);
    // Create event that acc was created
    this.eventBus.publish(new AccountCreatedEvent(
      persistedAccount.getId(),
      persistedAccount.getFirstName(),
      persistedAccount.getLastName(),
      persistedAccount.getEmail(),
      persistedAccount.isActive(),
    ));

    // return id of newly created acc
    return persistedAccount.getId();
  }
}
