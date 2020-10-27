import { Field, ObjectType } from '@nestjs/graphql';
import { MemberModel } from '../../members/models/member.model';
import { IsEnum } from 'class-validator';
import { PassengerStatus } from '../interfaces/client.interface';

@ObjectType()
export class ClientModel {

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
  withHandCameraVideo: boolean;

  @Field()
  withCameraman: boolean;

  @Field()
  onlyFlight: boolean;

  @Field()
  paid: boolean;

  @Field(type => MemberModel, {nullable: true})
  tm: MemberModel;

  @Field(type => MemberModel, {nullable: true})
  cameraman: MemberModel;

  @Field({ nullable: true })
  date: Date;

  @Field({ nullable: true })
  notes: string;
}
