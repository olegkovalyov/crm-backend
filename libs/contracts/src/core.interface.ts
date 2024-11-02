export abstract class CommandBus {
  abstract execute(command: Command): void
}

export abstract class Command {
}
