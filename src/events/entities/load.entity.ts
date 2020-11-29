import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { LoadStatus } from '../interfaces/load.interface';
import { Event } from './event.entity';
import { Slot } from './slot.entity';

@Entity()
export class Load {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, { onDelete: 'CASCADE', eager: true })
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

  // @Column({
  //   type: 'int',
  //   array: true,
  //   nullable: true,
  // })
  // slotIds: number[];

  @OneToMany(
    () => Slot,
    slot => slot.load,
    { onDelete: 'CASCADE', eager: true },
  )
  @JoinColumn()
  slots: Slot[];

  @Column({
    nullable: true,
  })
  aircraft: string;

  @Column({
    nullable: true,
  })
  notes: string;
}
