import {Field, InputType} from '@nestjs/graphql';
import {IsDate, IsNotEmpty, MaxLength, MinLength} from 'class-validator';
import {IsEventDateCorrect} from '../../decorators/event-date-validator.decorator';

@InputType()
export class CreateEventInput {

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  @IsEventDateCorrect('endDate',
    {
      message: 'Start Date should be less than End Date',
    })
  startDate: Date;

  @Field()
  @IsNotEmpty()
  @IsDate()
  @IsEventDateCorrect('startDate',
    {
      message: 'End Date should be greater than Start Date',
    })
  endDate: Date;

  @Field()
  info: string;
}
