import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

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
}
