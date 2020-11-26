import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { LoadStatus } from '../../interfaces/load.interface';
import { SlotInput } from './slot.input';

@InputType()
export class UpdateLoadInput {

  @Field(type=> Int)
  @IsNotEmpty()
  id: number;

  @Field(type => LoadStatus)
  @IsOptional()
  @IsEnum(LoadStatus)
  status?: LoadStatus;

  @Field(type => Int)
  @IsOptional()
  order?: number;

  @Field()
  @IsOptional()
  @IsDate()
  date?: Date;

  @Field(type => [SlotInput])
  @IsOptional()
  slots?: SlotInput[];

  @Field()
  @IsOptional()
  aircraft?: string;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;

}
