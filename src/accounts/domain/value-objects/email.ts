import {ValueObject} from '../../../core/domain/value-object.base';

export class Email extends ValueObject {
  constructor(
    public readonly value: string,
  ) {
    super();
  }
}
