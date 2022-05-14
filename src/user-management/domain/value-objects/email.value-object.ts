import {ValueObject} from '../../../shared/domain/value-objects/value-object.class';
import {Result} from '../../../shared/domain/common/result.class';
import {EmailInvalidError} from '../errors/email-invalid.error';

export class Email extends ValueObject {
  private readonly _email: string;

  protected constructor(
    email: string,
  ) {
    super();
    this._email = email;
  }

  get email(): string {
    return this._email;
  }

  public static create(email: string): Result<Email> {
    if (!Email.isValidateEmail(email)) {
      return new Result<Email>(
        false,
        new EmailInvalidError(email),
      );
    }

    return new Result<Email>(
      true,
      null,
      new Email(email),
    );
  }

  private static isValidateEmail(email: string): boolean {
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regexp.test(email);
  }
}