import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from '../interfaces/user.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: true,
  })
  userType: UserType;
}
