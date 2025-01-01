import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity({
  name: 'auth',
})
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  accountId: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @VersionColumn()
  version: number;
}
