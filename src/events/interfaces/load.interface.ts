import { Document } from 'mongoose';

export interface ILoad extends Document {
  id: string,
  eventId: string,
  status: string,
  date: Date,
  loadNumber: number,
  aircraft: string,
  notes: string | null,
}


export enum LoadStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PROCESSED = 'PROCESSED',
  REFUSED = 'REFUSED',
}
