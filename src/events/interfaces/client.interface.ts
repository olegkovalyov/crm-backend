import { Document } from 'mongoose';
import { MemberInterface } from '../../members/interfaces/member.interface';

export interface ClientInterface extends Document {
  id: string,
  status: string,
  firstName: string;
  lastName: string;
  gender: string;
  weight: number;
  phone: string;
  withHandCameraVideo: boolean;
  withCameraman: boolean;
  tm: MemberInterface | null;
  cameraman: MemberInterface | null;
  onlyFlight: boolean;
  paid: boolean;
  date: Date | null;
  notes: string | null;
}

export enum PassengerStatus {
  ACTIVE = 'ACTIVE',
  PROCESSED = 'PROCESSED',
  REFUSED = 'REFUSED'
}
