import { Document } from 'mongoose';

export interface IPassenger extends Document {
  id: string,
  status: string,
  firstName: string;
  lastName: string;
  gender: string;
  weight: number;
  phone: string;
  handCamera: boolean;
  cameraman: boolean;
  date: Date | null;
  notes: string | null;
}

export enum PassengerStatus {
  ACTIVE = 'ACTIVE',
  PROCESSED = 'PROCESSED',
  REFUSED = 'REFUSED'
}
