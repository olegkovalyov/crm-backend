import { Field, InputType, Int } from '@nestjs/graphql';
import { ArrayUnique, IsDate, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

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

  @Field(type => [Int], { nullable: true })
  @ArrayUnique()
  staffIds?: number[];

  @Field()
  @IsOptional()
  notes: string;
}
