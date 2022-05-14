import {Entity} from './entity.class';
import {Guid} from 'guid-typescript';
import {DomainEventInterface} from '../events/domain-event.interface';

export abstract class AggregateRoot extends Entity {
  private _domainEvents: DomainEventInterface[] = [];

  get id (): Guid {
    return this._id;
  }

  get domainEvents(): DomainEventInterface[] {
    return this._domainEvents;
  }

  protected addDomainEvent (domainEvent: DomainEventInterface): void {
    // Add the domain event to this aggregate's list of domain events
    this._domainEvents.push(domainEvent);
    // Log the domain event
    this.logDomainEventAdded(domainEvent);
  }

  public clearEvents (): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  private logDomainEventAdded (domainEvent: DomainEventInterface): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);
    console.info(`[Domain Event Created]:`, thisClass.constructor.name, '==>', domainEventClass.constructor.name)
  }
}