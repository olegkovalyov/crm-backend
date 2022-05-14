import {Guid} from 'guid-typescript';

export interface DomainEventInterface {
  dateTimeOccurred: Date;

  getAggregateId(): Guid;
}