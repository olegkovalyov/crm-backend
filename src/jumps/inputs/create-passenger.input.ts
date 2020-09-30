import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { PassengerStatus } from '../interfaces/passenger.interface';

@InputType()
export class CreatePassengerInput {

  @Field()
  @IsEnum(PassengerStatus)
  status: PassengerStatus;

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  firstName: string;

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  lastName: string;

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  gender: string;

  @Field()
  @IsNotEmpty()
  @IsInt()
  weight: number;

  @Field()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  phone: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  handCamera: boolean;

  @Field({ nullable: true })
  @IsOptional()
  operatorId?: string;

  @Field({ nullable: true })
  @IsOptional()
  instructorId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  numberOfLoad?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  jumpDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
