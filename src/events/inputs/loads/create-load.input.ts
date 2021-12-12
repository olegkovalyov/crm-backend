import {Field, InputType} from '@nestjs/graphql';
import {IsDate, IsEnum, IsNotEmpty, IsOptional} from 'class-validator';
import {LoadStatus} from '../../interfaces/load.interface';

@InputType()
export class CreateLoadInput {

  @Field()
  @IsNotEmpty()
  eventId: number;

  @Field()
  @IsNotEmpty()
  capacity: number;

  @Field(() => LoadStatus)
  @IsEnum(LoadStatus)
  status: LoadStatus;

  @Field()
  @IsOptional()
  @IsDate()
  takeOffTime?: Date;

  @Field()
  @IsOptional()
  @IsDate()
  landingTime?: Date;

  @Field()
  @IsOptional()
  info?: string;
}
