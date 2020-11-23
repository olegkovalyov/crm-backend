import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ClientStatus, ClientType, Gender, PaymentStatus } from '../interfaces/client.interface';
import { UserModel } from './user.model';

@ObjectType()
export class ClientModel {

  @Field( type => Int)
  id: number;

  @Field( type => Int)
  userId: number;

  @Field(type => ClientType)
  type: ClientType;

  @Field(type => ClientStatus)
  status: ClientStatus;

  @Field(type => Gender)
  gender: Gender;

  @Field()
  age: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  email: string;

  @Field()
  weight: number;

  @Field()
  phone: string;

  @Field()
  address: string;

  @Field()
  withHandCameraVideo: boolean;

  @Field()
  withCameraman: boolean;

  @Field({ nullable: true })
  notes: string;

  @Field({ nullable: true })
  certificate: string;

  @Field(type => PaymentStatus)
  paymentStatus: PaymentStatus;

  @Field(type => UserModel, { nullable: true })
  tm: UserModel;

  @Field(type => UserModel, { nullable: true })
  cameraman: UserModel;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  processedAt: Date;
}
