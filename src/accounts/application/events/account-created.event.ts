export class AccountCreatedEvent {
  constructor(
    public readonly accountId: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly isActive: boolean,
  ) {
  }
}
