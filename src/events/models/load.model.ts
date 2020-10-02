import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { LoadStatus } from '../interfaces/load.interface';
import { EventModel } from './event.model';


@ObjectType()
export class LoadModel {

  @Field()
  id: string;

  @Field(type => EventModel, { nullable: true })
  event?: EventModel;

  @Field()
  @IsEnum(LoadStatus)
  status: LoadStatus;

  @Field()
  date: Date;

  @Field()
  loadNumber: number;

  @Field()
  aircraft: string;

  @Field({ nullable: true })
  notes?: string;
}
