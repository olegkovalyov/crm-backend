import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {TestCommand} from './test.command';

interface CommandResultInterface {
  changedFirstName: string;
  changedLastName: string;
}

@CommandHandler(TestCommand)
export class TestHandler implements ICommandHandler<TestCommand, CommandResultInterface> {

  async execute(command: TestCommand) {

    const result: CommandResultInterface = {
      changedFirstName: command.firstName,
      changedLastName: command.lastName,
    };
    return result;
  }
}