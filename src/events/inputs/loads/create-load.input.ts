import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { LoadStatus } from '../../interfaces/load.interface';

@InputType()
export class CreateLoadInput {

  @Field(type => Int)
  @IsNotEmpty()
  eventId: number;

  @Field(type => LoadStatus)
  @IsEnum(LoadStatus)
  status: LoadStatus;

  @Field(type => Int)
  order: number;

  @Field()
  @IsDate()
  date: Date;

  @Field()
  aircraft: string;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
