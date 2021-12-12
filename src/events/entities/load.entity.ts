import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @Column()
  order: number;

  @Column({
    nullable: true,
  })
  takeOffTime?: Date;

  @Column({
    nullable: true,
  })
  landingTime?: Date;

  @Column()
  info: string;

  @ManyToOne(
    () => Event,
    event => event.loads,
    {
      onDelete: 'CASCADE',
    },
  )
  event: Event;

  @OneToMany(
    () => Slot,
    slot => slot.load,
  )
  slots: Slot[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
