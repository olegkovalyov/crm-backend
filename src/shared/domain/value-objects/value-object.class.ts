export abstract class ValueObject {
  public equals(valueObject?: ValueObject): boolean {
    if (
      valueObject === null
      || valueObject === undefined
    ) {
      return false;
    }
    return JSON.stringify(this) === JSON.stringify(valueObject);
  }
}