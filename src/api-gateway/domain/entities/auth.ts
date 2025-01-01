export class Auth {
  private id: number | null;
  private accountId: number;
  private email: string;
  private firstName: string;
  private lastName: string;
  private isActive: boolean;
  private accessToken: string;
  private refreshToken: string;

  private constructor(
    id: number | null,
    accountId: number,
    email: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
    accessToken: string,
    refreshToken: string,
  ) {
    this.id = id;
    this.accountId = accountId;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isActive = isActive;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    return this;
  }

  public getId(): number | null {
    return this.id;
  }

  public getAccountId(): number {
    return this.accountId;
  }

  public getEmail(): string {
    return this.email;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getAccessToken(): string {
    return this.accessToken;
  }

  public getRefreshToken(): string {
    return this.refreshToken;
  }

  public isAccountActive(): boolean {
    return this.isActive;
  }

  public static create(
    id: number | null,
    accountId: number,
    email: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
    accessToken: string,
    refreshToken: string,
  ): Auth {
    return new Auth(
      id,
      accountId,
      email,
      firstName,
      lastName,
      isActive,
      accessToken,
      refreshToken,
    );
  }
}
