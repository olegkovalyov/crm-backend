import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn,
} from 'typeorm';
import {UserStatus} from '../../../user/interfaces/user.interface';
import {UserInfoEntity} from './user-info.entity';
import {UserCredentialsEntity} from './user-credentials.entity';
import {Exclude} from 'class-transformer';
import {classToClass} from 'class-transformer';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  personId: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @OneToOne(
    () => UserInfoEntity,
    (userInfo) => userInfo.user,
    {
      eager: true,
      cascade: true,
    },
  )
  userInfo: UserInfoEntity;

  @OneToOne(
    () => UserCredentialsEntity,
    (credentials) => credentials.user,
    {
      eager: true,
      cascade: true,
    },
  )
  @Exclude({toClassOnly: true})
  credentials: UserCredentialsEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  excludeCredentials() {
    return classToClass(this);
  }
}

