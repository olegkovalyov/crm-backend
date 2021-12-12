import {Field, InputType, Int} from '@nestjs/graphql';
import {IsDate, IsNotEmpty, IsOptional} from 'class-validator';
import {LoadStatus} from '../../interfaces/load.interface';

@InputType()
export class UpdateLoadInput {

  @Field(() => Int)
  @IsNotEmpty()
  id: number;

  @Field(() => Int)
  @IsOptional()
  capacity?: number;

  @Field(() => LoadStatus)
  @IsOptional()
  status?: LoadStatus;

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
