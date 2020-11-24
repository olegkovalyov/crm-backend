import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'int',
    array: true,
  })
  staffIds: number[];

  @Column()
  notes: string;

  @Column()
  date: Date;
}
