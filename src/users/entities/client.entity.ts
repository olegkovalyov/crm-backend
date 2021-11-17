import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {ClientStatus, ClientRole, Gender, PaymentStatus} from '../interfaces/client.interface';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  personId: string;

  @Column({
    type: 'enum',
    enum: ClientRole,
  })
  role: ClientRole;

  @Column({
    type: 'enum',
    enum: ClientStatus,
  })
  status: ClientStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column()
  dateOfBirth: Date;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column()
  weight: number;

  @Column()
  phone: string;

  @Column({
    nullable: true,
  })
  certificate: string;

  @Column({
    nullable: true,
  })
  additionalInfo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  processedAt: Date;
}
