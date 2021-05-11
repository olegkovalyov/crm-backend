import {Field, InputType, Int} from '@nestjs/graphql';
import {IsDate, IsEnum, IsNotEmpty, IsOptional} from 'class-validator';
import {LoadStatus} from '../../interfaces/load.interface';

@InputType()
export class CreateLoadInput {

  @Field(type => Int)
  @IsNotEmpty()
  eventId: number;

  @Field(type => Int)
  @IsNotEmpty()
  capacity: number;

  @Field(type => LoadStatus)
  @IsEnum(LoadStatus)
  status: LoadStatus;

  @Field(type => Int, {nullable: true})
  order?: number;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  time?: number;

  @Field({nullable: true})
  @IsOptional()
  notes?: string;
}
