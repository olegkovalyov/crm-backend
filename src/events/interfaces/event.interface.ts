import { Document } from 'mongoose';
import { ILoad } from './load.interface';

export interface IEvent extends Document {
  id: string,
  name: string,
  date: Date,
  loads: [ILoad] | null;
  notes: string;
}

