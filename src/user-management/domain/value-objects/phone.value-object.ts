import {ValueObject} from '../../../shared/domain/value-objects/value-object.class';
import {Result} from '../../../shared/domain/common/result.class';

export class PhoneNumber extends ValueObject {
  private readonly _phoneNumber: string;

  protected constructor(
    phoneNumber: string,
  ) {
    super();
    this._phoneNumber = phoneNumber;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  public static create(phoneNumber: string): Result<PhoneNumber> {
    const identity = new PhoneNumber(phoneNumber);
    return new Result<PhoneNumber>(true, null, identity);
  }
}