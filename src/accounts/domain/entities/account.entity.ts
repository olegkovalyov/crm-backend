export class Account {
  private id: number | null;
  private email: string;
  private firstName: string;
  private lastName: string;
  private active: boolean;
  private createdAt: Date;
  private modifiedAt: Date;

  private constructor(
    id: number | null,
    email: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.active = isActive;
    return this;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getEmail(): string {
    return this.email;
  }

  public isActive(): boolean {
    return this.active;
  }

  public getId(): number {
    return this.id;
  }

  public static create(
    id: number | null,
    email: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
  ): Account {
    return new Account(
      id,
      email,
      firstName,
      lastName,
      isActive,
    );
  }
}
