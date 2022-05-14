import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {SlotType} from '../interfaces/slot.interface';
import {Load} from './load.entity';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SlotType,
  })
  type: SlotType;

  @Column('text',
    {
      array: true,
    },
  )
  personIds: string[];

  @Column()
  info: string;

  @ManyToOne(
    () => Load,
    load => load.slots,
  )
  load: Load;
}
