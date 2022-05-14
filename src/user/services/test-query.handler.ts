import {CommandHandler, IQueryHandler} from '@nestjs/cqrs';
import {TestCommand} from './test.command';

@CommandHandler(TestCommand)
export class TestHandler implements IQueryHandler<TestCommand> {

  async execute(command: TestCommand) {
    console.log(command);
  }
}