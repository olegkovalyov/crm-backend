import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {LoadStatus} from '../interfaces/load.interface';
import {Event} from './event.entity';

@Entity()
export class Load {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event)
  event: Event;

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
}
