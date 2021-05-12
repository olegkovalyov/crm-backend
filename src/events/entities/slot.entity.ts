import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {SlotType} from '../interfaces/slot.interface';
import {Load} from './load.entity';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Load)
  load: Load;

  @Column({
    type: 'enum',
    enum: SlotType,
  })
  type: SlotType;

  @Column('int', {array: true})
  userIds: number[];

  @Column({
    nullable: true,
  })
  notes?: string;
}
