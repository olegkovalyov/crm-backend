import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class GetEventsFilterInput {

  @Field()
  @IsOptional()
  dateMin?: Date;

  @Field()
  @IsOptional()
  dateMax?: Date;
}
