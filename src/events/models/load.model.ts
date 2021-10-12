import {Field, Int, ObjectType} from '@nestjs/graphql';
import {IsEnum} from 'class-validator';
import {LoadStatus} from '../interfaces/load.interface';
import {SlotModel} from './slot.model';

@ObjectType()
export class LoadModel {

  @Field(type => Int)
  id: number;

  @Field(type => Int)
  capacity: number;

  @Field(type => LoadStatus)
  @IsEnum(LoadStatus)
  status: LoadStatus;

  @Field(type => Int, {nullable: true})
  order?: number;

  @Field(type => Int)
  time: number;

  @Field(type => [SlotModel])
  slots: SlotModel[];

  @Field({nullable: true})
  notes?: string;
}
