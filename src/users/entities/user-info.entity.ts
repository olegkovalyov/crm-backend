import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import {User} from './user.entity';
import {LicenseType, UserRole, UserStatus} from '../interfaces/user.interface';

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, {onDelete: 'CASCADE'})
  @JoinColumn()
  user: User;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
  })
  role: UserRole[];

  @Column({
    type: 'enum',
    enum: LicenseType,
  })
  licenseType: LicenseType;
}
