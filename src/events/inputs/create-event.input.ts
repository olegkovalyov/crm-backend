import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateEventInput {

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @Field()
  @IsDate()
  date: Date;

  @Field()
  @IsOptional()
  notes: string;
}
