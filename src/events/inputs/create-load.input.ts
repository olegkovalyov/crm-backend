import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { LoadStatus } from '../interfaces/load.interface';

@InputType()
export class CreateLoadInput {

  @Field()
  @IsNotEmpty()
  eventId: string;

  @Field()
  @IsEnum(LoadStatus)
  status: LoadStatus;

  @Field()
  @IsDate()
  date: Date;

  @Field()
  loadNumber: number;

  @Field()
  @IsNotEmpty()
  aircraft: string;

  @Field(type => [String])
  memberIds: string[];

  @Field(type => [String])
  clientIds: string[];

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
