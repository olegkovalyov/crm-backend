import {Field, Int, ObjectType} from '@nestjs/graphql';
import {ClientStatus, ClientRole, Gender} from '../interfaces/client.interface';

@ObjectType()
export class ClientModel {

  @Field(type => Int)
  id: number;

  @Field(type => Int)
  userId: number;

  @Field(type => ClientRole)
  role: ClientRole;

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

  @Field({nullable: true})
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

  @Field({nullable: true})
  notes: string;

  @Field({nullable: true})
  certificate: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({nullable: true})
  processedAt: Date;
}
