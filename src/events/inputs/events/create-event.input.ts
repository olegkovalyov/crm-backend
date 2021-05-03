import {Field, InputType} from '@nestjs/graphql';
import {IsDate, IsNotEmpty, MaxLength, MinLength} from 'class-validator';

@InputType()
export class CreateEventInput {

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @Field()
  @IsDate()
  startDate: Date;

  @Field()
  @IsDate()
  endDate: Date;

  @Field()
  @IsNotEmpty()
  notes: string;
}
