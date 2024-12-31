export class CreateAccountCommand {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly password: string,
  ) {
  }
}
