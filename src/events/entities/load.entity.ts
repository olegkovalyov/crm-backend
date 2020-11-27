import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LoadStatus } from '../interfaces/load.interface';
import { Event } from './event.entity';

@Entity()
export class Load {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  @JoinColumn()
  event: Event;

  @Column()
  order: number;

  @Column({
    type: 'enum',
    enum: LoadStatus,
    nullable: true,
  })
  status: LoadStatus;

  @Column()
  date: Date;

  @Column({
    type: 'int',
    array: true,
    nullable: true,
  })
  slotIds: number[];

  @Column({
    nullable: true,
  })
  aircraft: string;

  @Column({
    nullable: true,
  })
  notes: string;
}
