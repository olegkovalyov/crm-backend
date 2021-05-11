import {Field, InputType} from '@nestjs/graphql';
import {IsDate, IsNotEmpty, IsOptional, MaxLength, MinLength} from 'class-validator';

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

  @Field({nullable: true})
  @IsOptional()
  notes?: string;
}
