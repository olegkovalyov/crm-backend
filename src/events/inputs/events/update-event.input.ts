import {Field, InputType, Int} from '@nestjs/graphql';
import {IsDate, IsNotEmpty, IsOptional, MaxLength, MinLength} from 'class-validator';

@InputType()
export class UpdateEventInput {

  @Field(() => Int)
  @IsNotEmpty()
  id: number;

  @Field()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  name?: string;

  @Field()
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @Field()
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field()
  @IsOptional()
  info?: string;
}
