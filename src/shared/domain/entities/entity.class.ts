import {Guid} from 'guid-typescript';

export abstract class Entity {
  protected readonly _id: Guid;

  protected constructor(id?: Guid) {
    this._id = id ? id : Guid.create();
  }

  protected isEntity(v: any): v is Entity {
    return v instanceof Entity;
  };

  public equals(object?: Entity): boolean {
    if (
      object === null
      || object == undefined
    ) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!this.isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}