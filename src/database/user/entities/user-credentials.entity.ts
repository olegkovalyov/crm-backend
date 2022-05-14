import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import {UserEntity} from './user.entity';

@Entity({
  name: 'user_credentials',
})
export class UserCredentialsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity,
    {
      onDelete: 'CASCADE',
    })
  @JoinColumn()
  user: UserEntity;

  @Column({
    nullable: true,
  })
  passwordSalt: string;

  @Column({
    nullable: true,
  })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

