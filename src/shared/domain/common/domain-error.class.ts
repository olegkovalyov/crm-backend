export abstract class DomainError {
  private readonly _message: string;
  private _error?: any;

  protected constructor(message: string) {
    this._message = message;
  }

  get message(): string {
    return this._message;
  }
}