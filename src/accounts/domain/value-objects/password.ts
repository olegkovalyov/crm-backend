import {ValueObject} from '../../../core/domain/value-object.base';

export class Password extends ValueObject {
  constructor(
    public readonly value: string,
  ) {
    super();
  }
}
