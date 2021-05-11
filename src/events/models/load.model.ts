import {Field, Int, ObjectType} from '@nestjs/graphql';
import {IsEnum} from 'class-validator';
import {LoadStatus} from '../interfaces/load.interface';
import {EventModel} from './event.model';

@ObjectType()
export class LoadModel {

  @Field(type => Int)
  id: number;

  @Field(type => EventModel)
  event: EventModel;

  @Field(type => Int)
  capacity: number;

  @Field(type => LoadStatus)
  @IsEnum(LoadStatus)
  status: LoadStatus;

  @Field(type => Int, {nullable: true})
  order?: number;

  @Field(type => Int)
  time: number;

  @Field({nullable: true})
  notes?: string;
}
