import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Load } from './load.entity';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Load, { onDelete: 'CASCADE' })
  @JoinColumn()
  load: Load;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  description: string;
}
