import {ValueObject} from '../../../core/domain/value-object.base';

export class Id extends ValueObject {

  public readonly value: number | null;

  constructor(
    id: number | null | undefined,
  ) {
    super();
    this.value = id ? id : null;
  }
}
