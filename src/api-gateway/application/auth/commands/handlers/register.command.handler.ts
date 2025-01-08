import {CommandBus, CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {RegisterCommand} from '../register.command';
import {CreateAccountCommand} from '../../../../../accounts/application/commands/create-account.command';
import {Err, Ok, Result} from 'ts-results';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly commandBus: CommandBus,
  ) {
  }

  async execute(command: RegisterCommand): Promise<Result<number, Error>> {

    const result: Result<number, Error> = await this.commandBus.execute(new CreateAccountCommand(
      command.email,
      command.firstName,
      command.lastName,
      command.password,
    ));

    if (result.err) {
      return Err(result.val);
    }

    if (result.ok) {
      return Ok(result.val);
    }
  }
}
