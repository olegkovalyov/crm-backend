import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../users/models/user.model';
import { IsEnum } from 'class-validator';
import { PassengerStatus } from '../interfaces/passenger.interface';
import { LoadModel } from './load.model';

@ObjectType()
export class PassengerModel {

  @Field()
  id: string;

  @Field()
  @IsEnum(PassengerStatus)
  status: PassengerStatus;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  gender: string;

  @Field()
  weight: number;

  @Field()
  phone: string;

  @Field()
  handCamera: boolean;

  @Field()
  cameraman: boolean;


  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  notes?: string;
}
