import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PassengerStatus } from '../interfaces/client.interface';

@InputType()
export class UpdateClientInput {

  @Field()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsOptional()
  @IsEnum(PassengerStatus)
  status?: PassengerStatus;

  @Field()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  firstName?: string;

  @Field()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  lastName?: string;

  @Field()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  gender?: string;

  @Field()
  @IsOptional()
  @IsInt()
  weight?: number;

  @Field()
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  phone?: string;

  @Field()
  @IsOptional()
  @IsBoolean()
  withHandCameraVideo?: boolean;

  @Field()
  @IsOptional()
  @IsBoolean()
  withCameraman?: boolean;

  @Field()
  @IsOptional()
  @IsBoolean()
  onlyFlight?: boolean;

  @Field()
  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  tmId?: string;

  @Field({ nullable: true })
  @IsOptional()
  cameramanId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  date?: Date;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
