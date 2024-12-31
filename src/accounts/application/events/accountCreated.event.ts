export class AccountCreatedEvent {
  constructor(
    public readonly userId: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly active: boolean,
  ) {
  }
}
