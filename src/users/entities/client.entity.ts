import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne, CreateDateColumn, ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { ClientStatus, ClientRole, Gender, PaymentStatus } from '../interfaces/client.interface';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({
    type: 'enum',
    enum: ClientRole,
    nullable: true,
  })
  role: ClientRole;

  @Column({
    type: 'enum',
    enum: ClientStatus,
    nullable: true,
  })
  status: ClientStatus;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column()
  age: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  weight: number;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  withHandCameraVideo: boolean;

  @Column()
  withCameraman: boolean;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    nullable: true,
  })
  paymentStatus: PaymentStatus;

  @Column({
    nullable: true,
  })
  notes: string;

  @Column({
    nullable: true,
  })
  certificate: string;

  @ManyToOne(() => User)
  @JoinColumn()
  tm: User;

  @ManyToOne(() => User)
  @JoinColumn()
  cameraman: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    default: false,
  })
  isAssigned: boolean;

  @Column({
    nullable: true,
  })
  processedAt: Date;
}
