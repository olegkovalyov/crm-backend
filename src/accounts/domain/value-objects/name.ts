import {ValueObject} from '../../../core/domain/value-object.base';

export class Name extends ValueObject {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
  ) {
    super();
  }
}
