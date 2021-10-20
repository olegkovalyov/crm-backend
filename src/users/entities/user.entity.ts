import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {UserStatus} from '../interfaces/user.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    nullable: true,
  })
  passwordSalt: string;

  @Column({
    nullable: true,
  })
  passwordHash: string;

  @Column({
    nullable: true,
  })
  resetPasswordToken: string;

  @Column({
    nullable: true,
  })
  resetPasswordExpirationDate: Date;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
