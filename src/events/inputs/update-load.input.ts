import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { LoadStatus } from '../interfaces/load.interface';

@InputType()
export class UpdateLoadInput {

  @Field()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsOptional()
  @IsEnum(LoadStatus)
  status?: LoadStatus;

  @Field()
  @IsOptional()
  @IsDate()
  date?: Date;

  @Field()
  @IsOptional()
  loadNumber?: number;

  @Field()
  @IsOptional()
  aircraft?: string;

  @Field(type => [String])
  @IsOptional()
  memberIds?: string[];

  @Field(type => [String])
  @IsOptional()
  clientIds?: string[];

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
