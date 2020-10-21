import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, ArrayUnique, IsDate, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

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

  @Field(type => [String])
  @ArrayUnique()
  staffIds?: string[];

  @Field()
  @IsOptional()
  notes: string;
}
