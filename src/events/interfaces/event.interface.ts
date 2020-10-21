import { Document } from 'mongoose';
import { ILoad } from './load.interface';
import { IUser } from '../../users/interfaces/user.interface';

export interface IEvent extends Document {
  id: string,
  name: string,
  date: Date,
  loads: ILoad[] | null;
  staff: IUser[];
  notes: string;
}

