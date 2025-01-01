export class CreateAuthCommand {
  constructor(
    public readonly accountId: number,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly isActive: boolean,
  ) {
  }
}
