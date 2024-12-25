import {CommandHandler, EventBus, ICommandHandler} from '@nestjs/cqrs';
import {CreateAccountCommand} from '../createAccount.command';
import {Account} from '../../../domain/entities/account.entity';

@CommandHandler(CreateAccountCommand)
export class CreateAccountCommandHandler implements ICommandHandler<CreateAccountCommand> {

  private accounts: Array<Account> = [];

  constructor(
    private readonly eventBus: EventBus,
  ) {
  }

  async execute(command: CreateAccountCommand) {
    const id = Math.round(Math.random() * 1000);
    const account = Account.create(
      id,
      command.email,
      command.firstName,
      command.lastName,
    );

    // Here goes logic for saving to Db
    this.accounts.push(account);

    // return id of newly created acc
    return id;
  }
}
