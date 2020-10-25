import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
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
  withHandCameraVideo: boolean;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  withCameraman: boolean;

  @Field({ nullable: true })
  @IsOptional()
  tmId: string;

  @Field({ nullable: true })
  @IsOptional()
  cameramanId: string;


  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  date: Date;

  @Field({ nullable: true })
  @IsOptional()
  notes: string;
}
