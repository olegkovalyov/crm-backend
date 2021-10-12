import {Field, InputType} from '@nestjs/graphql';
import {IsDate, IsDefined, IsNotEmpty, IsOptional, MaxLength, MinLength} from 'class-validator';
import {IsEventDateCorrect} from '../../decorators/event-date-validator.decorator';

@InputType()
export class CreateEventInput {

  @Field({nullable: true})
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @Field({nullable: true})
  @IsDefined()
  @IsNotEmpty()
  @IsDate()
  @IsEventDateCorrect('endDate', {message: 'Start Date should be less than End Date'})
  startDate: Date;

  @Field({nullable: true})
  @IsDefined()
  @IsNotEmpty()
  @IsDate()
  @IsEventDateCorrect('startDate', {message: 'End Date should be greater than Start Date'})
  endDate: Date;

  @Field({nullable: true})
  @IsOptional()
  notes?: string;
}
