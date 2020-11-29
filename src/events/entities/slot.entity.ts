import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Load } from './load.entity';
import { UserRole } from '../../users/interfaces/user.interface';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Load,
    load => load.slots,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  load: Load;

  @Column({
    type: 'int',
  })
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: true,
  })
  role: typeof UserRole;

  @Column()
  description: string;
}
