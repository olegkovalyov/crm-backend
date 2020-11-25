import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { LoadStatus } from '../../interfaces/load.interface';

@InputType()
export class SlotInput {
  @Field(type => Int)
  userId: number;

  @Field()
  description: string;
}

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

  @Field(type => [SlotInput])
  slots?: SlotInput[];

  @Field()
  @IsNotEmpty()
  aircraft: string;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
