import { Document } from 'mongoose';
import { IUser } from '../../users/interfaces/user.interface';

export interface IPassenger extends Document {
  id: string,
  status: string,
  firstName: string;
  lastName: string;
  gender: string;
  weight: number;
  phone: string;
  withHandCameraVideo: boolean;
  withCameraman: boolean;
  tm: IUser | null;
  cameraman: IUser | null;
  date: Date | null;
  notes: string | null;
}

export enum PassengerStatus {
  ACTIVE = 'ACTIVE',
  PROCESSED = 'PROCESSED',
  REFUSED = 'REFUSED'
}
