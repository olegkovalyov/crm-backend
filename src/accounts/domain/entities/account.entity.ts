export class Account {
  private constructor(
    id: number | null,
    email: string,
    firstName: string,
    lastName: string,
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    return this;
  }

  private id: number | null;

  private email: string;

  private firstName: string;

  private lastName: string;

  private createdAt: Date;

  private modifiedAt: Date;

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getEmail(): string {
    return this.email;
  }

  public static create(
    id: number | null,
    email: string,
    firstName: string,
    lastName: string,
  ): Account {
    return new Account(
      id,
      email,
      firstName,
      lastName,
    );
  }
}
