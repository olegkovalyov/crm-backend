import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateEventInput {

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @Field()
  @IsDate()
  date: Date;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
