import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

@InputType()
export class UpdateEventInput {

  @Field()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  name?: string;

  @Field()
  @IsOptional()
  @IsDate()
  date?: Date;

  @Field()
  @IsOptional()
  notes?: string;
}
