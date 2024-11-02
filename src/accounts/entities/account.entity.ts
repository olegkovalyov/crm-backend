import {ObjectType, Field, Int} from '@nestjs/graphql';
import {CreateAccountInput} from '../dto/create-account.input';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@ObjectType()
@Entity()
export class Account {
  private constructor(email: string) {
    this.email = email;
  }

  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({unique: true})
  email: string;

  static create(input: CreateAccountInput): Account {
    return new Account(input.email);
  }
}
