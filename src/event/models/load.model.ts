import {Field, ObjectType} from '@nestjs/graphql';
import {IsEnum} from 'class-validator';
import {LoadStatus} from '../interfaces/load.interface';
import {SlotModel} from './slot.model';

@ObjectType()
export class LoadModel {

  @Field()
  id: number;

  @Field()
  capacity: number;

  @Field(() => LoadStatus)
  @IsEnum(LoadStatus)
  status: LoadStatus;

  @Field()
  order: number;

  @Field({
    nullable: true,
  })
  takeOffTime?: Date;

  @Field({
    nullable: true,
  })
  landingTime?: Date;

  @Field(() => [SlotModel])
  slots: SlotModel[];

  @Field()
  info: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
