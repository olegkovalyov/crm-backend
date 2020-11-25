import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { LoadStatus } from '../interfaces/load.interface';
import { EventModel } from './event.model';
import { SlotModel } from './slot.model';


@ObjectType()
export class LoadModel {

  @Field(type => Int)
  id: number;

  @Field(type => EventModel)
  event: EventModel;

  @Field(type => Int)
  order: number;

  @Field(type => LoadStatus)
  @IsEnum(LoadStatus)
  status: LoadStatus;

  @Field()
  date: Date;

  @Field(type => [SlotModel])
  slots: SlotModel[];

  @Field()
  aircraft: string;

  @Field({ nullable: true })
  notes?: string;
}
