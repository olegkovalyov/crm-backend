import {ValueObject} from '../../../shared/domain/value-objects/value-object.class';
import {Result} from '../../../shared/domain/common/result.class';
import {Email} from './email.value-object';
import {PhoneNumber} from './phone.value-object';
import {DomainError} from '../../../shared/domain/common/domain-error.class';

export class IdentityInfo extends ValueObject {
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _email: Email;
  private readonly _phoneNumbers: PhoneNumber[];

  protected constructor(
    firstName: string,
    lastName: string,
    email: Email,
    phoneNumbers: PhoneNumber[],
  ) {
    super();
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._phoneNumbers = phoneNumbers;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email.email;
  }

  get phoneNumbers(): string[] {
    return this._phoneNumbers.map(phoneNumber => phoneNumber.phoneNumber);
  }

  public static create(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumbers: string[],
  ): Result<IdentityInfo> {
    const emailResult = Email.create(email);
    const phoneNumbersResult = phoneNumbers.map((phoneNumber) => {
      return PhoneNumber.create(phoneNumber);
    });

    if (emailResult.isFailure) {
      return new Result<IdentityInfo>(false, emailResult.error);
    }

    let hasPhoneNumberError = false;
    let phoneError: DomainError;
    phoneNumbersResult.forEach((result) => {
      if (result.isFailure) {
        hasPhoneNumberError = true;
        phoneError = result.error;
      }
    });

    if (hasPhoneNumberError) {
      return new Result<IdentityInfo>(false, phoneError);
    }

    const identityInfo = new IdentityInfo(
      firstName,
      lastName,
      emailResult.getValue(),
      phoneNumbersResult.map(result => result.getValue()),
    );
    return new Result<IdentityInfo>(true, null, identityInfo);
  }
}