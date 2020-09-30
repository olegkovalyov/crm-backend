import { Document } from 'mongoose';
import { UserModel } from '../../users/models/user.model';
import { IUser } from '../../users/interfaces/user.interface';

export interface IPassenger extends Document {
  id: string,
  status: string,
  firstName: string;
  lastName: string;
  gender: string;
  weight: number;
  phone: string;
  handCamera: boolean;
  operator: IUser | null;
  instructor: IUser | null;
  numberOfLoad: number | null;
  jumpDate: string | null;
  notes: string | null;
}

export interface IPassengerNestedObjectIds {
  instructor: IUser | null,
  operator: IUser | null,
}

export enum PassengerStatus {
  ACTIVE = 'ACTIVE',
  PROCESSED = 'PROCESSED',
  REFUSED = 'REFUSED'
}
