import {CommandBus, CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {RegisterCommand} from '../register.command';
import {CreateAccountCommand} from '../../../../../accounts/application/commands/create-account.command';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly commandBus: CommandBus,
  ) {
  }

  async execute(command: RegisterCommand) {
    const accountId: number = await this.commandBus.execute(new CreateAccountCommand(
      command.email,
      command.firstName,
      command.lastName,
      command.password,
    ));
    return accountId;
  }
}
