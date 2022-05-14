import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class GetEventsInput {

  @Field({
    nullable: true,
  })
  @IsOptional()
  name: string;

  @Field({
    nullable: true
  })
  @IsOptional()
  startDateMin?: Date;

  @Field({
    nullable: true
  })
  startDateMax?: Date;

  @Field({
    nullable: true
  })
  @IsOptional()
  endDateMin?: Date;

  @Field({
    nullable: true
  })
  endDateMax?: Date;
}
