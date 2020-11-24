import { Field, InputType, Int } from '@nestjs/graphql';
import { ArrayUnique, IsDate, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

@InputType()
export class UpdateEventInput {

  @Field(type => Int)
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
  date?: Date;

  @Field(type => [Int], { nullable: true })
  @IsOptional()
  @ArrayUnique()
  staffIds?: number[];

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
