import {Field, Int, ObjectType} from '@nestjs/graphql';
import {ClientStatus, ClientRole, Gender, PaymentStatus} from '../interfaces/client.interface';

@ObjectType()
export class ClientModel {

  @Field(type => Int)
  id: number;

  @Field()
  personId: string;

  @Field(type => ClientRole)
  role: ClientRole;

  @Field(type => ClientStatus)
  status: ClientStatus;

  @Field(type => PaymentStatus)
  paymentStatus: PaymentStatus;

  @Field(type => Gender)
  gender: Gender;

  @Field()
  dateOfBirth: Date;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({nullable: true})
  email: string;

  @Field()
  weight: number;

  @Field()
  phone: string;

  @Field({nullable: true})
  certificate: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({nullable: true})
  processedAt: Date;
}
