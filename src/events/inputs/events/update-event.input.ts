import {Field, InputType, Int} from '@nestjs/graphql';
import {IsDate, IsNotEmpty, IsOptional, MaxLength, MinLength} from 'class-validator';

@InputType()
export class UpdateEventInput {

  @Field(type => Int)
  @IsNotEmpty()
  id: number;

  @Field()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  title?: string;

  @Field()
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @Field()
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field({nullable: true})
  @IsOptional()
  notes?: string;
}
