import { Document } from 'mongoose';
import { ILoad } from './load.interface';
import { MemberModel } from '../../users/models/member.model';

export interface EventInterface extends Document {
  id: string,
  name: string,
  date: Date,
  loads: ILoad[] | null;
  staff: MemberModel[];
  notes: string;
}

