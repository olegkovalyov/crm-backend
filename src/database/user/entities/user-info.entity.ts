import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import {UserEntity} from './user.entity';
import {LicenseType, UserRole} from '../../../user/interfaces/user.interface';

@Entity({
  name: 'user_info',
})
export class UserInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, {onDelete: 'CASCADE'})
  @JoinColumn()
  user: UserEntity;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
