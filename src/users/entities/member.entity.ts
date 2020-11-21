import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { LicenseType, MemberRole, MemberStatus } from '../interfaces/member.interface';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({
    type: 'enum',
    enum: MemberStatus,
    default: MemberStatus.ACTIVE,
  })
  status: MemberStatus;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: MemberRole,
    array: true,
  })
  roles: MemberRole[];

  @Column({
    type: 'enum',
    enum: LicenseType,
  })
  licenseType: LicenseType;

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

  @Column({
    nullable: true,
  })
  passwordHash: string;

  @Column({
    nullable: true,
  })
  passwordSalt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
