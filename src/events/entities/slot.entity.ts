import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import {SlotType} from '../interfaces/slot.interface';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  loadId: number;

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
  notes: string;
}
