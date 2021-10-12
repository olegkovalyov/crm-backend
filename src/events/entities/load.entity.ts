import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import {LoadStatus} from '../interfaces/load.interface';
import {Event} from './event.entity';
import {Slot} from './slot.entity';

@Entity()
export class Load {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  capacity: number;

  @Column({
    type: 'enum',
    enum: LoadStatus,
  })
  status: LoadStatus;

  @Column({
    nullable: true,
  })
  order?: number;

  @Column({
    nullable: true,
  })
  time: number;

  @Column({
    nullable: true,
  })
  notes?: string;

  @ManyToOne(() => Event, event => event.loads, {
    onDelete: 'CASCADE'
  })
  event: Event;

  @OneToMany(() => Slot, slot => slot.load)
  slots: Slot[];
}
