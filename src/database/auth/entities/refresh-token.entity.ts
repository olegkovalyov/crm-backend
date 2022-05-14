import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import {UserEntity} from '../../user/entities/user.entity';

@Entity({
  name: 'refresh_token',
})
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => UserEntity,
    (user) => user.id,
    {onDelete: 'CASCADE'},
  )
  @JoinColumn()
  user: UserEntity;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
