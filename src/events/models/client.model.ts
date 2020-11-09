import { Field, ObjectType } from '@nestjs/graphql';
import { MemberModel } from '../../members/models/member.model';
import { ClientStatus, ClientType, Gender, PaymentStatus } from '../interfaces/client.interface';

@ObjectType()
export class ClientModel {

  @Field()
  id: string;

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

  @Field(type => PaymentStatus)
  paymentStatus: PaymentStatus;

  @Field(type => MemberModel, { nullable: true })
  tm: MemberModel;

  @Field(type => MemberModel, { nullable: true })
  cameraman: MemberModel;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  processedAt: Date;

  @Field({ nullable: true })
  notes: string;

  @Field({ nullable: true })
  certificate: string;
}
