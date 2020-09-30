import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../users/models/user.model';
import { IsEnum } from 'class-validator';
import { PassengerStatus } from '../interfaces/passenger.interface';

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

  @Field(type => UserModel, { nullable: true })
  operator?: UserModel;

  @Field(type => UserModel, { nullable: true })
  instructor?: UserModel;

  @Field({ nullable: true })
  jumpDate?: string;

  @Field({ nullable: true })
  numberOfLoad?: number;

  @Field({ nullable: true })
  notes?: string;
}
