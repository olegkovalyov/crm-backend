import {Field, InputType, Int} from '@nestjs/graphql';
import {IsDate, IsEnum, IsNotEmpty, IsOptional} from 'class-validator';
import {LoadStatus} from '../../interfaces/load.interface';

@InputType()
export class UpdateLoadInput {

  @Field(type => Int)
  @IsNotEmpty()
  id: number;

  @Field(type => Int)
  @IsOptional()
  capacity?: number;

  @Field(type => LoadStatus)
  @IsOptional()
  @IsEnum(LoadStatus)
  status?: LoadStatus;

  @Field(type => Int)
  @IsOptional()
  order?: number;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsDate()
  time?: number;

  @Field({nullable: true})
  @IsOptional()
  notes?: string;
}
