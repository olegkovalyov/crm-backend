import { Document } from 'mongoose';
import { ILoad } from './load.interface';
import { MemberInterface } from '../../members/interfaces/member.interface';

export interface EventInterface extends Document {
  id: string,
  name: string,
  date: Date,
  loads: ILoad[] | null;
  staff: MemberInterface[];
  notes: string;
}

