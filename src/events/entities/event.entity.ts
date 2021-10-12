import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Load} from './load.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    nullable: true,
  })
  notes?: string;

  @OneToMany(() => Load, load => load.event )
  loads: Load[];
}
