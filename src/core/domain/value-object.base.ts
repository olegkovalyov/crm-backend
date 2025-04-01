import {shallowEqual} from 'shallow-equal-object';

export abstract class ValueObject {

  public equals(valueObject?: ValueObject): boolean {
    if (
      valueObject === null
      || valueObject === undefined
    ) {
      return false;
    }
    return shallowEqual(this, valueObject);
  }
}
